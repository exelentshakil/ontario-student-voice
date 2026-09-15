"use client";

import React, { useState } from "react";
import {
  Search,
  Filter,
  Phone,
  Play,
  FileCheck,
  ShieldCheck,
  CheckCircle2,
  PhoneOff,
  AlertOctagon,
  ExternalLink,
  ChevronDown,
} from "lucide-react";
import { StudentRecord, VerificationStatus } from "@/types";

interface LeadQueueTableProps {
  students: StudentRecord[];
  onSelectStudentForCall: (studentId: string) => void;
  onOpenConsentModal: (student: StudentRecord) => void;
}

export function LeadQueueTable({
  students,
  onSelectStudentForCall,
  onOpenConsentModal,
}: LeadQueueTableProps) {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [selectedFilter, setSelectedFilter] = useState<string>("All");

  const filteredStudents = students.filter((s) => {
    const matchesSearch =
      s.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.phone.includes(searchTerm) ||
      s.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.originalProgramInterest.toLowerCase().includes(searchTerm.toLowerCase());

    if (!matchesSearch) return false;
    if (selectedFilter === "All") return true;
    if (selectedFilter === "Verified") return s.verificationStatus === "Verified & Interested";
    if (selectedFilter === "Pending") return s.verificationStatus === "Pending Dial";
    if (selectedFilter === "Closed") return s.verificationStatus === "Not Interested / Closed";
    if (selectedFilter === "Invalid") return s.verificationStatus === "Invalid / Disconnected" || s.verificationStatus === "Wrong Person / Reassigned";
    if (selectedFilter === "DNC") return s.verificationStatus === "DNC Opt-Out (Permanent)";
    return true;
  });

  return (
    <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-panel)] shadow-sm">
      {/* Table Header Controls */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-[var(--color-border-subtle)] p-4 sm:p-5">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-base font-bold text-[var(--color-text-primary)]">
              Ontario Domestic Student Master Registry
            </h3>
            <span className="rounded-full bg-[var(--color-brand-subtle)] px-2 py-0.5 text-xs font-mono font-semibold text-[var(--color-brand-primary)]">
              Airtable Synced (15,240 Total)
            </span>
          </div>
          <p className="mt-0.5 text-xs text-[var(--color-text-secondary)]">
            Live database view displaying stale age, verification outcomes, verbal consent hashes, and admissions routing.
          </p>
        </div>

        {/* Search Bar */}
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-[var(--color-text-muted)]" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by student, phone, city, or program..."
            className="w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-panel-subtle)] py-1.5 pl-9 pr-3 text-xs text-[var(--color-text-primary)] placeholder-[var(--color-text-muted)] focus:outline-none focus:ring-1 focus:ring-[var(--color-brand-primary)]"
          />
        </div>
      </div>

      {/* Filter Tabs Bar */}
      <div className="flex items-center gap-1.5 overflow-x-auto border-b border-[var(--color-border-subtle)] px-4 py-2 text-xs">
        {[
          { label: "All Leads", count: "15,240", key: "All" },
          { label: "Verified & Interested", count: "1,837", key: "Verified" },
          { label: "Pending Dial", count: "6,810", key: "Pending" },
          { label: "Closed / Not Interested", count: "3,280", key: "Closed" },
          { label: "Invalid / Disconnected", count: "2,874", key: "Invalid" },
          { label: "DNC Permanent", count: "412", key: "DNC" },
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setSelectedFilter(tab.key)}
            className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 font-semibold transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
              selectedFilter === tab.key
                ? "bg-[var(--color-brand-subtle)] text-[var(--color-brand-primary)] border border-[var(--color-brand-primary)]/20"
                : "text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] hover:bg-[var(--color-panel-subtle)]"
            }`}
          >
            <span>{tab.label}</span>
            <span className="rounded bg-[var(--color-panel)] px-1.5 py-0.2 text-[10px] font-mono opacity-80">
              {tab.count}
            </span>
          </button>
        ))}
      </div>

      {/* Table Content */}
      <div className="overflow-x-auto">
        <table className="table-fixed w-full min-w-[960px] text-left text-xs">
          <thead>
            <tr className="border-b border-[var(--color-border)] bg-[var(--color-panel-subtle)] text-[var(--color-text-secondary)] uppercase font-semibold">
              <th className="w-[22%] px-4 py-3">Student & Phone</th>
              <th className="w-[20%] px-4 py-3">Program & City</th>
              <th className="w-[18%] px-4 py-3">Stale Age & Source</th>
              <th className="w-[18%] px-4 py-3">Verification Outcome</th>
              <th className="w-[12%] px-4 py-3">Verbal Consent</th>
              <th className="w-[10%] px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--color-border-subtle)]">
            {filteredStudents.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center text-xs text-[var(--color-text-muted)]">
                  No records matching &quot;{searchTerm}&quot; in this filter.
                </td>
              </tr>
            ) : (
              filteredStudents.map((s) => (
                <tr key={s.id} className="hover:bg-[var(--color-panel-subtle)] transition-colors">
                  {/* 1. Student & Contact */}
                  <td className="px-4 py-3">
                    <div className="font-semibold text-[var(--color-text-primary)]">{s.fullName}</div>
                    <div className="font-mono text-[var(--color-text-muted)] text-[11px]">{s.phone}</div>
                    <div className="text-[11px] text-[var(--color-text-muted)] truncate">{s.email}</div>
                  </td>

                  {/* 2. Program & City */}
                  <td className="px-4 py-3">
                    <div className="font-medium text-[var(--color-text-primary)] truncate" title={s.originalProgramInterest}>
                      {s.originalProgramInterest}
                    </div>
                    <div className="text-[11px] text-[var(--color-text-secondary)]">
                      {s.city}, ON
                    </div>
                  </td>

                  {/* 3. Stale Age & Source */}
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1.5">
                      <span className="inline-block rounded bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300 px-1.5 py-0.2 text-[10px] font-mono font-bold">
                        {s.staleDays}d Stale
                      </span>
                    </div>
                    <div className="text-[11px] text-[var(--color-text-muted)] truncate mt-0.5" title={s.leadSource}>
                      {s.leadSource}
                    </div>
                  </td>

                  {/* 4. Verification Outcome */}
                  <td className="px-4 py-3">
                    <span
                      className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-semibold whitespace-nowrap ${
                        s.verificationStatus === "Verified & Interested"
                          ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300"
                          : s.verificationStatus === "DNC Opt-Out (Permanent)"
                          ? "bg-rose-100 text-rose-800 dark:bg-rose-950/60 dark:text-rose-300"
                          : s.verificationStatus === "Invalid / Disconnected" || s.verificationStatus === "Wrong Person / Reassigned"
                          ? "bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300"
                          : s.verificationStatus === "Not Interested / Closed"
                          ? "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300"
                          : "bg-indigo-50 text-indigo-700 dark:bg-indigo-950/50 dark:text-indigo-300"
                      }`}
                    >
                      {s.verificationStatus === "Verified & Interested" && <CheckCircle2 className="h-3 w-3" />}
                      {s.verificationStatus === "DNC Opt-Out (Permanent)" && <AlertOctagon className="h-3 w-3" />}
                      {s.verificationStatus === "Invalid / Disconnected" && <PhoneOff className="h-3 w-3" />}
                      {s.verificationStatus}
                    </span>
                    {s.verifiedDetails?.transferOutcome && (
                      <div className="text-[10px] font-mono text-[var(--color-text-muted)] mt-0.5">
                        {s.verifiedDetails.transferOutcome}
                      </div>
                    )}
                  </td>

                  {/* 5. Verbal Consent */}
                  <td className="px-4 py-3">
                    {s.verifiedDetails?.consentSha256 ? (
                      <button
                        onClick={() => onOpenConsentModal(s)}
                        className="inline-flex items-center gap-1 text-[var(--color-accent-emerald)] font-mono text-xs hover:underline cursor-pointer"
                      >
                        <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" />
                        <span className="font-semibold">Logged</span>
                      </button>
                    ) : (
                      <span className="text-[var(--color-text-muted)] text-[11px] font-mono">
                        N/A
                      </span>
                    )}
                  </td>

                  {/* 6. Actions */}
                  <td className="px-4 py-3 text-right">
                    <div className="inline-flex items-center gap-1.5">
                      <button
                        onClick={() => onSelectStudentForCall(s.id)}
                        className="inline-flex items-center gap-1 rounded-md bg-[var(--color-brand-primary)] px-2.5 py-1 text-xs font-semibold text-white hover:bg-[var(--color-brand-hover)] transition-colors whitespace-nowrap cursor-pointer"
                        title="Load into Live Call Simulator"
                      >
                        <Phone className="h-3 w-3" />
                        Dial
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
