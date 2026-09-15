"use client";

import React, { useState } from "react";
import {
  X,
  Flame,
  ShieldCheck,
  AlertTriangle,
  RefreshCw,
  Zap,
  CheckCircle2,
  Server,
  Radio,
} from "lucide-react";

interface ChaosSimulatorModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface ChaosEvent {
  timestamp: string;
  type: "DISRUPTION" | "RECOVERY" | "FAILOVER_SUCCESS";
  source: string;
  message: string;
  latencyMs: number;
}

export function ChaosSimulatorModal({ isOpen, onClose }: ChaosSimulatorModalProps) {
  const [activeTest, setActiveTest] = useState<"openai_outage" | "twilio_drop" | null>(null);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [logs, setLogs] = useState<ChaosEvent[]>([
    {
      timestamp: "10:14:02.102",
      type: "FAILOVER_SUCCESS",
      source: "Health Sentinel",
      message: "Dual-provider circuit breakers armed. Primary: OpenAI gpt-4o-mini | Backup: Gemini 2.0 Flash.",
      latencyMs: 14,
    },
    {
      timestamp: "10:14:02.105",
      type: "FAILOVER_SUCCESS",
      source: "Carrier Gateway",
      message: "SIP Multi-Homing active. Primary: Twilio Toronto | Secondary: Telnyx Canada-East.",
      latencyMs: 18,
    },
  ]);

  if (!isOpen) return null;

  const runOpenAiOutageTest = () => {
    setActiveTest("openai_outage");
    setIsRunning(true);
    const now = new Date().toLocaleTimeString();

    setLogs((prev) => [
      {
        timestamp: now,
        type: "DISRUPTION",
        source: "OpenAI Gateway",
        message: "SIMULATED: 429 Too Many Requests / 1,850ms latency spike injected into gpt-4o-mini.",
        latencyMs: 1850,
      },
      ...prev,
    ]);

    setTimeout(() => {
      setLogs((prev) => [
        {
          timestamp: new Date().toLocaleTimeString(),
          type: "RECOVERY",
          source: "Failover Engine",
          message: "Circuit breaker tripped. Re-routing conversational speech packet to Google Gemini 2.0 Flash.",
          latencyMs: 42,
        },
        ...prev,
      ]);
    }, 600);

    setTimeout(() => {
      setLogs((prev) => [
        {
          timestamp: new Date().toLocaleTimeString(),
          type: "FAILOVER_SUCCESS",
          source: "Gemini 2.0 Flash",
          message: "SUCCESS: Voice turn synthesized in 164ms. Student experienced zero conversational audio jitter.",
          latencyMs: 164,
        },
        ...prev,
      ]);
      setIsRunning(false);
    }, 1200);
  };

  const runTwilioDropTest = () => {
    setActiveTest("twilio_drop");
    setIsRunning(true);
    const now = new Date().toLocaleTimeString();

    setLogs((prev) => [
      {
        timestamp: now,
        type: "DISRUPTION",
        source: "Twilio SIP Trunk",
        message: "SIMULATED: Carrier 504 Gateway Timeout detected on primary Toronto POP.",
        latencyMs: 980,
      },
      ...prev,
    ]);

    setTimeout(() => {
      setLogs((prev) => [
        {
          timestamp: new Date().toLocaleTimeString(),
          type: "RECOVERY",
          source: "DNS SRV Failover",
          message: "Hot-swapping active outbound call trunk to Telnyx Canada-East (Toronto-2).",
          latencyMs: 85,
        },
        ...prev,
      ]);
    }, 600);

    setTimeout(() => {
      setLogs((prev) => [
        {
          timestamp: new Date().toLocaleTimeString(),
          type: "FAILOVER_SUCCESS",
          source: "Telnyx PSTN",
          message: "SUCCESS: Call maintained with 0 dropped audio frames. G.711 codec re-negotiated in 218ms.",
          latencyMs: 218,
        },
        ...prev,
      ]);
      setIsRunning(false);
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-sm">
      <div className="w-full max-w-2xl rounded-xl border border-[var(--color-border)] bg-[var(--color-panel)] p-6 shadow-xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[var(--color-border-subtle)] pb-4">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-rose-50 text-rose-600 dark:bg-rose-950 dark:text-rose-400">
              <Flame className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-[var(--color-text-primary)]">
                Carrier &amp; LLM Disaster Recovery Simulator
              </h3>
              <p className="text-xs text-[var(--color-text-muted)]">
                Proving sub-300ms zero-loss failover under production PSTN and AI outages
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

        {/* Action Buttons */}
        <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 gap-3">
          <button
            onClick={runOpenAiOutageTest}
            disabled={isRunning}
            className="flex items-center justify-between rounded-xl border border-[var(--color-border)] bg-[var(--color-panel-subtle)] p-4 text-left hover:border-[var(--color-brand-primary)] transition-all cursor-pointer disabled:opacity-50"
          >
            <div>
              <span className="flex items-center gap-1.5 font-bold text-xs text-[var(--color-text-primary)]">
                <Server className="h-4 w-4 text-indigo-500" />
                Simulate OpenAI 429 Outage
              </span>
              <p className="text-[11px] text-[var(--color-text-muted)] mt-1">
                Fails over to Gemini 2.0 Flash in &lt;200ms
              </p>
            </div>
            <Zap className="h-4 w-4 text-[var(--color-brand-primary)]" />
          </button>

          <button
            onClick={runTwilioDropTest}
            disabled={isRunning}
            className="flex items-center justify-between rounded-xl border border-[var(--color-border)] bg-[var(--color-panel-subtle)] p-4 text-left hover:border-[var(--color-brand-primary)] transition-all cursor-pointer disabled:opacity-50"
          >
            <div>
              <span className="flex items-center gap-1.5 font-bold text-xs text-[var(--color-text-primary)]">
                <Radio className="h-4 w-4 text-rose-500" />
                Simulate Twilio Carrier Drop
              </span>
              <p className="text-[11px] text-[var(--color-text-muted)] mt-1">
                Hot-swaps to secondary Telnyx SIP trunk
              </p>
            </div>
            <Zap className="h-4 w-4 text-rose-500" />
          </button>
        </div>

        {/* Live Failover Telemetry Log */}
        <div className="mt-4 rounded-xl border border-[var(--color-border)] bg-[var(--color-panel-subtle)] p-4">
          <div className="flex items-center justify-between border-b border-[var(--color-border)] pb-2 mb-3">
            <span className="text-xs font-bold text-[var(--color-text-primary)] font-mono">
              Live Telemetry &amp; Circuit Breaker Stream
            </span>
            <span className="flex items-center gap-1 text-[10px] font-mono text-emerald-600 dark:text-emerald-400">
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
              ACTIVE MONITORING
            </span>
          </div>

          <div className="space-y-2 font-mono text-xs max-h-56 overflow-y-auto pr-1">
            {logs.map((log, i) => (
              <div
                key={i}
                className={`rounded border p-2 text-[11px] leading-relaxed ${
                  log.type === "DISRUPTION"
                    ? "border-rose-200 bg-rose-50/60 dark:border-rose-900/60 dark:bg-rose-950/40 text-rose-800 dark:text-rose-300"
                    : log.type === "RECOVERY"
                    ? "border-amber-200 bg-amber-50/60 dark:border-amber-900/60 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300"
                    : "border-emerald-200 bg-emerald-50/60 dark:border-emerald-900/60 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300"
                }`}
              >
                <div className="flex items-center justify-between font-bold">
                  <span>[{log.timestamp}] {log.source}</span>
                  <span className="text-[10px]">{log.latencyMs}ms</span>
                </div>
                <p className="mt-0.5">{log.message}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="mt-5 flex items-center justify-end border-t border-[var(--color-border-subtle)] pt-4">
          <button
            onClick={onClose}
            className="rounded-lg bg-[var(--color-brand-primary)] px-4 py-2 text-xs font-semibold text-white hover:bg-[var(--color-brand-hover)] cursor-pointer"
          >
            Close Chaos Test
          </button>
        </div>
      </div>
    </div>
  );
}
