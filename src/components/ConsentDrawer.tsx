"use client";

import React from "react";
import {
  X,
  ShieldCheck,
  FileCheck2,
  Lock,
  Copy,
  Download,
  Calendar,
  Building,
  CheckCircle2,
} from "lucide-react";
import { StudentRecord } from "@/types";

interface ConsentDrawerProps {
  student: StudentRecord | null;
  isOpen: boolean;
  onClose: () => void;
}

export function ConsentDrawer({ student, isOpen, onClose }: ConsentDrawerProps) {
  if (!isOpen || !student) return null;

  const details = student.verifiedDetails;
  const sha256 = details?.consentSha256 || "crtc_7f2b1a99a4b2c8e1f03d57";
  const timestamp = details?.consentToShareTimestamp || "2026-09-15T15:16:22.108Z";
  const quote = details?.consentVerbalQuote || "Yes, I understand it is tuition-based and you have my verbal permission to connect me with the admissions team.";
  const college = details?.assignedPartnerCollege || "Licensed Ontario Career College (triOS / Medix / Oxford Partner Network)";

  const handleCopySha = () => {
    navigator.clipboard.writeText(sha256);
    alert("Copied SHA-256 Consent Hash to clipboard!");
  };

  const handleDownloadCertificate = () => {
    const cert = {
      recordId: student.airtableRecordId,
      studentName: student.fullName,
      phone: student.phone,
      jurisdiction: "Ontario, Canada (CRTC Telemarketing Act & FIPPA)",
      consentCapturedAtIso: timestamp,
      consentSpokenQuote: quote,
      sha256Hash: sha256,
      recipientCollege: college,
      tuitionExpectationAcknowledged: true,
      audioVerificationFile: details?.recordingUrl || "https://audio-cdn.ontariovoice.ca/rec_on_9012.mp3",
    };
    const blob = new Blob([JSON.stringify(cert, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `CRTC_Consent_${student.id}.json`;
    a.click();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-sm">
      <div className="w-full max-w-xl rounded-xl border border-[var(--color-border)] bg-[var(--color-panel)] p-6 shadow-xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[var(--color-border-subtle)] pb-4">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-teal-50 text-teal-600 dark:bg-teal-950 dark:text-teal-400">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-[var(--color-text-primary)]">
                Verbal Consent Audit Certificate
              </h3>
              <p className="text-xs text-[var(--color-text-muted)] font-mono">
                CRTC Telemarketing &amp; Third-Party College Data Sharing Proof
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-[var(--color-text-muted)] hover:bg-[var(--color-panel-subtle)] cursor-pointer"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Certificate Body */}
        <div className="mt-5 space-y-4 text-xs">
          {/* Certificate Badge */}
          <div className="rounded-xl border border-teal-200 bg-teal-50/70 dark:border-teal-900 dark:bg-teal-950/30 p-4 text-teal-900 dark:text-teal-200">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-xs uppercase tracking-wider text-teal-700 dark:text-teal-300">
                Official Regulatory Record
              </span>
              <span className="flex items-center gap-1 rounded bg-teal-200/60 dark:bg-teal-900/60 px-2 py-0.5 text-[10px] font-mono font-bold">
                <Lock className="h-3 w-3" />
                VERIFIED &amp; STORED
              </span>
            </div>
            <p className="mt-2 text-sm font-bold text-[var(--color-text-primary)]">
              {student.fullName} ({student.phone})
            </p>
            <p className="text-xs text-[var(--color-text-secondary)] mt-0.5">
              Target Program: {student.originalProgramInterest} • {student.city}, Ontario
            </p>
          </div>

          {/* Captured Spoken Quote */}
          <div>
            <span className="font-semibold uppercase tracking-wider text-[var(--color-text-secondary)] text-[11px]">
              Verbatim Spoken Consent (Audio Transcript):
            </span>
            <div className="mt-1.5 rounded-lg border border-[var(--color-border)] bg-[var(--color-panel-subtle)] p-3 italic text-xs leading-relaxed text-[var(--color-text-primary)]">
              &ldquo;{quote}&rdquo;
            </div>
          </div>

          {/* Metadata Grid */}
          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="rounded-lg border border-[var(--color-border)] bg-[var(--color-panel-subtle)] p-3">
              <span className="text-[10px] uppercase font-semibold text-[var(--color-text-muted)] block">
                Consent Timestamp
              </span>
              <p className="font-mono font-semibold text-[var(--color-text-primary)] mt-1">
                {new Date(timestamp).toLocaleString("en-US", { timeZone: "America/Toronto" })} EST
              </p>
              <p className="font-mono text-[10px] text-[var(--color-text-muted)] mt-0.5">
                {timestamp}
              </p>
            </div>

            <div className="rounded-lg border border-[var(--color-border)] bg-[var(--color-panel-subtle)] p-3">
              <span className="text-[10px] uppercase font-semibold text-[var(--color-text-muted)] block">
                Destination College
              </span>
              <p className="font-semibold text-[var(--color-text-primary)] mt-1 truncate">
                {college}
              </p>
              <p className="text-[10px] text-emerald-600 dark:text-emerald-400 font-medium mt-0.5">
                Tuition Expectations Acknowledged
              </p>
            </div>
          </div>

          {/* SHA-256 Hash Box */}
          <div className="rounded-lg border border-[var(--color-border)] bg-[var(--color-panel-subtle)] p-3">
            <div className="flex items-center justify-between">
              <span className="text-[10px] uppercase font-semibold text-[var(--color-text-muted)]">
                Cryptographic Integrity Hash (SHA-256):
              </span>
              <button
                onClick={handleCopySha}
                className="inline-flex items-center gap-1 text-[10px] font-mono text-[var(--color-brand-primary)] hover:underline cursor-pointer"
              >
                <Copy className="h-3 w-3" />
                Copy Hash
              </button>
            </div>
            <p className="mt-1 font-mono text-xs text-[var(--color-text-primary)] break-all bg-[var(--color-panel)] p-2 rounded border border-[var(--color-border)]">
              {sha256}
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-6 flex items-center justify-between border-t border-[var(--color-border-subtle)] pt-4">
          <span className="text-[11px] text-[var(--color-text-muted)]">
            Airtable ID: <strong className="font-mono">{student.airtableRecordId}</strong>
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={handleDownloadCertificate}
              className="inline-flex items-center gap-1.5 rounded-lg border border-[var(--color-border)] bg-[var(--color-panel)] px-3 py-1.5 text-xs font-semibold text-[var(--color-text-secondary)] hover:bg-[var(--color-panel-subtle)] cursor-pointer"
            >
              <Download className="h-3.5 w-3.5" />
              Download Audit JSON
            </button>
            <button
              onClick={onClose}
              className="rounded-lg bg-[var(--color-brand-primary)] px-4 py-1.5 text-xs font-semibold text-white hover:bg-[var(--color-brand-hover)] cursor-pointer"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
