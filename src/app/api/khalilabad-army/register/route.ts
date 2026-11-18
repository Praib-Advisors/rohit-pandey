import { NextResponse } from "next/server";
import { registerMember } from "@/lib/khalilabad-army-db";
import {
  validateMemberInput,
  type RegisterMemberInput,
} from "@/lib/khalilabad-army-types";

export async function POST(request: Request) {
  try {
    let body: Partial<RegisterMemberInput>;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json(
        { ok: false, error: "invalid_json", message: "अमान्य डेटा प्राप्त हुआ।" },
        { status: 400 }
      );
    }

    const input: RegisterMemberInput = {
      full_name: String(body.full_name || "").trim(),
      mobile: String(body.mobile || "").trim(),
      village_ward_area: String(body.village_ward_area || "").trim(),
      age: body.age ? String(body.age).trim() : null,
      interested_area: body.interested_area ? String(body.interested_area).trim() : null,
      message: body.message ? String(body.message).trim() : null,
    };

    // Validation
    const validation = validateMemberInput(input);
    if (!validation.isValid) {
      return NextResponse.json(
        {
          ok: false,
          error: "validation_failed",
          errors: validation.errors,
          message: Object.values(validation.errors)[0],
        },
        { status: 422 }
      );
    }

    // Attempt registration
    const result = await registerMember(input);

    if (!result.success) {
      if (result.error === "duplicate_mobile") {
        return NextResponse.json(
          {
            ok: false,
            error: "duplicate_mobile",
            message:
              "यह मोबाइल नंबर पहले से खलीलाबाद आर्मी में पंजीकृत है।",
          },
          { status: 409 }
        );
      }

      return NextResponse.json(
        {
          ok: false,
          error: "registration_failed",
          message:
            "रजिस्ट्रेशन प्रक्रिया में समस्या आई। कृपया कुछ समय बाद पुनः प्रयास करें।",
        },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        ok: true,
        registrationId: result.member?.registration_id,
        member: {
          registration_id: result.member?.registration_id,
          full_name: result.member?.full_name,
          mobile: result.member?.mobile,
          village_ward_area: result.member?.village_ward_area,
          status: result.member?.status,
          created_at: result.member?.created_at,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("[khalilabad-army/register] Internal Error:", error);
    return NextResponse.json(
      {
        ok: false,
        error: "internal_server_error",
        message: "सर्वर त्रुटि हुई। कृपया पुनः प्रयास करें।",
      },
      { status: 500 }
    );
  }
}
