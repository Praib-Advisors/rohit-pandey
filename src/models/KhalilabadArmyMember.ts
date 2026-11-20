import mongoose, { Schema, Document, Model } from "mongoose";
import type { MemberStatus } from "@/lib/khalilabad-army-types";

export interface IKhalilabadArmyMember extends Document {
  registration_id: string;
  full_name: string;
  mobile: string;
  village_ward_area: string;
  age?: number | null;
  interested_area?: string | null;
  message?: string | null;
  status: MemberStatus;
  created_at: Date;
  updated_at: Date;
}

const KhalilabadArmyMemberSchema = new Schema<IKhalilabadArmyMember>(
  {
    registration_id: {
      type: String,
      required: true,
      unique: true,
      index: true,
      trim: true,
    },
    full_name: {
      type: String,
      required: true,
      trim: true,
    },
    mobile: {
      type: String,
      required: true,
      unique: true,
      index: true,
      trim: true,
    },
    village_ward_area: {
      type: String,
      required: true,
      trim: true,
    },
    age: {
      type: Number,
      default: null,
    },
    interested_area: {
      type: String,
      default: null,
      trim: true,
    },
    message: {
      type: String,
      default: null,
      trim: true,
    },
    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
      index: true,
    },
    created_at: {
      type: Date,
      default: Date.now,
      index: true,
    },
    updated_at: {
      type: Date,
      default: Date.now,
    },
  },
  {
    collection: "khalilabad_army_members",
    timestamps: { createdAt: "created_at", updatedAt: "updated_at" },
  }
);

// Prevent re-compilation of model in Next.js hot reload / serverless
export const KhalilabadArmyMemberModel: Model<IKhalilabadArmyMember> =
  mongoose.models.KhalilabadArmyMember ||
  mongoose.model<IKhalilabadArmyMember>(
    "KhalilabadArmyMember",
    KhalilabadArmyMemberSchema
  );

export default KhalilabadArmyMemberModel;
