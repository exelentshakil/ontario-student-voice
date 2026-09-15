"use client";

import React from "react";
import {
  Users,
  PhoneCall,
  CheckCircle2,
  PhoneOff,
  ShieldCheck,
  TrendingDown,
  DollarSign,
  ArrowUpRight,
} from "lucide-react";
import { KpiSummary } from "@/types";

interface BentoKpiGridProps {
  metrics: KpiSummary;
}

export function BentoKpiGrid({ metrics }: BentoKpiGridProps) {
  return (
    <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-6">
      {/* 1. Total Stale Records Ingested */}
      <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-panel)] p-4 shadow-sm transition-all hover:border-[var(--color-border-subtle)] hover:shadow">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold uppercase tracking-wider text-[var(--color-text-secondary)]">
            Total Leads
          </span>
          <div className="rounded-lg bg-[var(--color-panel-subtle)] p-1.5 text-[var(--color-brand-primary)]">
            <Users className="h-4 w-4" />
          </div>
        </div>
        <div className="mt-3">
          <div className="text-2xl font-bold font-mono tabular-nums tracking-tight text-[var(--color-text-primary)] sm:text-3xl">
            {metrics.totalRecords.toLocaleString()}
          </div>
          <div className="mt-1 flex items-center gap-1.5 text-xs text-[var(--color-text-muted)]">
            <span className="inline-block h-1.5 w-1.5 rounded-full bg-indigo-500"></span>
            Airtable DB Master
          </div>
        </div>
      </div>

      {/* 2. Connect Rate */}
      <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-panel)] p-4 shadow-sm transition-all hover:border-[var(--color-border-subtle)] hover:shadow">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold uppercase tracking-wider text-[var(--color-text-secondary)]">
            Connect Rate
          </span>
          <div className="rounded-lg bg-emerald-50 text-emerald-600 dark:bg-emerald-950/50 dark:text-emerald-400 p-1.5">
            <PhoneCall className="h-4 w-4" />
          </div>
        </div>
        <div className="mt-3">
          <div className="text-2xl font-bold font-mono tabular-nums tracking-tight text-[var(--color-text-primary)] sm:text-3xl">
            {metrics.connectRatePct}%
          </div>
          <div className="mt-1 flex items-center gap-1 text-xs text-emerald-600 dark:text-emerald-400 font-medium">
            <ArrowUpRight className="h-3 w-3" />
            {metrics.connectedCount.toLocaleString()} Live Pickups
          </div>
        </div>
      </div>

      {/* 3. Intent-Confirmed (Ready for Human) */}
      <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-panel)] p-4 shadow-sm transition-all hover:border-[var(--color-border-subtle)] hover:shadow">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold uppercase tracking-wider text-[var(--color-text-secondary)]">
            Intent Confirmed
          </span>
          <div className="rounded-lg bg-indigo-50 text-indigo-600 dark:bg-indigo-950/50 dark:text-indigo-400 p-1.5">
            <CheckCircle2 className="h-4 w-4" />
          </div>
        </div>
        <div className="mt-3">
          <div className="text-2xl font-bold font-mono tabular-nums tracking-tight text-[var(--color-text-primary)] sm:text-3xl">
            {metrics.intentConfirmedCount.toLocaleString()}
          </div>
          <div className="mt-1 text-xs font-medium text-[var(--color-brand-primary)]">
            {metrics.intentConfirmedRatePct}% Qualified for College
          </div>
        </div>
      </div>

      {/* 4. Stale / Bad Numbers Flagged */}
      <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-panel)] p-4 shadow-sm transition-all hover:border-[var(--color-border-subtle)] hover:shadow">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold uppercase tracking-wider text-[var(--color-text-secondary)]">
            Stale / Disconnected
          </span>
          <div className="rounded-lg bg-amber-50 text-amber-600 dark:bg-amber-950/50 dark:text-amber-400 p-1.5">
            <PhoneOff className="h-4 w-4" />
          </div>
        </div>
        <div className="mt-3">
          <div className="text-2xl font-bold font-mono tabular-nums tracking-tight text-[var(--color-text-primary)] sm:text-3xl">
            {metrics.staleBadNumberCount.toLocaleString()}
          </div>
          <div className="mt-1 text-xs text-amber-600 dark:text-amber-400 font-medium">
            {metrics.staleBadNumberPct}% Scrubbed from DB
          </div>
        </div>
      </div>

      {/* 5. Verbal Consent Captured */}
      <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-panel)] p-4 shadow-sm transition-all hover:border-[var(--color-border-subtle)] hover:shadow">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold uppercase tracking-wider text-[var(--color-text-secondary)]">
            Verbal Consent
          </span>
          <div className="rounded-lg bg-teal-50 text-teal-600 dark:bg-teal-950/50 dark:text-teal-400 p-1.5">
            <ShieldCheck className="h-4 w-4" />
          </div>
        </div>
        <div className="mt-3">
          <div className="text-2xl font-bold font-mono tabular-nums tracking-tight text-[var(--color-text-primary)] sm:text-3xl">
            100%
          </div>
          <div className="mt-1 text-xs text-teal-600 dark:text-teal-400 font-medium">
            {metrics.verbalConsentCount.toLocaleString()} SHA-256 Hashes
          </div>
        </div>
      </div>

      {/* 6. Cost Per Confirmed Lead */}
      <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-panel)] p-4 shadow-sm transition-all hover:border-[var(--color-border-subtle)] hover:shadow">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold uppercase tracking-wider text-[var(--color-text-secondary)]">
            Cost / Valid Lead
          </span>
          <div className="rounded-lg bg-emerald-50 text-emerald-600 dark:bg-emerald-950/50 dark:text-emerald-400 p-1.5">
            <DollarSign className="h-4 w-4" />
          </div>
        </div>
        <div className="mt-3">
          <div className="text-2xl font-bold font-mono tabular-nums tracking-tight text-[var(--color-text-primary)] sm:text-3xl">
            ${metrics.costPerConfirmedLeadCad.toFixed(2)}
          </div>
          <div className="mt-1 flex items-center gap-1 text-xs text-emerald-600 dark:text-emerald-400 font-medium">
            <TrendingDown className="h-3 w-3" />
            92% vs Human Reps
          </div>
        </div>
      </div>
    </div>
  );
}
