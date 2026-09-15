import { NextRequest, NextResponse } from "next/server";
import { processVoiceTurn } from "@/lib/ai";
import { StudentRecord, CallStage } from "@/types";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { student, currentStage, studentMessage, history } = body as {
      student: StudentRecord;
      currentStage: CallStage;
      studentMessage: string;
      history?: Array<{ speaker: "agent" | "student"; text: string }>;
    };

    if (!student || !currentStage) {
      return NextResponse.json(
        { error: "Missing student record or currentStage" },
        { status: 400 }
      );
    }

    const safeHistory = Array.isArray(history) ? history : [];
    const aiResponse = await processVoiceTurn(
      student,
      currentStage,
      studentMessage || "",
      safeHistory
    );

    return NextResponse.json({
      success: true,
      data: aiResponse,
      timestamp: new Date().toISOString(),
    });
  } catch (err: unknown) {
    const errorMessage = err instanceof Error ? err.message : "Internal voice processing error";
    return NextResponse.json(
      { success: false, error: errorMessage },
      { status: 500 }
    );
  }
}
