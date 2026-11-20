/**
 * Migration Script: Supabase & Local DB to MongoDB Atlas
 *
 * Usage:
 *   node scripts/migrate-to-mongodb.mjs
 */

import fs from "node:fs/promises";
import path from "node:path";
import mongoose from "mongoose";

// Load .env.local manually if running via node
async function loadEnv() {
  try {
    const envPath = path.join(process.cwd(), ".env.local");
    const content = await fs.readFile(envPath, "utf-8");
    for (const line of content.split("\n")) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith("#")) continue;
      const eqIdx = trimmed.indexOf("=");
      if (eqIdx !== -1) {
        const key = trimmed.slice(0, eqIdx).trim();
        const val = trimmed.slice(eqIdx + 1).trim();
        if (!process.env[key]) {
          process.env[key] = val.replace(/^["']|["']$/g, "");
        }
      }
    }
  } catch {
    // .env.local not found or unreadable
  }
}

async function runMigration() {
  await loadEnv();

  console.log("==================================================");
  console.log("Khalilabad Army: Database Migration to MongoDB");
  console.log("==================================================");

  const mongoUri = process.env.MONGODB_URI;
  if (!mongoUri) {
    console.error("ERROR: MONGODB_URI environment variable is missing in .env.local");
    console.error("Please add MONGODB_URI to .env.local or your environment before running migration.");
    process.exit(1);
  }

  // 1. Connect to MongoDB
  const dbName = process.env.MONGODB_DB_NAME || "rohit_pandey_db";
  console.log(`\nConnecting to MongoDB Atlas (Database: ${dbName})...`);
  await mongoose.connect(mongoUri, { dbName });
  console.log(`Connected successfully to MongoDB Atlas (Database: ${dbName}).`);

  const collection = mongoose.connection.collection("khalilabad_army_members");

  // Ensure unique index on mobile and registration_id
  await collection.createIndex({ mobile: 1 }, { unique: true });
  await collection.createIndex({ registration_id: 1 }, { unique: true });

  const candidateMembers = [];

  // 2. Fetch from Supabase if configured
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL;
  const supabaseKey =
    process.env.SUPABASE_SERVICE_ROLE_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
    process.env.SUPABASE_ANON_KEY;

  if (supabaseUrl && supabaseKey) {
    console.log(`\nChecking Supabase: ${supabaseUrl}`);
    try {
      const res = await fetch(`${supabaseUrl.replace(/\/+$/, "")}/rest/v1/khalilabad_army_members?select=*`, {
        headers: {
          apikey: supabaseKey,
          Authorization: `Bearer ${supabaseKey}`,
        },
      });

      if (res.ok) {
        const supabaseMembers = await res.json();
        console.log(`Found ${supabaseMembers.length} records in Supabase.`);
        if (Array.isArray(supabaseMembers)) {
          candidateMembers.push(...supabaseMembers);
        }
      } else {
        console.log(`Supabase responded with status ${res.status} (${await res.text()})`);
      }
    } catch (err) {
      console.warn("Could not fetch from Supabase:", err.message);
    }
  } else {
    console.log("\nSupabase credentials not configured in environment (skipping Supabase fetch).");
  }

  // 3. Fetch from local JSON file
  const localDbPath = path.join(process.cwd(), "src", "data", "khalilabad_army_members.json");
  try {
    const localContent = await fs.readFile(localDbPath, "utf-8");
    const localMembers = JSON.parse(localContent);
    if (Array.isArray(localMembers) && localMembers.length > 0) {
      console.log(`Found ${localMembers.length} records in local storage.`);
      candidateMembers.push(...localMembers);
    }
  } catch {
    // No local file
  }

  console.log(`\nTotal candidate records to inspect: ${candidateMembers.length}`);

  let insertedCount = 0;
  let skippedCount = 0;

  for (const m of candidateMembers) {
    const cleanMobile = String(m.mobile || "").trim().replace(/\D/g, "");
    if (!cleanMobile) continue;

    const existing = await collection.findOne({ mobile: cleanMobile });
    if (existing) {
      skippedCount++;
      continue;
    }

    await collection.insertOne({
      registration_id: m.registration_id,
      full_name: m.full_name,
      mobile: cleanMobile,
      village_ward_area: m.village_ward_area,
      age: m.age ? Number(m.age) : null,
      interested_area: m.interested_area || null,
      message: m.message || null,
      status: m.status || "pending",
      created_at: m.created_at ? new Date(m.created_at) : new Date(),
      updated_at: m.updated_at ? new Date(m.updated_at) : new Date(),
    });
    insertedCount++;
  }

  const totalInMongo = await collection.countDocuments();

  console.log("==================================================");
  console.log("Migration Summary:");
  console.log(`- Inserted new: ${insertedCount}`);
  console.log(`- Skipped (already exist): ${skippedCount}`);
  console.log(`- Total records in MongoDB 'khalilabad_army_members': ${totalInMongo}`);
  console.log("==================================================");

  await mongoose.disconnect();
  console.log("Disconnected from MongoDB. Migration completed successfully.");
}

runMigration().catch((err) => {
  console.error("Migration failed:", err);
  process.exit(1);
});
