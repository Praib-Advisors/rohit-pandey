import fs from "node:fs/promises";
import path from "node:path";
import os from "node:os";
import type {
  KhalilabadArmyMember,
  MemberStatus,
  RegisterMemberInput,
} from "./khalilabad-army-types";

function isMongoConfigured(): boolean {
  return Boolean(
    typeof process !== "undefined" &&
      process.env?.MONGODB_URI &&
      process.env.MONGODB_URI.trim().length > 0
  );
}

// In-memory cache ensures resilient fallback on serverless environments
let memoryMembersCache: KhalilabadArmyMember[] = [];

function getStoragePath(): string {
  // In serverless environments (Vercel, AWS Lambda, production), process.cwd() is read-only.
  // os.tmpdir() (/tmp) is always writable.
  if (
    process.env.VERCEL ||
    process.env.AWS_LAMBDA_FUNCTION_NAME ||
    process.env.NODE_ENV === "production"
  ) {
    return path.join(os.tmpdir(), "khalilabad_army_members.json");
  }
  return path.join(process.cwd(), "src", "data", "khalilabad_army_members.json");
}

function getSupabaseConfig() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL;
  const key =
    process.env.SUPABASE_SERVICE_ROLE_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
    process.env.SUPABASE_ANON_KEY;

  if (url && key) {
    return {
      url: url.replace(/\/+$/, ""),
      key,
      isConfigured: true,
    };
  }
  return { url: "", key: "", isConfigured: false };
}

async function ensureLocalFile(): Promise<KhalilabadArmyMember[]> {
  const filePath = getStoragePath();
  try {
    await fs.mkdir(path.dirname(filePath), { recursive: true });
    const content = await fs.readFile(filePath, "utf-8");
    const parsed = JSON.parse(content) as KhalilabadArmyMember[];
    if (Array.isArray(parsed) && parsed.length > 0) {
      memoryMembersCache = parsed;
    }
    return memoryMembersCache;
  } catch {
    return memoryMembersCache;
  }
}

async function saveLocalFile(members: KhalilabadArmyMember[]): Promise<void> {
  memoryMembersCache = members;
  const filePath = getStoragePath();
  try {
    await fs.mkdir(path.dirname(filePath), { recursive: true });
    await fs.writeFile(filePath, JSON.stringify(members, null, 2), "utf-8");
  } catch (err) {
    console.warn("[khalilabad-army] Storage write warning (operating in-memory):", err);
  }
}

function generateRegistrationId(): string {
  const year = new Date().getFullYear();
  const randomDigits = Math.floor(10000 + Math.random() * 90000); // 5 digits
  return `KA-${year}-${randomDigits}`;
}

/**
 * Register a new member.
 * Prioritizes MongoDB Atlas if MONGODB_URI is provided.
 * Checks for duplicate 10-digit mobile numbers.
 * Safe fallback to Supabase / persistent local storage if MongoDB is not configured.
 */
