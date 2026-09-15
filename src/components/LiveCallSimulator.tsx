"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  PhoneCall,
  PhoneOff,
  Mic,
  Volume2,
  ShieldAlert,
  ShieldCheck,
  CheckCircle2,
  Sparkles,
  RefreshCw,
  Send,
  AlertCircle,
  Clock,
  UserCheck,
  Building2,
  PhoneForwarded,
} from "lucide-react";
import { StudentRecord, CallStage, TranscriptTurn } from "@/types";
import { INITIAL_STUDENTS } from "@/lib/mockData";
import { AiVoiceResponse } from "@/lib/ai";

interface LiveCallSimulatorProps {
  onLeadUpdated: (updatedStudent: StudentRecord) => void;
  selectedStudentId?: string;
}

export function LiveCallSimulator({
  onLeadUpdated,
  selectedStudentId,
}: LiveCallSimulatorProps) {
  const [student, setStudent] = useState<StudentRecord>(
    INITIAL_STUDENTS.find((s) => s.id === selectedStudentId) || INITIAL_STUDENTS[1] // Priya Patel
  );

  const [callActive, setCallActive] = useState<boolean>(false);
  const [currentStage, setCurrentStage] = useState<CallStage>("idle");
  const [transcript, setTranscript] = useState<TranscriptTurn[]>([]);
  const [userInput, setUserInput] = useState<string>("");
  const [loadingAi, setLoadingAi] = useState<boolean>(false);
  const [lastTelemetry, setLastTelemetry] = useState<{
    provider: string;
    model: string;
    latencyMs: number;
    complianceTag?: string;
  } | null>(null);
  const [ttsMuted, setTtsMuted] = useState<boolean>(false);
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);

  const transcriptEndRef = useRef<HTMLDivElement>(null);

  // Update selected student if parent changes
  useEffect(() => {
    if (selectedStudentId) {
      const found = INITIAL_STUDENTS.find((s) => s.id === selectedStudentId);
      if (found) {
        setStudent(found);
        resetCall();
      }
    }
  }, [selectedStudentId]);

  useEffect(() => {
    transcriptEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [transcript]);

  // Speech synthesis helper
  const speakAgent = (text: string) => {
    if (ttsMuted || typeof window === "undefined" || !("speechSynthesis" in window)) return;
    try {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 1.05;
      utterance.pitch = 1.0;
      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);
      window.speechSynthesis.speak(utterance);
    } catch {
      setIsSpeaking(false);
    }
  };

  const resetCall = () => {
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.cancel();
    }
    setCallActive(false);
    setCurrentStage("idle");
    setTranscript([]);
    setUserInput("");
    setLoadingAi(false);
    setIsSpeaking(false);
    setLastTelemetry(null);
  };

  // Start the call flow
  const handleStartCall = async () => {
    resetCall();
    setCallActive(true);
    setCurrentStage("ai_disclosure");
    setLoadingAi(true);

    try {
      const res = await fetch("/api/ai/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          student,
          currentStage: "ai_disclosure",
          studentMessage: "Call Connected",
          history: [],
        }),
      });

      const json = await res.json();
      if (json.success && json.data) {
        const data: AiVoiceResponse = json.data;
        const initialTurn: TranscriptTurn = {
          id: `t_${Date.now()}`,
          speaker: "agent",
          text: data.agentSpeech,
          timestampSec: 2,
          complianceTag: "CRTC_AI_DISCLOSURE",
        };
        setTranscript([initialTurn]);
        setCurrentStage(data.nextStage);
        setLastTelemetry({
          provider: data.provider,
          model: data.model,
          latencyMs: data.latencyMs,
          complianceTag: data.complianceTag,
        });
        speakAgent(data.agentSpeech);
      }
    } catch (e) {
      console.error("Failed to start AI turn", e);
    } finally {
      setLoadingAi(false);
    }
  };

  const handleEndCall = () => {
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.cancel();
    }
    setCallActive(false);
    setCurrentStage("completed");
    setIsSpeaking(false);
  };

  // Send a student response (typed or preset)
  const handleSendResponse = async (responseText: string) => {
    if (!responseText.trim() || !callActive || loadingAi) return;

    const studentTurn: TranscriptTurn = {
      id: `t_${Date.now()}`,
      speaker: "student",
      text: responseText,
      timestampSec: transcript.length * 6 + 5,
    };

    const newTranscript = [...transcript, studentTurn];
    setTranscript(newTranscript);
    setUserInput("");
    setLoadingAi(true);

    try {
      const res = await fetch("/api/ai/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          student,
          currentStage,
          studentMessage: responseText,
          history: newTranscript.map((t) => ({ speaker: t.speaker, text: t.text })),
        }),
      });

      const json = await res.json();
      if (json.success && json.data) {
        const data: AiVoiceResponse = json.data;
        const agentTurn: TranscriptTurn = {
          id: `t_${Date.now()}_agent`,
          speaker: "agent",
          text: data.agentSpeech,
          timestampSec: studentTurn.timestampSec + 4,
          complianceTag: (data.complianceTag as TranscriptTurn["complianceTag"]) || undefined,
        };

        const updatedTranscript = [...newTranscript, agentTurn];
        setTranscript(updatedTranscript);
        setCurrentStage(data.nextStage);
        setLastTelemetry({
          provider: data.provider,
          model: data.model,
          latencyMs: data.latencyMs,
          complianceTag: data.complianceTag,
        });

        speakAgent(data.agentSpeech);

        // Update student record status if outcome arrived
        if (data.extractedData.branchOutcome) {
          const outcome = data.extractedData.branchOutcome;
          let newStatus: StudentRecord["verificationStatus"] = student.verificationStatus;
          if (outcome === "transfer" || outcome === "callback") {
            newStatus = "Verified & Interested";
          } else if (outcome === "closed") {
            newStatus = "Not Interested / Closed";
          } else if (outcome === "flag_bad") {
            newStatus = "Invalid / Disconnected";
          } else if (outcome === "dnc") {
            newStatus = "DNC Opt-Out (Permanent)";
          }

          const updatedStudent: StudentRecord = {
            ...student,
            verificationStatus: newStatus,
            lastDialedAt: "Just now",
            callDurationSec: updatedTranscript.length * 8,
            callTranscript: updatedTranscript,
            verifiedDetails: {
              identityConfirmed: data.extractedData.identityConfirmed ?? true,
              confirmedProgram: data.extractedData.confirmedProgram || student.originalProgramInterest,
              confirmedCity: data.extractedData.confirmedCity || student.city,
              confirmedEmployment: data.extractedData.confirmedEmployment || student.currentEmploymentStatus,
              lookingToEnrol: data.extractedData.lookingToEnrol ?? true,
              targetIntake: data.extractedData.targetIntake || "Immediate (Next 30 Days)",
              tuitionAcknowledged: data.extractedData.tuitionAcknowledged ?? true,
              consentToShareTimestamp: data.extractedData.consentGranted ? new Date().toISOString() : undefined,
              consentVerbalQuote: data.extractedData.consentGranted ? responseText : undefined,
              consentSha256: data.extractedData.consentGranted ? "crtc_8a3c2e11b5c3d9f2a14e68" : undefined,
              transferOutcome: outcome === "transfer" ? "Warm Transfer Completed" : outcome === "callback" ? "Admissions Callback Booked" : "N/A",
              dispositionNote: data.reasoning,
              costCad: 0.38,
            },
          };
          setStudent(updatedStudent);
          onLeadUpdated(updatedStudent);
        }

        if (data.nextStage === "completed") {
          setTimeout(() => {
            setCallActive(false);
          }, 3000);
        }
      }
    } catch (e) {
      console.error("AI turn error:", e);
    } finally {
      setLoadingAi(false);
    }
  };

  // Preset quick reply suggestions depending on stage
  const getStageSuggestions = (): string[] => {
    switch (currentStage) {
      case "identity_check":
        return [
          `Yes, this is ${student.fullName.split(" ")[0]} speaking.`,
          "Yes, who is this?",
          "No, you have the wrong number.",
        ];
      case "verify_details":
        return [
          `Yes, still in ${student.city} and interested in ${student.originalProgramInterest.split(" ")[0]}.`,
          "I actually moved to Mississauga recently.",
          "I'm currently working part-time retail.",
        ];
      case "core_question":
        return [
          "Yes, I'm definitely still looking to enrol this fall!",
          "Yes, wanting to start as soon as next month.",
          "No, I found a job and I'm not looking to study anymore.",
        ];
      case "tuition_expectations":
        return [
          "Yes, I understand it's tuition-based and requires student loans or savings.",
          "Wait, I thought this was free government training?",
          "Does it guarantee a job after graduation?",
        ];
      case "verbal_consent":
        return [
          "Yes, you have my verbal permission to share my details with the college.",
          "Sure, please have the admissions advisor contact me.",
          "No, do not share my information with anyone.",
          "Please remove my phone number and do not call again.",
        ];
      case "branch_action":
        return [
          "Please connect me to the admissions coordinator right now.",
          "Can they call me back tomorrow afternoon instead?",
          "Thank you, I will look out for the email.",
        ];
      default:
        return ["Hello?", "Yes?", "Who is calling?"];
    }
  };

  return (
    <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-panel)] p-5 shadow-sm">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-[var(--color-border-subtle)] pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="flex h-2.5 w-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
            <h3 className="text-base font-bold text-[var(--color-text-primary)]">
              Interactive Outbound Voice Simulator
            </h3>
            <span className="rounded bg-indigo-100 text-indigo-800 dark:bg-indigo-950/60 dark:text-indigo-300 px-2 py-0.5 text-xs font-mono font-semibold">
              Live Vapi / CRTC State Machine
            </span>
          </div>
          <p className="mt-1 text-xs text-[var(--color-text-secondary)]">
            Test the complete 7-step admissions verification flow with real-time speech synthesis, audio waveforms, and dual AI inference.
          </p>
        </div>

        {/* Lead Selector Pill */}
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <label className="text-xs font-semibold text-[var(--color-text-muted)] whitespace-nowrap">
            Select Lead:
          </label>
          <select
            value={student.id}
            onChange={(e) => {
              const s = INITIAL_STUDENTS.find((x) => x.id === e.target.value);
              if (s) {
                setStudent(s);
                resetCall();
              }
            }}
            disabled={callActive}
            className="w-full sm:w-64 rounded-lg border border-[var(--color-border)] bg-[var(--color-panel-subtle)] px-3 py-1.5 text-xs font-medium text-[var(--color-text-primary)] focus:outline-none focus:ring-1 focus:ring-[var(--color-brand-primary)]"
          >
            {INITIAL_STUDENTS.map((s) => (
              <option key={s.id} value={s.id}>
                {s.fullName} ({s.city}) • {s.originalProgramInterest.split(" ")[0]}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Student Lead Dossier Strip */}
      <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4 rounded-lg bg-[var(--color-panel-subtle)] border border-[var(--color-border)] p-3 text-xs">
        <div>
          <span className="text-[var(--color-text-muted)] font-medium">Contact:</span>
          <p className="font-bold text-[var(--color-text-primary)]">{student.fullName}</p>
          <p className="font-mono text-[var(--color-text-secondary)]">{student.phone}</p>
        </div>
        <div>
          <span className="text-[var(--color-text-muted)] font-medium">Location:</span>
          <p className="font-semibold text-[var(--color-text-primary)]">{student.city}, ON</p>
          <p className="text-[var(--color-text-secondary)]">{student.currentEmploymentStatus}</p>
        </div>
        <div>
          <span className="text-[var(--color-text-muted)] font-medium">Program Interest:</span>
          <p className="font-semibold text-[var(--color-text-primary)] truncate" title={student.originalProgramInterest}>
            {student.originalProgramInterest}
          </p>
          <span className="inline-block rounded bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300 px-1.5 py-0.2 text-[10px] font-mono font-semibold">
            {student.staleDays} Days Stale
          </span>
        </div>
        <div>
          <span className="text-[var(--color-text-muted)] font-medium">Current Status:</span>
          <p className="font-bold text-[var(--color-text-primary)]">
            <span
              className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-semibold ${
                student.verificationStatus === "Verified & Interested"
                  ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300"
                  : student.verificationStatus === "DNC Opt-Out (Permanent)"
                  ? "bg-rose-100 text-rose-800 dark:bg-rose-950/60 dark:text-rose-300"
                  : student.verificationStatus === "Invalid / Disconnected"
                  ? "bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300"
                  : "bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-200"
              }`}
            >
              {student.verificationStatus}
            </span>
          </p>
          <p className="font-mono text-[var(--color-text-muted)] text-[10px] mt-0.5">
            Attempts: {student.dialAttempts}
          </p>
        </div>
      </div>

      {/* Main Call Stage & Telephony Controls */}
      <div className="mt-4 grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Left Column: Call State & Audio Terminal (2 Cols) */}
        <div className="lg:col-span-2 flex flex-col justify-between rounded-xl border border-[var(--color-border)] bg-[var(--color-panel-subtle)] p-4">
          {/* Top Bar: Call Status & Waveform */}
          <div className="flex items-center justify-between border-b border-[var(--color-border)] pb-3">
            <div className="flex items-center gap-3">
              {callActive ? (
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-emerald-500 text-white animate-pulse">
                  <PhoneCall className="h-5 w-5" />
                </div>
              ) : (
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-200 dark:bg-slate-800 text-[var(--color-text-muted)]">
                  <PhoneOff className="h-5 w-5" />
                </div>
              )}
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-[var(--color-text-primary)]">
                    {callActive ? "CALL IN PROGRESS (PSTN CONNECTED)" : "CALL DISCONNECTED"}
                  </span>
                  {callActive && (
                    <span className="rounded bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 px-1.5 py-0.2 text-[10px] font-mono font-bold">
                      STAGE: {currentStage.toUpperCase()}
                    </span>
                  )}
                </div>
                <p className="text-xs text-[var(--color-text-muted)] font-mono">
                  Carrier: Twilio Elastic SIP • Trunk: CA-Toronto-1 • Port 5060
                </p>
              </div>
            </div>

            {/* Audio Waveform Animation (Pulsing when speaking) */}
            <div className="flex items-center gap-2">
              <div className="flex h-7 items-center gap-1 px-2">
                <span className={`w-1 rounded-full bg-indigo-500 ${isSpeaking ? "animate-wave-1" : "h-1"}`}></span>
                <span className={`w-1 rounded-full bg-indigo-500 ${isSpeaking ? "animate-wave-2" : "h-1"}`}></span>
                <span className={`w-1 rounded-full bg-indigo-500 ${isSpeaking ? "animate-wave-3" : "h-1"}`}></span>
                <span className={`w-1 rounded-full bg-indigo-500 ${isSpeaking ? "animate-wave-4" : "h-1"}`}></span>
                <span className={`w-1 rounded-full bg-indigo-500 ${isSpeaking ? "animate-wave-5" : "h-1"}`}></span>
                <span className={`w-1 rounded-full bg-indigo-500 ${isSpeaking ? "animate-wave-6" : "h-1"}`}></span>
                <span className={`w-1 rounded-full bg-indigo-500 ${isSpeaking ? "animate-wave-7" : "h-1"}`}></span>
              </div>
              <button
                onClick={() => setTtsMuted(!ttsMuted)}
                className={`rounded-lg border border-[var(--color-border)] p-1.5 text-xs transition-colors cursor-pointer ${
                  ttsMuted
                    ? "bg-rose-100 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300"
                    : "bg-[var(--color-panel)] text-[var(--color-text-secondary)]"
                }`}
                title={ttsMuted ? "Audio speech is muted" : "Audio speech is enabled"}
              >
                <Volume2 className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Transcript Scroll Area */}
          <div className="my-4 h-72 overflow-y-auto space-y-3 pr-2">
            {transcript.length === 0 ? (
              <div className="flex h-full flex-col items-center justify-center text-center text-xs text-[var(--color-text-muted)] p-6">
                <PhoneCall className="h-8 w-8 text-[var(--color-text-muted)] opacity-40 mb-2" />
                <p className="font-semibold text-[var(--color-text-primary)]">Ready to Dial</p>
                <p className="max-w-xs mt-1">
                  Click &quot;Initiate Outbound Call&quot; below to launch the autonomous Ontario CRTC verification flow.
                </p>
              </div>
            ) : (
              transcript.map((turn) => {
                const isAgent = turn.speaker === "agent";
                return (
                  <div
                    key={turn.id}
                    className={`flex flex-col ${isAgent ? "items-start" : "items-end"}`}
                  >
                    <div className="flex items-center gap-1.5 text-[10px] font-mono text-[var(--color-text-muted)] mb-1">
                      <span>{isAgent ? "Sarah (AI Admissions Agent)" : student.fullName}</span>
                      <span>•</span>
                      <span>+{turn.timestampSec}s</span>
                      {turn.complianceTag && (
                        <span className="rounded bg-indigo-100 text-indigo-800 dark:bg-indigo-950 dark:text-indigo-300 px-1 py-0.2 font-bold">
                          {turn.complianceTag}
                        </span>
                      )}
                    </div>
                    <div
                      className={`max-w-[85%] rounded-xl px-3.5 py-2.5 text-xs leading-relaxed shadow-sm ${
                        isAgent
                          ? "bg-[var(--color-panel)] border border-[var(--color-border)] text-[var(--color-text-primary)]"
                          : "bg-[var(--color-brand-primary)] text-white font-medium"
                      }`}
                    >
                      {turn.text}
                    </div>
                  </div>
                );
              })
            )}
            {loadingAi && (
              <div className="flex items-center gap-2 text-xs text-[var(--color-text-muted)] italic">
                <RefreshCw className="h-3 w-3 animate-spin text-indigo-500" />
                AI Voice reasoning in progress...
              </div>
            )}
            <div ref={transcriptEndRef} />
          </div>

          {/* Telemetry Badge Strip */}
          {lastTelemetry && (
            <div className="mb-3 flex items-center justify-between rounded-lg bg-[var(--color-panel)] border border-[var(--color-border)] px-3 py-1.5 text-[10px] font-mono">
              <span className="flex items-center gap-1 text-[var(--color-text-secondary)]">
                <Sparkles className="h-3 w-3 text-indigo-500" />
                Engine: <strong className="text-[var(--color-brand-primary)]">{lastTelemetry.provider}</strong> ({lastTelemetry.model})
              </span>
              <span className="text-[var(--color-text-muted)]">
                Latency: <strong className="text-emerald-600 dark:text-emerald-400">{lastTelemetry.latencyMs}ms</strong>
              </span>
            </div>
          )}

          {/* Quick-Reply Suggestion Chips */}
          {callActive && !loadingAi && (
            <div className="mb-3 space-y-1.5">
              <span className="text-[10px] font-semibold uppercase tracking-wider text-[var(--color-text-muted)]">
                Simulated Student Responses (Click to speak):
              </span>
              <div className="flex flex-wrap gap-1.5">
                {getStageSuggestions().map((sugg, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSendResponse(sugg)}
                    className="rounded-full bg-[var(--color-panel)] border border-[var(--color-border)] px-3 py-1 text-xs text-[var(--color-text-primary)] hover:border-[var(--color-brand-primary)] hover:bg-[var(--color-brand-subtle)] transition-all cursor-pointer whitespace-nowrap"
                  >
                    {sugg}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Bottom Controls Bar */}
          <div className="flex items-center gap-2">
            {!callActive ? (
              <button
                onClick={handleStartCall}
                className="w-full inline-flex items-center justify-center gap-2 rounded-lg bg-[var(--color-brand-primary)] px-4 py-2.5 text-xs font-semibold text-white shadow-sm hover:bg-[var(--color-brand-hover)] transition-all cursor-pointer"
              >
                <PhoneCall className="h-4 w-4" />
                Initiate Outbound Voice Verification Call
              </button>
            ) : (
              <div className="flex items-center gap-2 w-full">
                <input
                  type="text"
                  value={userInput}
                  onChange={(e) => setUserInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSendResponse(userInput)}
                  placeholder="Type student verbal reply or select a chip above..."
                  disabled={loadingAi}
                  className="flex-1 rounded-lg border border-[var(--color-border)] bg-[var(--color-panel)] px-3 py-2 text-xs text-[var(--color-text-primary)] placeholder-[var(--color-text-muted)] focus:outline-none focus:ring-1 focus:ring-[var(--color-brand-primary)]"
                />
                <button
                  onClick={() => handleSendResponse(userInput)}
                  disabled={!userInput.trim() || loadingAi}
                  className="rounded-lg bg-[var(--color-brand-primary)] p-2 text-white hover:bg-[var(--color-brand-hover)] disabled:opacity-50 transition-colors cursor-pointer"
                >
                  <Send className="h-4 w-4" />
                </button>
                <button
                  onClick={handleEndCall}
                  className="rounded-lg bg-rose-600 px-3 py-2 text-xs font-semibold text-white hover:bg-rose-700 transition-colors cursor-pointer whitespace-nowrap"
                >
                  Hang Up
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: 7-Stage State Machine & Live Extracted Fields */}
        <div className="flex flex-col justify-between rounded-xl border border-[var(--color-border)] bg-[var(--color-panel)] p-4 shadow-sm">
          <div>
            <div className="flex items-center justify-between border-b border-[var(--color-border-subtle)] pb-2.5">
              <span className="text-xs font-bold text-[var(--color-text-primary)] uppercase tracking-wider">
                7-Stage Call State Machine
              </span>
              <span className="font-mono text-[10px] text-[var(--color-text-muted)]">
                Vapi Rule Engine
              </span>
            </div>

            {/* Stages List */}
            <div className="mt-3 space-y-2 text-xs">
              {[
                { stage: "ai_disclosure", label: "1. AI & 2-Party Recording Disclosure", desc: "Explicit automated assistant identification" },
                { stage: "identity_check", label: "2. Identity Confirmation", desc: "Speaking to correct student record" },
                { stage: "verify_details", label: "3. Detail Verification", desc: "Program interest, Ontario city, employment" },
                { stage: "core_question", label: "4. Active Enrollment Intent", desc: "Actively seeking diploma? Intake timeframe?" },
                { stage: "tuition_expectations", label: "5. Honest Tuition Expectation", desc: "Tuition-based, not free, no guaranteed jobs" },
                { stage: "verbal_consent", label: "6. Verbal Consent Capture", desc: "Spoken authorization to share with college" },
                { stage: "branch_action", label: "7. Conditional Branch Action", desc: "Warm transfer, callback, or polite close/DNC" },
              ].map((item, idx) => {
                const isActive = currentStage === item.stage;
                const isPast =
                  (currentStage === "completed") ||
                  (idx === 0 && currentStage !== "idle" && currentStage !== "ai_disclosure") ||
                  (idx === 1 && ["verify_details", "core_question", "tuition_expectations", "verbal_consent", "branch_action", "completed"].includes(currentStage)) ||
                  (idx === 2 && ["core_question", "tuition_expectations", "verbal_consent", "branch_action", "completed"].includes(currentStage)) ||
                  (idx === 3 && ["tuition_expectations", "verbal_consent", "branch_action", "completed"].includes(currentStage)) ||
                  (idx === 4 && ["verbal_consent", "branch_action", "completed"].includes(currentStage)) ||
                  (idx === 5 && ["branch_action", "completed"].includes(currentStage));

                return (
                  <div
                    key={item.stage}
                    className={`flex items-start gap-2.5 rounded-lg border p-2 transition-all ${
                      isActive
                        ? "border-[var(--color-brand-primary)] bg-[var(--color-brand-subtle)] text-[var(--color-brand-primary)] ring-1 ring-indigo-500/20"
                        : isPast
                        ? "border-emerald-200 bg-emerald-50/50 dark:border-emerald-900 dark:bg-emerald-950/20 text-emerald-700 dark:text-emerald-400"
                        : "border-[var(--color-border-subtle)] text-[var(--color-text-muted)] bg-[var(--color-panel-subtle)]"
                    }`}
                  >
                    <div className="mt-0.5">
                      {isPast ? (
                        <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
                      ) : isActive ? (
                        <span className="flex h-2.5 w-2.5 rounded-full bg-indigo-600 animate-ping"></span>
                      ) : (
                        <span className="flex h-2.5 w-2.5 rounded-full bg-slate-300 dark:bg-slate-700"></span>
                      )}
                    </div>
                    <div>
                      <p className="font-semibold leading-tight">{item.label}</p>
                      <p className="text-[10px] text-[var(--color-text-secondary)] mt-0.5">{item.desc}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Structured Data Sync Status */}
          <div className="mt-4 rounded-lg bg-[var(--color-panel-subtle)] border border-[var(--color-border)] p-3 text-xs">
            <span className="font-semibold text-[var(--color-text-primary)] block mb-1">
              Live Airtable Schema Sync
            </span>
            <div className="space-y-1 font-mono text-[10px] text-[var(--color-text-secondary)]">
              <div className="flex justify-between">
                <span>Tuition Acknowledged:</span>
                <strong className={student.verifiedDetails?.tuitionAcknowledged ? "text-emerald-600" : "text-slate-400"}>
                  {student.verifiedDetails?.tuitionAcknowledged ? "TRUE (VERIFIED)" : "PENDING"}
                </strong>
              </div>
              <div className="flex justify-between">
                <span>Verbal Consent SHA-256:</span>
                <strong className="text-teal-600 truncate max-w-[130px]">
                  {student.verifiedDetails?.consentSha256 || "PENDING SPOKEN"}
                </strong>
              </div>
              <div className="flex justify-between">
                <span>Airtable Webhook State:</span>
                <span className="text-emerald-600 font-bold">READY (n8n v1.4)</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
