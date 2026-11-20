import { NextResponse } from "next/server";
import {
  getMembers,
  updateMember,
  deleteMember,
} from "@/lib/khalilabad-army-db";

function isAuthorized(request: Request): boolean {
  const adminSecret = process.env.ADMIN_PASSWORD || "Zxcvbnm@12345";
  const authHeader = request.headers.get("x-admin-token") || "";
  const cookieHeader = request.headers.get("cookie") || "";
  const hasCookie = cookieHeader.includes(`admin_token=${adminSecret}`);
  return authHeader === adminSecret || hasCookie;
}

export async function GET(request: Request) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ ok: false, error: "unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const search = searchParams.get("search") || undefined;
  const status = searchParams.get("status") || undefined;
  const interested_area = searchParams.get("interested_area") || undefined;

  try {
    const members = await getMembers({ search, status, interested_area });
    return NextResponse.json({ ok: true, members });
  } catch (error) {
    console.error("[khalilabad-army/members] GET Error:", error);
    return NextResponse.json({ ok: false, error: "fetch_failed" }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ ok: false, error: "unauthorized" }, { status: 401 });
  }

  try {
    const body = (await request.json()) as { id?: string; updates?: Record<string, unknown> };
    const { id, updates } = body;

    if (!id || !updates) {
      return NextResponse.json({ ok: false, error: "missing_fields" }, { status: 400 });
    }

    const result = await updateMember(id, updates);
    if (!result.success) {
      return NextResponse.json({ ok: false, error: result.error || "update_failed" }, { status: 400 });
    }

    return NextResponse.json({ ok: true, member: result.member });
  } catch (error) {
    console.error("[khalilabad-army/members] PATCH Error:", error);
    return NextResponse.json({ ok: false, error: "internal_error" }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ ok: false, error: "unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");

  if (!id) {
    return NextResponse.json({ ok: false, error: "missing_id" }, { status: 400 });
  }

  try {
    const result = await deleteMember(id);
    if (!result.success) {
      return NextResponse.json({ ok: false, error: result.error || "delete_failed" }, { status: 400 });
    }
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("[khalilabad-army/members] DELETE Error:", error);
    return NextResponse.json({ ok: false, error: "internal_error" }, { status: 500 });
  }
}