export async function registerMember(
  input: RegisterMemberInput
): Promise<{ success: boolean; member?: KhalilabadArmyMember; error?: string }> {
  const cleanMobile = String(input.mobile).trim().replace(/\D/g, "");
  const now = new Date().toISOString();
  const regId = generateRegistrationId();
  const fallbackId =
    typeof crypto !== "undefined" && crypto.randomUUID
      ? crypto.randomUUID()
      : `mem_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;

  // 1. Try MongoDB Atlas (Primary Destination)
  if (isMongoConfigured()) {
    try {
      const { connectToDatabase } = await import("./mongodb");
      const { KhalilabadArmyMemberModel } = await import("@/models/KhalilabadArmyMember");
      await connectToDatabase();

      // Check for existing mobile number
      const existing = await KhalilabadArmyMemberModel.findOne({
        mobile: cleanMobile,
      }).lean();

      if (existing) {
        return {
          success: false,
          error: "duplicate_mobile",
        };
      }

      const doc = await KhalilabadArmyMemberModel.create({
        registration_id: regId,
        full_name: input.full_name.trim(),
        mobile: cleanMobile,
        village_ward_area: input.village_ward_area.trim(),
        age: input.age ? Number(input.age) : null,
        interested_area: input.interested_area?.trim() || null,
        message: input.message?.trim() || null,
        status: "pending",
      });

      const member: KhalilabadArmyMember = {
        id: doc._id.toString(),
        registration_id: doc.registration_id,
        full_name: doc.full_name,
        mobile: doc.mobile,
        village_ward_area: doc.village_ward_area,
        age: doc.age,
        interested_area: doc.interested_area,
        message: doc.message,
        status: doc.status as MemberStatus,
        created_at: doc.created_at ? doc.created_at.toISOString() : now,
        updated_at: doc.updated_at ? doc.updated_at.toISOString() : now,
      };

      return {
        success: true,
        member,
      };
    } catch (err: unknown) {
      // MongoDB duplicate key error code 11000
      const mongoErr = err as { code?: number; name?: string };
      if (mongoErr?.code === 11000) {
        return {
          success: false,
          error: "duplicate_mobile",
        };
      }
      console.error("[khalilabad-army] MongoDB registration error:", err);
      // Fallback to Supabase / local if MongoDB connection encounters a transient issue
    }
  }

  // 2. Try Supabase (Secondary / Legacy Fallback)
  const newMember: KhalilabadArmyMember = {
    id: fallbackId,
    registration_id: regId,
    full_name: input.full_name.trim(),
    mobile: cleanMobile,
    village_ward_area: input.village_ward_area.trim(),
    age: input.age ? Number(input.age) : null,
    interested_area: input.interested_area?.trim() || null,
    message: input.message?.trim() || null,
    status: "pending",
    created_at: now,
    updated_at: now,
  };

  const { isConfigured, url, key } = getSupabaseConfig();

  if (isConfigured) {
    try {
      // Check duplicate mobile in Supabase
      const checkRes = await fetch(
        `${url}/rest/v1/khalilabad_army_members?mobile=eq.${cleanMobile}&select=id`,
        {
          headers: {
            apikey: key,
            Authorization: `Bearer ${key}`,
          },
        }
      );

      if (checkRes.ok) {
        const existing = await checkRes.json();
        if (Array.isArray(existing) && existing.length > 0) {
          return {
            success: false,
            error: "duplicate_mobile",
          };
        }
      }

      // Insert member into Supabase
      const insertRes = await fetch(`${url}/rest/v1/khalilabad_army_members`, {
        method: "POST",
        headers: {
          apikey: key,
          Authorization: `Bearer ${key}`,
          "Content-Type": "application/json",
          Prefer: "return=representation",
        },
        body: JSON.stringify(newMember),
      });

      if (!insertRes.ok) {
        const errText = await insertRes.text();
        console.error("[khalilabad-army] Supabase insert failed:", errText);
        // Fallback to local/memory storage if table permissions fail
        return await registerMemberLocally(newMember, cleanMobile);
      }

      const inserted = await insertRes.json();
      return {
        success: true,
        member: Array.isArray(inserted) && inserted.length > 0 ? inserted[0] : newMember,
      };
    } catch (err) {
      console.error("[khalilabad-army] Supabase connection error:", err);
      // Fallback to local/memory storage
      return await registerMemberLocally(newMember, cleanMobile);
    }
  }

  // 3. Resilient Local / In-memory storage (Zero serverless crashes)
  return await registerMemberLocally(newMember, cleanMobile);
}

async function registerMemberLocally(
  newMember: KhalilabadArmyMember,
  cleanMobile: string
): Promise<{ success: boolean; member?: KhalilabadArmyMember; error?: string }> {
  const members = await ensureLocalFile();

  const isDuplicate = members.some((m) => m.mobile === cleanMobile);
  if (isDuplicate) {
    return {
      success: false,
      error: "duplicate_mobile",
    };
  }

  members.unshift(newMember);
  await saveLocalFile(members);

  return {
    success: true,
    member: newMember,
  };
}

/**
 * Retrieve members with optional search, status filtering, and sorting.
 */
export async function getMembers(options?: {
  search?: string;
  status?: string;
  interested_area?: string;
}): Promise<KhalilabadArmyMember[]> {
  // 1. Try MongoDB Atlas
  if (isMongoConfigured()) {
    try {
      const { connectToDatabase } = await import("./mongodb");
      const { KhalilabadArmyMemberModel } = await import("@/models/KhalilabadArmyMember");
      await connectToDatabase();

      const filter: Record<string, unknown> = {};

      if (options?.status && options.status !== "all") {
        filter.status = options.status;
      }
      if (options?.interested_area && options.interested_area !== "all") {
        filter.interested_area = options.interested_area;
      }
      if (options?.search) {
        const regex = new RegExp(options.search, "i");
        filter.$or = [
          { full_name: regex },
          { mobile: regex },
          { registration_id: regex },
          { village_ward_area: regex },
        ];
      }

      const docs = await KhalilabadArmyMemberModel.find(filter)
        .sort({ created_at: -1 })
        .lean();

      return docs.map((doc) => ({
        id: doc._id.toString(),
        registration_id: doc.registration_id,
        full_name: doc.full_name,
        mobile: doc.mobile,
        village_ward_area: doc.village_ward_area,
        age: doc.age,
        interested_area: doc.interested_area,
        message: doc.message,
        status: doc.status as MemberStatus,
        created_at: doc.created_at ? new Date(doc.created_at).toISOString() : new Date().toISOString(),
        updated_at: doc.updated_at ? new Date(doc.updated_at).toISOString() : new Date().toISOString(),
      }));
    } catch (err) {
      console.error("[khalilabad-army] MongoDB getMembers error:", err);
    }
  }

  // 2. Try Supabase
  const { isConfigured, url, key } = getSupabaseConfig();

  if (isConfigured) {
    try {
      let queryUrl = `${url}/rest/v1/khalilabad_army_members?select=*&order=created_at.desc`;

      if (options?.status && options.status !== "all") {
        queryUrl += `&status=eq.${encodeURIComponent(options.status)}`;
      }
      if (options?.interested_area && options.interested_area !== "all") {
        queryUrl += `&interested_area=eq.${encodeURIComponent(options.interested_area)}`;
      }

      const res = await fetch(queryUrl, {
        headers: {
          apikey: key,
          Authorization: `Bearer ${key}`,
        },
      });

      if (res.ok) {
        let list: KhalilabadArmyMember[] = await res.json();
        if (options?.search) {
          const s = options.search.toLowerCase();
          list = list.filter(
            (m) =>
              m.full_name.toLowerCase().includes(s) ||
              m.mobile.includes(s) ||
              m.registration_id.toLowerCase().includes(s) ||
              m.village_ward_area.toLowerCase().includes(s)
          );
        }
        return list;
      }
    } catch (err) {
      console.error("[khalilabad-army] Supabase fetch failed, falling back to local:", err);
    }
  }

  // 3. Local fallback
  let list = await ensureLocalFile();

  if (options?.status && options.status !== "all") {
    list = list.filter((m) => m.status === options.status);
  }
  if (options?.interested_area && options.interested_area !== "all") {
    list = list.filter((m) => m.interested_area === options.interested_area);
  }
  if (options?.search) {
    const s = options.search.toLowerCase();
    list = list.filter(
      (m) =>
        m.full_name.toLowerCase().includes(s) ||
        m.mobile.includes(s) ||
        m.registration_id.toLowerCase().includes(s) ||
        m.village_ward_area.toLowerCase().includes(s)
    );
  }

  return list;
}

/**
 * Update member status or details.
 */
export async function updateMember(
  id: string,
  updates: Partial<KhalilabadArmyMember>
): Promise<{ success: boolean; member?: KhalilabadArmyMember; error?: string }> {
  const now = new Date().toISOString();
  const sanitizedUpdates = { ...updates, updated_at: now };

  // 1. Try MongoDB Atlas
  if (isMongoConfigured()) {
    try {
      const { connectToDatabase } = await import("./mongodb");
      const { KhalilabadArmyMemberModel } = await import("@/models/KhalilabadArmyMember");
      await connectToDatabase();
      const doc = await KhalilabadArmyMemberModel.findOneAndUpdate(
        { $or: [{ _id: id }, { registration_id: id }] },
        { $set: sanitizedUpdates },
        { new: true }
      ).lean();

      if (doc) {
        return {
          success: true,
          member: {
            id: doc._id.toString(),
            registration_id: doc.registration_id,
            full_name: doc.full_name,
            mobile: doc.mobile,
            village_ward_area: doc.village_ward_area,
            age: doc.age,
            interested_area: doc.interested_area,
            message: doc.message,
            status: doc.status as MemberStatus,
            created_at: doc.created_at ? new Date(doc.created_at).toISOString() : now,
            updated_at: doc.updated_at ? new Date(doc.updated_at).toISOString() : now,
          },
        };
      }
    } catch (err) {
      console.error("[khalilabad-army] MongoDB update error:", err);
    }
  }

  // 2. Try Supabase
  const { isConfigured, url, key } = getSupabaseConfig();

  if (isConfigured) {
    try {
      const res = await fetch(`${url}/rest/v1/khalilabad_army_members?id=eq.${id}`, {
        method: "PATCH",
        headers: {
          apikey: key,
          Authorization: `Bearer ${key}`,
          "Content-Type": "application/json",
          Prefer: "return=representation",
        },
        body: JSON.stringify(sanitizedUpdates),
      });

      if (res.ok) {
        const updated = await res.json();
        return {
          success: true,
          member: Array.isArray(updated) && updated.length > 0 ? updated[0] : undefined,
        };
      }
    } catch (err) {
      console.error("[khalilabad-army] Supabase update failed, falling back to local:", err);
    }
  }

  // 3. Local fallback
  const members = await ensureLocalFile();
  const index = members.findIndex((m) => m.id === id || m.registration_id === id);
  if (index === -1) {
    return { success: false, error: "Member not found" };
  }

  members[index] = {
    ...members[index],
    ...sanitizedUpdates,
  };
  await saveLocalFile(members);

  return { success: true, member: members[index] };
}

/**
 * Delete a member.
 */
export async function deleteMember(
  id: string
): Promise<{ success: boolean; error?: string }> {
  // 1. Try MongoDB Atlas
  if (isMongoConfigured()) {
    try {
      const { connectToDatabase } = await import("./mongodb");
      const { KhalilabadArmyMemberModel } = await import("@/models/KhalilabadArmyMember");
      await connectToDatabase();
      await KhalilabadArmyMemberModel.deleteOne({
        $or: [{ _id: id }, { registration_id: id }],
      });
      return { success: true };
    } catch (err) {
      console.error("[khalilabad-army] MongoDB delete error:", err);
    }
  }

  // 2. Try Supabase
  const { isConfigured, url, key } = getSupabaseConfig();

  if (isConfigured) {
    try {
      const res = await fetch(`${url}/rest/v1/khalilabad_army_members?id=eq.${id}`, {
        method: "DELETE",
        headers: {
          apikey: key,
          Authorization: `Bearer ${key}`,
        },
      });

      if (res.ok) {
        return { success: true };
      }
    } catch (err) {
      console.error("[khalilabad-army] Supabase delete failed, falling back to local:", err);
    }
  }

  // 3. Local fallback
  const members = await ensureLocalFile();
  const filtered = members.filter((m) => m.id !== id && m.registration_id !== id);
  await saveLocalFile(filtered);

  return { success: true };
}
