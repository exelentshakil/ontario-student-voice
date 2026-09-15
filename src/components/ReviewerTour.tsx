"use client";

import React, { useState } from "react";
import {
  ShieldCheck,
  PhoneCall,
  Lock,
  Download,
  CheckCircle2,
  ArrowRight,
  Sparkles,
  ChevronDown,
  ChevronUp,
  Award,
} from "lucide-react";

interface ReviewerTourProps {
  onTestComplianceLock: () => void;
  onTestVoiceCall: () => void;
  onInspectConsent: () => void;
  onExportBlueprints: () => void;
}

export function ReviewerTour({
  onTestComplianceLock,
  onTestVoiceCall,
  onInspectConsent,
  onExportBlueprints,
}: ReviewerTourProps) {
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  const [isCollapsed, setIsCollapsed] = useState<boolean>(false);

  const markStepDone = (stepId: number, callback: () => void) => {
    if (!completedSteps.includes(stepId)) {
      setCompletedSteps((prev) => [...prev, stepId]);
    }
    callback();
  };

  const steps = [
    {
      id: 1,
      number: "01",
      title: "CRTC Calling Window & TZ Lock",
      badge: "CRTC 2014-155",
      badgeColor: "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/60 dark:text-emerald-300 dark:border-emerald-900",
      icon: ShieldCheck,
      description: "Hardware & software clock enforcing Mon–Sat 09:00–20:00 EST and Sunday blackout.",
      actionLabel: "Test Compliance Lock",
      action: () => markStepDone(1, onTestComplianceLock),
    },
    {
      id: 2,
      number: "02",
      title: "Voice AI & Tuition Filter",
      badge: "7-Stage Flow",
      badgeColor: "bg-indigo-50 text-indigo-700 border-indigo-200 dark:bg-indigo-950/60 dark:text-indigo-300 dark:border-indigo-900",
      icon: PhoneCall,
      description: "5-second AI disclosure, identity confirmation, and tuition diploma reality filter.",
      actionLabel: "Launch Voice Simulator",
      action: () => markStepDone(2, onTestVoiceCall),
    },
    {
      id: 3,
      number: "03",
      title: "Verbal Consent & SHA-256",
      badge: "Audit Proof",
      badgeColor: "bg-teal-50 text-teal-700 border-teal-200 dark:bg-teal-950/60 dark:text-teal-300 dark:border-teal-900",
      icon: Lock,
      description: "Verbatim spoken authorization with ISO timestamp and cryptographic audit hash.",
      actionLabel: "View Consent Audit",
      action: () => markStepDone(3, onInspectConsent),
    },
    {
      id: 4,
      number: "04",
      title: "Turnkey Blueprints Export",
      badge: "100% Code Ownership",
      badgeColor: "bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-950/60 dark:text-purple-300 dark:border-purple-900",
      icon: Download,
      description: "Production n8n workflow JSON, Vapi assistant spec, and Twilio SIP scripts.",
      actionLabel: "Export Blueprints",
      action: () => markStepDone(4, onExportBlueprints),
    },
  ];

  const progressPct = Math.round((completedSteps.length / steps.length) * 100);

  return (
    <div className="rounded-xl border border-indigo-200 bg-gradient-to-r from-indigo-50/70 via-white to-indigo-50/40 p-4 sm:p-5 shadow-sm dark:border-indigo-900/60 dark:from-indigo-950/40 dark:via-[var(--color-panel)] dark:to-indigo-950/20">
      {/* Tour Header Row */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-indigo-100 dark:border-indigo-900/40 pb-3">
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[var(--color-brand-primary)] text-white shadow-sm">
            <Sparkles className="h-4 w-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-[var(--color-brand-primary)] font-mono">
                Interactive Client Validation Guide
              </span>
              <span className="rounded-full bg-indigo-100 text-indigo-800 dark:bg-indigo-950 dark:text-indigo-300 px-2 py-0.5 text-xs font-bold font-mono">
                {completedSteps.length} of {steps.length} Tested
              </span>
            </div>
            <h3 className="text-sm sm:text-base font-bold text-[var(--color-text-primary)]">
              Validate All 4 Core RFP Deliverables in Under 60 Seconds
            </h3>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* Progress Bar */}
          <div className="hidden md:flex items-center gap-2 text-xs font-mono text-[var(--color-text-secondary)]">
            <span>Progress:</span>
            <div className="h-2 w-28 rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden">
              <div
                className="h-full bg-emerald-500 transition-all duration-500"
                style={{ width: `${progressPct}%` }}
              />
            </div>
            <span className="font-bold text-[var(--color-text-primary)]">{progressPct}%</span>
          </div>

          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="inline-flex items-center gap-1 rounded-lg border border-[var(--color-border)] bg-[var(--color-panel)] px-2.5 py-1 text-xs font-semibold text-[var(--color-text-secondary)] hover:bg-[var(--color-panel-subtle)] transition-colors cursor-pointer"
          >
            {isCollapsed ? (
              <>
                <span>Expand Guide</span>
                <ChevronDown className="h-3.5 w-3.5" />
              </>
            ) : (
              <>
                <span>Minimize</span>
                <ChevronUp className="h-3.5 w-3.5" />
              </>
            )}
          </button>
        </div>
      </div>

      {/* Tour Step Cards (Expanded) */}
      {!isCollapsed && (
        <div className="mt-4 space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {steps.map((step) => {
              const isDone = completedSteps.includes(step.id);
              const Icon = step.icon;

              return (
                <div
                  key={step.id}
                  className={`flex flex-col justify-between rounded-xl border p-3.5 transition-all bg-[var(--color-panel)] ${
                    isDone
                      ? "border-emerald-300 bg-emerald-50/20 dark:border-emerald-900/60 dark:bg-emerald-950/20"
                      : "border-[var(--color-border)] hover:border-indigo-300 hover:shadow-sm"
                  }`}
                >
                  <div>
                    {/* Step Card Header */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div
                          className={`flex h-7 w-7 items-center justify-center rounded-lg border ${
                            isDone
                              ? "bg-emerald-100 border-emerald-300 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400"
                              : "bg-[var(--color-panel-subtle)] border-[var(--color-border)] text-[var(--color-brand-primary)]"
                          }`}
                        >
                          {isDone ? <CheckCircle2 className="h-4 w-4" /> : <Icon className="h-4 w-4" />}
                        </div>
                        <span className="font-mono text-xs font-bold text-[var(--color-text-muted)]">
                          STEP {step.number}
                        </span>
                      </div>

                      <span className={`rounded px-1.5 py-0.5 text-xs font-mono font-semibold border ${step.badgeColor}`}>
                        {step.badge}
                      </span>
                    </div>

                    {/* Step Title & Details */}
                    <h4 className="text-xs sm:text-sm font-bold text-[var(--color-text-primary)] mt-2.5">
                      {step.title}
                    </h4>
                    <p className="text-xs text-[var(--color-text-secondary)] mt-1 leading-relaxed">
                      {step.description}
                    </p>
                  </div>

                  {/* Step Action Button */}
                  <button
                    onClick={step.action}
                    className={`mt-3.5 inline-flex items-center justify-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold whitespace-nowrap shrink-0 transition-all cursor-pointer shadow-sm ${
                      isDone
                        ? "bg-emerald-600 text-white hover:bg-emerald-700"
                        : "bg-[var(--color-brand-primary)] text-white hover:bg-[var(--color-brand-hover)]"
                    }`}
                  >
                    <span>{isDone ? `Re-Test Step ${step.number}` : step.actionLabel}</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </button>
                </div>
              );
            })}
          </div>

          {completedSteps.length === steps.length && (
            <div className="flex items-center justify-between rounded-lg bg-emerald-100/70 dark:bg-emerald-950/60 border border-emerald-300 dark:border-emerald-800 p-2.5 text-xs text-emerald-900 dark:text-emerald-200">
              <div className="flex items-center gap-2 font-semibold">
                <Award className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                <span>All 4 Core System Deliverables Successfully Tested &amp; Validated</span>
              </div>
              <span className="font-mono text-xs font-bold text-emerald-700 dark:text-emerald-300">
                100% Turnkey Ready
              </span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
