"use client";

import React, { useState, useEffect } from "react";
import { useTheme } from "next-themes";
import {
  PhoneCall,
  Sun,
  Moon,
  ShieldCheck,
  Clock,
  Sparkles,
  Download,
  Terminal,
  Calculator,
  Flame,
  Activity,
} from "lucide-react";
import { getOntarioComplianceState } from "@/lib/compliance";

interface HeaderProps {
  onOpenBatchModal: () => void;
  onOpenRoiModal: () => void;
  onOpenBlueprintsModal: () => void;
  onOpenApiDocsModal: () => void;
  onOpenChaosModal: () => void;
  activeSection: "dashboard" | "queue" | "call";
  setActiveSection: (s: "dashboard" | "queue" | "call") => void;
}

export function Header({
  onOpenBatchModal,
  onOpenRoiModal,
  onOpenBlueprintsModal,
  onOpenApiDocsModal,
  onOpenChaosModal,
  activeSection,
  setActiveSection,
}: HeaderProps) {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [complianceState, setComplianceState] = useState(getOntarioComplianceState());

  useEffect(() => {
    setMounted(true);
    const interval = setInterval(() => {
      setComplianceState(getOntarioComplianceState());
    }, 10000);
    return () => clearInterval(interval);
  }, []);

  return (
    <header className="sticky top-0 z-40 border-b border-[var(--color-border)] bg-[var(--color-panel)]/95 backdrop-blur-md">
      {/* Top Banner: Ontario CRTC Compliance Status */}
      <div className="border-b border-[var(--color-border-subtle)] bg-[var(--color-panel-subtle)] px-4 py-1.5 text-xs text-[var(--color-text-secondary)]">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-2 px-0 sm:px-2">
          <div className="flex items-center gap-2 overflow-x-auto whitespace-nowrap py-0.5">
            <span className="inline-flex items-center gap-1.5 font-semibold text-[var(--color-text-primary)]">
              <ShieldCheck className="h-3.5 w-3.5 text-[var(--color-accent-emerald)]" />
              CRTC Compliance Lock:
            </span>
            <span className="font-mono text-[var(--color-text-muted)]" suppressHydrationWarning>
              {mounted ? complianceState.currentTorontoTime : "--:--:-- EST"}
            </span>
            <span className="text-[var(--color-border)]">•</span>
            <span
              suppressHydrationWarning
              className={`inline-flex items-center gap-1 rounded px-1.5 py-0.5 text-xs font-semibold ${
                complianceState.isWithinBusinessHours
                  ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300"
                  : "bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300"
              }`}
            >
              <Clock className="h-3 w-3" />
              {complianceState.isWithinBusinessHours
                ? "Ontario Calling Window Open (09:00 - 20:00 EST)"
                : "Calling Window Closed (Paused per CRTC Rules)"}
            </span>
          </div>

          <div className="hidden items-center gap-3 text-xs font-medium sm:flex">
            <span className="flex items-center gap-1.5 text-[var(--color-text-muted)]">
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
              Twilio + Vapi SIP Trunk: <strong className="font-mono text-[var(--color-text-primary)]">Toronto POP Active</strong>
            </span>
            <span className="text-[var(--color-border)]">•</span>
            <button
              onClick={onOpenChaosModal}
              className="inline-flex items-center gap-1 text-[var(--color-text-muted)] hover:text-[var(--color-accent-rose)] transition-colors cursor-pointer"
            >
              <Flame className="h-3.5 w-3.5 text-rose-500" />
              Chaos Test
            </button>
          </div>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between gap-4">
          {/* Brand Identity */}
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--color-brand-primary)] text-white shadow-sm shadow-indigo-500/20">
              <PhoneCall className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-base font-bold tracking-tight text-[var(--color-text-primary)] sm:text-lg">
                  VeriStudent AI
                </span>
                <span className="rounded-full bg-[var(--color-brand-subtle)] px-2 py-0.5 text-xs font-semibold text-[var(--color-brand-primary)]">
                  Ontario Carrier Colleges
                </span>
              </div>
              <p className="hidden text-xs text-[var(--color-text-muted)] sm:block">
                Autonomous Outbound Voice Verification & Admissions Pipeline
              </p>
            </div>
          </div>

          {/* Navigation Tabs */}
          <nav className="hidden items-center gap-1 md:flex">
            <button
              onClick={() => setActiveSection("dashboard")}
              className={`rounded-lg px-3 py-2 text-xs font-semibold transition-colors ${
                activeSection === "dashboard"
                  ? "bg-[var(--color-panel-subtle)] text-[var(--color-brand-primary)] border border-[var(--color-border)]"
                  : "text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] hover:bg-[var(--color-panel-subtle)]"
              }`}
            >
              Pipeline Cockpit
            </button>
            <button
              onClick={() => setActiveSection("queue")}
              className={`rounded-lg px-3 py-2 text-xs font-semibold transition-colors ${
                activeSection === "queue"
                  ? "bg-[var(--color-panel-subtle)] text-[var(--color-brand-primary)] border border-[var(--color-border)]"
                  : "text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] hover:bg-[var(--color-panel-subtle)]"
              }`}
            >
              Airtable Student Queue
            </button>
            <button
              onClick={() => setActiveSection("call")}
              className={`rounded-lg px-3 py-2 text-xs font-semibold transition-colors ${
                activeSection === "call"
                  ? "bg-[var(--color-panel-subtle)] text-[var(--color-brand-primary)] border border-[var(--color-border)]"
                  : "text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] hover:bg-[var(--color-panel-subtle)]"
              }`}
            >
              Live Call Simulator
            </button>
          </nav>

          {/* Action Hub */}
          <div className="flex items-center gap-2">
            <button
              onClick={onOpenBatchModal}
              className="inline-flex items-center gap-1.5 rounded-lg bg-[var(--color-brand-primary)] px-3 py-2 text-xs font-semibold text-white shadow-sm hover:bg-[var(--color-brand-hover)] transition-all whitespace-nowrap shrink-0 cursor-pointer"
            >
              <Activity className="h-3.5 w-3.5" />
              Batch Campaign
            </button>

            <button
              onClick={onOpenRoiModal}
              className="hidden rounded-lg border border-[var(--color-border)] bg-[var(--color-panel)] px-2.5 py-2 text-xs font-semibold text-[var(--color-text-secondary)] hover:bg-[var(--color-panel-subtle)] sm:inline-flex items-center gap-1.5 whitespace-nowrap shrink-0 cursor-pointer"
            >
              <Calculator className="h-3.5 w-3.5 text-amber-500" />
              ROI Model
            </button>

            <button
              onClick={onOpenBlueprintsModal}
              className="hidden rounded-lg border border-[var(--color-border)] bg-[var(--color-panel)] px-2.5 py-2 text-xs font-semibold text-[var(--color-text-secondary)] hover:bg-[var(--color-panel-subtle)] md:inline-flex items-center gap-1.5 whitespace-nowrap shrink-0 cursor-pointer"
            >
              <Download className="h-3.5 w-3.5 text-emerald-500" />
              Blueprints
            </button>

            <button
              onClick={onOpenApiDocsModal}
              className="hidden rounded-lg border border-[var(--color-border)] bg-[var(--color-panel)] px-2.5 py-2 text-xs font-semibold text-[var(--color-text-secondary)] hover:bg-[var(--color-panel-subtle)] lg:inline-flex items-center gap-1.5 whitespace-nowrap shrink-0 cursor-pointer"
            >
              <Terminal className="h-3.5 w-3.5 text-indigo-500" />
              API Docs
            </button>

            {/* Theme Toggle */}
            {mounted && (
              <button
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                className="rounded-lg border border-[var(--color-border)] p-2 text-[var(--color-text-secondary)] hover:bg-[var(--color-panel-subtle)] transition-colors cursor-pointer"
                aria-label="Toggle theme"
              >
                {theme === "dark" ? (
                  <Sun className="h-4 w-4 text-amber-400" />
                ) : (
                  <Moon className="h-4 w-4 text-slate-600" />
                )}
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
