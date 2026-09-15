"use client";

import React, { useState } from "react";
import { Header } from "@/components/Header";
import { ReviewerTour } from "@/components/ReviewerTour";
import { BentoKpiGrid } from "@/components/BentoKpiGrid";
import { WorkflowCanvas } from "@/components/WorkflowCanvas";
import { LeadQueueTable } from "@/components/LeadQueueTable";
import { LiveCallSimulator } from "@/components/LiveCallSimulator";
import { BatchDialerModal } from "@/components/BatchDialerModal";
import { ConsentDrawer } from "@/components/ConsentDrawer";
import { BlueprintExporter } from "@/components/BlueprintExporter";
import { RoiCostCalculator } from "@/components/RoiCostCalculator";
import { ApiDocsModal } from "@/components/ApiDocsModal";
import { ChaosSimulatorModal } from "@/components/ChaosSimulatorModal";
import { Footer } from "@/components/Footer";
import { INITIAL_STUDENTS, INITIAL_KPI_SUMMARY } from "@/lib/mockData";
import { StudentRecord, KpiSummary } from "@/types";
import {
  Sparkles,
  PhoneCall,
  Activity,
  CheckCircle2,
  FileCheck2,
  Layers,
  ArrowRight,
  ShieldCheck,
  Building2,
  Radio,
} from "lucide-react";

