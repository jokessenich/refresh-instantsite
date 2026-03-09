"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Icons } from "@/components/ui/icons";
import { Button, Card } from "@/components/ui";
import { SITE_CONFIG } from "@/lib/constants";

export function PreviewPage({ form, onBack }) {
  const [copied, setCopied] = useState(null);
  const slug = (form?.businessName || "mysite")
    .toLowerCase()
    .replace(/\s+/g, "");
  const previewUrl = `${slug}.${SITE_CONFIG.previewDomain}`;

  const copyText = (text, id) => {
    navigator.clipboard?.writeText(text);
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen bg-bg"
    >
      {/* Top bar */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-border bg-surface/80 backdrop-blur-xl sticky top-0 z-10">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="w-8 h-8 rounded-lg border border-border bg-transparent text-text-dim cursor-pointer flex items-center justify-center hover:text-text-primary transition-colors"
          >
            <Icons.ArrowLeft size={14} />
          </button>
          <div>
            <div className="text-sm font-semibold">
              {form?.businessName || "Your Website"}
            </div>
            <div className="font-mono text-xs text-text-dim">{previewUrl}</div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-success shadow-[0_0_8px_rgba(52,211,153,0.4)]" />
          <span className="text-[13px] text-success font-medium">Live</span>
        </div>
      </div>

      <div className="max-w-[960px] mx-auto px-6 py-10">
        {/* Preview iframe mockup */}
        <div className="rounded-[14px] border border-border overflow-hidden mb-10 bg-surface">
          {/* Browser chrome */}
          <div className="flex items-center gap-2 px-4 py-3 bg-bg border-b border-border">
            <div className="flex gap-1.5">
              <div className="w-2.5 h-2.5 rounded-full bg-red-500" />
              <div className="w-2.5 h-2.5 rounded-full bg-yellow-500" />
              <div className="w-2.5 h-2.5 rounded-full bg-green-500" />
            </div>
            <div className="flex-1 ml-2 px-3.5 py-1.5 bg-surface rounded-lg border border-border">
              <span className="font-mono text-xs text-text-dim">
                https://{previewUrl}
              </span>
            </div>
          </div>

          {/* Site preview */}
          <div className="h-[480px] bg-gradient-to-b from-slate-900 to-indigo-950 flex flex-col items-center justify-center relative overflow-hidden">
            <div
              className="absolute inset-0"
              style={{
                backgroundImage: `
                  linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px),
                  linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)
                `,
                backgroundSize: "40px 40px",
              }}
            />

            <div className="relative text-center px-10">
              <div className="absolute -top-[120px] left-1/2 -translate-x-1/2 flex gap-6 opacity-50">
                {["Home", "Services", "About", "Contact"].map((n) => (
                  <span
                    key={n}
                    className="text-xs text-white/40"
                  >
                    {n}
                  </span>
                ))}
              </div>

              <div className="text-[clamp(24px,4vw,40px)] font-bold text-white tracking-[-0.03em] mb-3">
                {form?.businessName || "Your Business"}
              </div>
              <div className="text-base text-white/50 max-w-[360px] mx-auto mb-6 leading-relaxed">
                {form?.about
                  ? form.about.length > 80
                    ? form.about.slice(0, 80) + "..."
                    : form.about
                  : "Your professional website is live and ready."}
              </div>
              <div className="inline-flex px-6 py-2.5 rounded-lg bg-accent text-white text-sm font-medium">
                Get in Touch
              </div>
            </div>
          </div>
        </div>

        {/* Domain connection */}
        <Card className="p-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-[10px] bg-accent-dim flex items-center justify-center">
              <Icons.Globe size={20} className="text-accent" />
            </div>
            <div>
              <h3 className="text-lg font-semibold tracking-[-0.02em]">
                Connect your domain
              </h3>
              <p className="text-sm text-text-muted">
                Add these DNS records to your domain provider
              </p>
            </div>
          </div>

          <div className="bg-bg rounded-[10px] border border-border overflow-hidden mb-6">
            {/* Table header */}
            <div className="grid grid-cols-[80px_80px_1fr_40px] px-4 py-2.5 border-b border-border">
              {["Type", "Name", "Value", ""].map((h) => (
                <span
                  key={h}
                  className="font-mono text-[11px] text-text-dim font-medium uppercase tracking-wider"
                >
                  {h}
                </span>
              ))}
            </div>

            {SITE_CONFIG.dnsRecords.map((rec, i) => (
              <div
                key={i}
                className={`grid grid-cols-[80px_80px_1fr_40px] px-4 py-3 items-center ${
                  i < SITE_CONFIG.dnsRecords.length - 1
                    ? "border-b border-border-subtle"
                    : ""
                }`}
              >
                <span className="inline-flex px-2 py-0.5 rounded bg-accent-dim text-accent text-xs font-semibold font-mono w-fit">
                  {rec.type}
                </span>
                <span className="font-mono text-[13px] text-text-primary">
                  {rec.name}
                </span>
                <span className="font-mono text-[13px] text-text-muted truncate">
                  {rec.value}
                </span>
                <button
                  onClick={() => copyText(rec.value, i)}
                  className={`w-7 h-7 rounded-md border border-border bg-transparent cursor-pointer flex items-center justify-center transition-all ${
                    copied === i ? "text-success" : "text-text-dim hover:text-text-primary"
                  }`}
                >
                  {copied === i ? (
                    <Icons.Check size={12} />
                  ) : (
                    <Icons.Copy size={12} />
                  )}
                </button>
              </div>
            ))}
          </div>

          <div className="flex gap-2.5 flex-wrap">
            <Button
              variant="primary"
              onClick={() => {
                const text = SITE_CONFIG.dnsRecords
                  .map((r) => `${r.type} ${r.name} → ${r.value}`)
                  .join("\n");
                navigator.clipboard?.writeText(text);
                setCopied("all");
                setTimeout(() => setCopied(null), 2000);
              }}
            >
              <Icons.Copy size={14} />
              {copied === "all" ? "Copied!" : "Copy DNS Instructions"}
            </Button>
            <Button variant="secondary" onClick={onBack}>
              Connect Domain Later
            </Button>
          </div>
        </Card>
      </div>
    </motion.div>
  );
}
