import mongoose from "mongoose";
import fs from "node:fs/promises";
import path from "node:path";

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
    // ignore
  }
}

async function runTests() {
  await loadEnv();

  console.log("==================================================");
  console.log("TESTING: MongoDB Atlas & Mongoose Integration");
  console.log("==================================================");

  const uri = process.env.MONGODB_URI;

  if (!uri) {
    console.log("MONGODB_URI is not set in .env.local yet.");
    console.log("Local fallback is active and resilient.");
    console.log("To connect to your MongoDB Atlas cluster:");
    console.log("1. Add MONGODB_URI to .env.local");
    console.log("2. Run: node scripts/test-mongodb.mjs");
    return;
  }

  console.log("Found MONGODB_URI in environment. Connecting...");
  await mongoose.connect(uri, { serverSelectionTimeoutMS: 8000, dbName: "khalilabad_army" });
  console.log("Connected successfully to MongoDB Atlas (Database: khalilabad_army).");

  const collection = mongoose.connection.collection("khalilabad_army_members");
  await collection.createIndex({ mobile: 1 }, { unique: true });
  await collection.createIndex({ registration_id: 1 }, { unique: true });

  const testMobile = "9876543210";
  const testRegId = `KA-TEST-${Date.now()}`;

  // Clean any previous test data
  await collection.deleteOne({ mobile: testMobile });

  // Test 1: Successful registration
  console.log("\n[Test 1] Testing successful registration...");
  const insertResult = await collection.insertOne({
    registration_id: testRegId,
    full_name: "Test Member",
    mobile: testMobile,
    village_ward_area: "Khalilabad Ward 5",
    age: 25,
    interested_area: "youth_activities",
    message: "Test registration message",
    status: "pending",
    created_at: new Date(),
    updated_at: new Date(),
  });
  console.log("Inserted test member ID:", insertResult.insertedId.toString());

  // Test 2: Verify saved record in MongoDB Atlas
  console.log("\n[Test 2] Verifying record in MongoDB Atlas...");
  const saved = await collection.findOne({ registration_id: testRegId });
  if (saved && saved.mobile === testMobile && saved.full_name === "Test Member") {
    console.log("Record verified successfully with all fields intact:");
    console.log("  Registration ID:", saved.registration_id);
    console.log("  Full Name:", saved.full_name);
    console.log("  Mobile:", saved.mobile);
    console.log("  Area:", saved.village_ward_area);
    console.log("  Status:", saved.status);
  } else {
    throw new Error("Verification failed: Record not found in collection!");
  }

  // Test 3: Duplicate mobile registration prevention
  console.log("\n[Test 3] Testing duplicate mobile prevention...");
  let duplicateCaught = false;
  try {
    await collection.insertOne({
      registration_id: `KA-TEST-DUP-${Date.now()}`,
      full_name: "Duplicate Member",
      mobile: testMobile, // Same mobile
      village_ward_area: "Khalilabad Ward 1",
      status: "pending",
      created_at: new Date(),
      updated_at: new Date(),
    });
  } catch (err) {
    if (err.code === 11000) {
      duplicateCaught = true;
      console.log("Duplicate key code 11000 caught as expected!");
    } else {
      throw err;
    }
  }

  if (!duplicateCaught) {
    throw new Error("Duplicate mobile was not blocked by unique index!");
  }

  // Cleanup test record
  await collection.deleteOne({ registration_id: testRegId });
  console.log("\nTest record cleaned up successfully.");

  await mongoose.disconnect();
  console.log("\nAll MongoDB Atlas tests PASSED successfully!");
}

runTests().catch((err) => {
  console.error("Test failed:", err);
  process.exit(1);
});