export default function Home() {
  const [students, setStudents] = useState<StudentRecord[]>(INITIAL_STUDENTS);
  const [metrics, setMetrics] = useState<KpiSummary>(INITIAL_KPI_SUMMARY);
  const [activeSection, setActiveSection] = useState<"dashboard" | "queue" | "call">("dashboard");

  // Selected student for live simulator
  const [activeStudentId, setActiveStudentId] = useState<string>("std_mis_092"); // Default Priya Patel

  // Modal States
  const [isBatchModalOpen, setIsBatchModalOpen] = useState<boolean>(false);
  const [isRoiModalOpen, setIsRoiModalOpen] = useState<boolean>(false);
  const [isBlueprintsModalOpen, setIsBlueprintsModalOpen] = useState<boolean>(false);
  const [isApiDocsModalOpen, setIsApiDocsModalOpen] = useState<boolean>(false);
  const [isChaosModalOpen, setIsChaosModalOpen] = useState<boolean>(false);
  const [consentStudent, setConsentStudent] = useState<StudentRecord | null>(null);

  // Success Notification banner
  const [batchNotice, setBatchNotice] = useState<string | null>(null);

  const handleLeadUpdated = (updatedStudent: StudentRecord) => {
    setStudents((prev) =>
      prev.map((s) => (s.id === updatedStudent.id ? updatedStudent : s))
    );

    // Update metrics dynamically
    if (updatedStudent.verificationStatus === "Verified & Interested") {
      setMetrics((prev) => ({
        ...prev,
        intentConfirmedCount: prev.intentConfirmedCount + 1,
        verbalConsentCount: prev.verbalConsentCount + 1,
      }));
    } else if (
      updatedStudent.verificationStatus === "Invalid / Disconnected" ||
      updatedStudent.verificationStatus === "Wrong Person / Reassigned" ||
      updatedStudent.verificationStatus === "Not Interested / Closed"
    ) {
      setMetrics((prev) => ({
        ...prev,
        staleBadNumberCount: prev.staleBadNumberCount + 1,
      }));
    }
  };

  const handleSelectStudentForCall = (studentId: string) => {
    setActiveStudentId(studentId);
    setActiveSection("call");
  };

  const handleBatchStarted = (count: number) => {
    setBatchNotice(
      `Batch campaign initiated for ${count} leads with concurrency throttling. Ontario hours lock enforced.`
    );
    setTimeout(() => setBatchNotice(null), 6000);
  };

  return (
    <div className="min-h-screen bg-[var(--color-bg)] flex flex-col">
      {/* Sticky Enterprise Header */}
      <Header
        onOpenBatchModal={() => setIsBatchModalOpen(true)}
        onOpenRoiModal={() => setIsRoiModalOpen(true)}
        onOpenBlueprintsModal={() => setIsBlueprintsModalOpen(true)}
        onOpenApiDocsModal={() => setIsApiDocsModalOpen(true)}
        onOpenChaosModal={() => setIsChaosModalOpen(true)}
        activeSection={activeSection}
        setActiveSection={setActiveSection}
      />

      {/* Main Content Workspace */}
      <main className="flex-1 py-6 sm:py-8 w-full max-w-full min-w-0 overflow-x-hidden">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-8 w-full max-w-full min-w-0">
          {/* Real-time Notification Banner */}
          {batchNotice && (
            <div className="flex items-center justify-between rounded-xl border border-emerald-300 bg-emerald-50 dark:border-emerald-800 dark:bg-emerald-950/60 p-4 text-xs text-emerald-900 dark:text-emerald-200">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                <span className="font-semibold">{batchNotice}</span>
              </div>
              <button
                type="button"
                onClick={() => setBatchNotice(null)}
                className="text-xs font-bold hover:underline cursor-pointer"
              >
                Dismiss
              </button>
            </div>
          )}

          {/* Section Hero Banner */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[var(--color-border-subtle)] pb-6">
            <div>
              <div className="flex flex-wrap items-center gap-2.5">
                <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-[var(--color-text-primary)]">
                  Ontario Career College Voice Verification Pipeline
                </h1>
                <span className="inline-flex items-center gap-1 rounded-full bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-800/60 px-2.5 py-0.5 text-xs font-bold text-indigo-700 dark:text-indigo-300 whitespace-nowrap shrink-0">
                  <ShieldCheck className="h-3.5 w-3.5 shrink-0" />
                  CRTC Certified
                </span>
              </div>
              <p className="mt-1 text-xs sm:text-sm text-[var(--color-text-secondary)]">
                Autonomous AI voice qualifying 10,000–20,000 domestic student records. Zero human dialer overhead.
              </p>
            </div>

            {/* Quick Segment Switcher */}
            <div className="flex items-center rounded-xl border border-[var(--color-border)] bg-[var(--color-panel)] p-1 shadow-sm shrink-0">
              <button
                type="button"
                onClick={() => setActiveSection("dashboard")}
                className={`rounded-lg px-3 py-1.5 text-xs font-semibold whitespace-nowrap shrink-0 transition-all cursor-pointer ${
                  activeSection === "dashboard"
                    ? "bg-[var(--color-brand-primary)] text-white shadow-sm font-bold"
                    : "text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]"
                }`}
              >
                Workflow &amp; Architecture
              </button>
              <button
                type="button"
                onClick={() => setActiveSection("queue")}
                className={`rounded-lg px-3 py-1.5 text-xs font-semibold whitespace-nowrap shrink-0 transition-all cursor-pointer ${
                  activeSection === "queue"
                    ? "bg-[var(--color-brand-primary)] text-white shadow-sm font-bold"
                    : "text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]"
                }`}
              >
                Airtable Database ({students.length})
              </button>
              <button
                type="button"
                onClick={() => setActiveSection("call")}
                className={`rounded-lg px-3 py-1.5 text-xs font-semibold whitespace-nowrap shrink-0 transition-all cursor-pointer ${
                  activeSection === "call"
                    ? "bg-[var(--color-brand-primary)] text-white shadow-sm font-bold"
                    : "text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]"
                }`}
              >
                Live Voice Simulator
              </button>
            </div>
          </div>

          {/* Interactive Client Reviewer Guided Tour (RFP Deliverables Walkthrough) */}
          <ReviewerTour
            onTestComplianceLock={() => setIsBatchModalOpen(true)}
            onTestVoiceCall={() => {
              setActiveStudentId("std_mis_092");
              setActiveSection("call");
            }}
            onInspectConsent={() => {
              setConsentStudent(students[0] || INITIAL_STUDENTS[0]);
            }}
            onExportBlueprints={() => setIsBlueprintsModalOpen(true)}
          />

          {/* Bento KPI Performance Grid */}
          <BentoKpiGrid metrics={metrics} />

          {/* Conditional View Rendering */}
          {activeSection === "dashboard" && (
            <div className="space-y-8">
              {/* Interactive Visual Pipeline */}
              <WorkflowCanvas />

              {/* Call Simulator Teaser & Quick Action Row */}
              <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-panel)] p-6 shadow-sm">
                <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
                  <div className="space-y-2 max-w-2xl">
                    <div className="inline-flex items-center gap-1.5 rounded bg-amber-50 dark:bg-amber-950/60 border border-amber-200 dark:border-amber-800/60 px-2 py-0.5 text-xs font-bold text-amber-800 dark:text-amber-300">
                      <Radio className="h-3.5 w-3.5 animate-pulse" />
                      Live Conversational AI Available
                    </div>
                    <h3 className="text-base sm:text-lg font-bold text-[var(--color-text-primary)]">
                      Experience the Full 7-Stage Outbound Call Flow in Real Time
                    </h3>
                    <p className="text-xs sm:text-sm text-[var(--color-text-secondary)] leading-relaxed">
                      Test the mandatory 5-second AI disclosure, identity confirmation, program and city validation, tuition expectation filter, and cryptographic verbal consent logging. Powered by dual-provider OpenAI &amp; Gemini intelligence.
                    </p>
                  </div>

                  <div className="flex flex-wrap items-center gap-3 shrink-0">
                    <button
                      type="button"
                      onClick={() => setActiveSection("call")}
                      className="inline-flex items-center gap-2 rounded-xl bg-[var(--color-brand-primary)] px-5 py-3 text-xs sm:text-sm font-semibold text-white shadow-md hover:bg-[var(--color-brand-hover)] transition-all cursor-pointer whitespace-nowrap shrink-0"
                    >
                      <PhoneCall className="h-4 w-4" />
                      Launch Call Simulator
                      <ArrowRight className="h-4 w-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => setActiveSection("queue")}
                      className="inline-flex items-center gap-2 rounded-xl border border-[var(--color-border)] bg-[var(--color-panel-subtle)] px-4 py-3 text-xs sm:text-sm font-semibold text-[var(--color-text-secondary)] hover:bg-[var(--color-panel)] transition-all cursor-pointer whitespace-nowrap shrink-0"
                    >
                      <Layers className="h-4 w-4" />
                      Inspect Airtable Records
                    </button>
                  </div>
                </div>
              </div>

              {/* Lead Queue Preview in Dashboard */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold uppercase tracking-wider text-[var(--color-text-primary)]">
                    Recent Verification Activity &amp; Live Queue
                  </h3>
                  <button
                    type="button"
                    onClick={() => setActiveSection("queue")}
                    className="text-xs font-semibold text-[var(--color-brand-primary)] hover:underline cursor-pointer whitespace-nowrap"
                  >
                    View All {students.length} Records →
                  </button>
                </div>
                <LeadQueueTable
                  students={students.slice(0, 6)}
                  onSelectStudentForCall={handleSelectStudentForCall}
                  onOpenConsentModal={(student) => setConsentStudent(student)}
                />
              </div>
            </div>
          )}

          {activeSection === "queue" && (
            <div className="space-y-4">
              <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-panel)] p-4 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h2 className="text-sm font-bold text-[var(--color-text-primary)] uppercase tracking-wider">
                    Airtable Enrolment Master Table
                  </h2>
                  <p className="text-xs text-[var(--color-text-muted)]">
                    Bi-directional sync via n8n webhook. 14 typed fields updated per call with cryptographic audit certificates.
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setIsBatchModalOpen(true)}
                    className="inline-flex items-center gap-1.5 rounded-lg bg-[var(--color-brand-primary)] px-3 py-1.5 text-xs font-semibold text-white shadow-sm hover:bg-[var(--color-brand-hover)] transition-all whitespace-nowrap shrink-0 cursor-pointer"
                  >
                    <Activity className="h-3.5 w-3.5" />
                    Launch Batch Campaign
                  </button>
                </div>
              </div>

              <LeadQueueTable
                students={students}
                onSelectStudentForCall={handleSelectStudentForCall}
                onOpenConsentModal={(student) => setConsentStudent(student)}
              />
            </div>
          )}

          {activeSection === "call" && (
            <div className="space-y-6">
              <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-panel)] p-4 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-sm font-bold text-[var(--color-text-primary)] uppercase tracking-wider">
                      Interactive Outbound Voice Console
                    </h2>
                    <span className="rounded bg-indigo-100 dark:bg-indigo-950 px-2 py-0.5 text-xs font-mono font-bold text-indigo-700 dark:text-indigo-300">
                      Dual-Provider AI
                    </span>
                  </div>
                  <p className="text-xs text-[var(--color-text-muted)] mt-0.5">
                    Select a student from the dropdown, initiate the call, and speak or click quick responses to progress through all 7 compliance stages.
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setActiveSection("queue")}
                    className="rounded-lg border border-[var(--color-border)] bg-[var(--color-panel-subtle)] px-3 py-1.5 text-xs font-semibold text-[var(--color-text-secondary)] hover:bg-[var(--color-panel)] transition-colors whitespace-nowrap shrink-0 cursor-pointer"
                  >
                    Back to Queue
                  </button>
                </div>
              </div>

              <LiveCallSimulator
                onLeadUpdated={handleLeadUpdated}
                selectedStudentId={activeStudentId}
              />
            </div>
          )}
        </div>
      </main>

      {/* Enterprise Architecture Footer */}
      <Footer />

      {/* Slide-out & Modal Components */}
      <BatchDialerModal
        isOpen={isBatchModalOpen}
        onClose={() => setIsBatchModalOpen(false)}
        onBatchStarted={handleBatchStarted}
      />

      <ConsentDrawer
        student={consentStudent}
        isOpen={!!consentStudent}
        onClose={() => setConsentStudent(null)}
      />

      <BlueprintExporter
        isOpen={isBlueprintsModalOpen}
        onClose={() => setIsBlueprintsModalOpen(false)}
      />

      <RoiCostCalculator
        isOpen={isRoiModalOpen}
        onClose={() => setIsRoiModalOpen(false)}
      />

      <ApiDocsModal
        isOpen={isApiDocsModalOpen}
        onClose={() => setIsApiDocsModalOpen(false)}
      />

      <ChaosSimulatorModal
        isOpen={isChaosModalOpen}
        onClose={() => setIsChaosModalOpen(false)}
      />
    </div>
  );
}
