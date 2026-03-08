import { useState, useEffect, useRef, useCallback } from "react";

// ─── DESIGN TOKENS ───────────────────────────────────────────────────────────
const COLORS = {
  bg: "#09090b",
  surface: "#111114",
  surfaceHover: "#18181b",
  border: "#27272a",
  borderSubtle: "#1e1e22",
  text: "#fafafa",
  textMuted: "#a1a1aa",
  textDim: "#71717a",
  accent: "#818cf8",
  accentHover: "#6366f1",
  accentDim: "rgba(129,140,248,0.12)",
  accentGlow: "rgba(129,140,248,0.06)",
  success: "#34d399",
  successDim: "rgba(52,211,153,0.12)",
};

// ─── ICONS (inline SVG components) ──────────────────────────────────────────
const Icons = {
  Zap: (p) => (
    <svg width={p.size||20} height={p.size||20} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>
  ),
  FileText: (p) => (
    <svg width={p.size||20} height={p.size||20} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>
  ),
  Sparkles: (p) => (
    <svg width={p.size||20} height={p.size||20} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M12 3l1.5 5.5L19 10l-5.5 1.5L12 17l-1.5-5.5L5 10l5.5-1.5L12 3z"/><path d="M19 15l.5 1.5L21 17l-1.5.5L19 19l-.5-1.5L17 17l1.5-.5L19 15z"/></svg>
  ),
  Globe: (p) => (
    <svg width={p.size||20} height={p.size||20} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>
  ),
  Check: (p) => (
    <svg width={p.size||20} height={p.size||20} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}><polyline points="20 6 9 17 4 12"/></svg>
  ),
  ArrowRight: (p) => (
    <svg width={p.size||20} height={p.size||20} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
  ),
  ArrowLeft: (p) => (
    <svg width={p.size||20} height={p.size||20} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>
  ),
  Copy: (p) => (
    <svg width={p.size||20} height={p.size||20} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>
  ),
  ChevronDown: (p) => (
    <svg width={p.size||20} height={p.size||20} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}><polyline points="6 9 12 15 18 9"/></svg>
  ),
  X: (p) => (
    <svg width={p.size||20} height={p.size||20} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
  ),
  Upload: (p) => (
    <svg width={p.size||20} height={p.size||20} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}><polyline points="16 16 12 12 8 16"/><line x1="12" y1="12" x2="12" y2="21"/><path d="M20.39 18.39A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 3 16.3"/></svg>
  ),
  ExternalLink: (p) => (
    <svg width={p.size||20} height={p.size||20} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
  ),
};

// ─── GLOBAL STYLES ───────────────────────────────────────────────────────────
const GlobalStyles = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500&family=Outfit:wght@300;400;500;600;700&display=swap');
    
    * { margin: 0; padding: 0; box-sizing: border-box; }
    
    :root {
      --bg: ${COLORS.bg};
      --surface: ${COLORS.surface};
      --border: ${COLORS.border};
      --text: ${COLORS.text};
      --textMuted: ${COLORS.textMuted};
      --accent: ${COLORS.accent};
    }
    
    html { scroll-behavior: smooth; }
    
    body {
      font-family: 'Outfit', -apple-system, sans-serif;
      background: var(--bg);
      color: var(--text);
      -webkit-font-smoothing: antialiased;
      overflow-x: hidden;
    }
    
    ::selection {
      background: rgba(129,140,248,0.3);
      color: white;
    }
    
    input, textarea, select {
      font-family: 'Outfit', -apple-system, sans-serif;
    }
    
    code, .mono {
      font-family: 'JetBrains Mono', monospace;
    }

    @keyframes fadeInUp {
      from { opacity: 0; transform: translateY(24px); }
      to { opacity: 1; transform: translateY(0); }
    }
    
    @keyframes fadeIn {
      from { opacity: 0; }
      to { opacity: 1; }
    }
    
    @keyframes slideInRight {
      from { opacity: 0; transform: translateX(20px); }
      to { opacity: 1; transform: translateX(0); }
    }

    @keyframes pulse-ring {
      0% { transform: scale(0.8); opacity: 0.6; }
      50% { transform: scale(1.1); opacity: 0.2; }
      100% { transform: scale(0.8); opacity: 0.6; }
    }
    
    @keyframes shimmer {
      0% { background-position: -200% 0; }
      100% { background-position: 200% 0; }
    }

    @keyframes float {
      0%, 100% { transform: translateY(0); }
      50% { transform: translateY(-8px); }
    }

    @keyframes progress-pulse {
      0%, 100% { opacity: 0.4; }
      50% { opacity: 1; }
    }

    @keyframes grid-fade {
      0% { opacity: 0.03; }
      50% { opacity: 0.06; }
      100% { opacity: 0.03; }
    }

    .animate-in {
      animation: fadeInUp 0.7s cubic-bezier(0.16, 1, 0.3, 1) forwards;
      opacity: 0;
    }

    .delay-1 { animation-delay: 0.1s; }
    .delay-2 { animation-delay: 0.2s; }
    .delay-3 { animation-delay: 0.3s; }
    .delay-4 { animation-delay: 0.4s; }
    .delay-5 { animation-delay: 0.5s; }
    .delay-6 { animation-delay: 0.6s; }
    .delay-7 { animation-delay: 0.7s; }
    
    .shimmer-text {
      background: linear-gradient(90deg, ${COLORS.textMuted}, ${COLORS.text}, ${COLORS.textMuted});
      background-size: 200% 100%;
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      animation: shimmer 3s ease-in-out infinite;
    }

    /* Scrollbar */
    ::-webkit-scrollbar { width: 6px; }
    ::-webkit-scrollbar-track { background: transparent; }
    ::-webkit-scrollbar-thumb { background: ${COLORS.border}; border-radius: 3px; }
    ::-webkit-scrollbar-thumb:hover { background: ${COLORS.textDim}; }
  `}</style>
);

// ─── REUSABLE UI COMPONENTS ─────────────────────────────────────────────────
const Button = ({ children, variant = "primary", size = "md", onClick, disabled, style, className = "" }) => {
  const base = {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    borderRadius: 10,
    fontWeight: 500,
    cursor: disabled ? "not-allowed" : "pointer",
    transition: "all 0.2s cubic-bezier(0.16, 1, 0.3, 1)",
    border: "none",
    fontFamily: "inherit",
    letterSpacing: "-0.01em",
    opacity: disabled ? 0.5 : 1,
    whiteSpace: "nowrap",
  };
  
  const variants = {
    primary: {
      background: COLORS.accent,
      color: "#fff",
      boxShadow: `0 0 0 1px rgba(129,140,248,0.3), 0 2px 8px rgba(129,140,248,0.2)`,
    },
    secondary: {
      background: "transparent",
      color: COLORS.textMuted,
      border: `1px solid ${COLORS.border}`,
    },
    ghost: {
      background: "transparent",
      color: COLORS.textMuted,
    },
  };
  
  const sizes = {
    sm: { padding: "8px 16px", fontSize: 13 },
    md: { padding: "10px 20px", fontSize: 14 },
    lg: { padding: "14px 28px", fontSize: 15 },
  };

  return (
    <button
      onClick={disabled ? undefined : onClick}
      className={className}
      style={{ ...base, ...variants[variant], ...sizes[size], ...style }}
      onMouseEnter={(e) => {
        if (variant === "primary") {
          e.target.style.background = COLORS.accentHover;
          e.target.style.transform = "translateY(-1px)";
          e.target.style.boxShadow = `0 0 0 1px rgba(129,140,248,0.4), 0 4px 16px rgba(129,140,248,0.3)`;
        } else if (variant === "secondary") {
          e.target.style.borderColor = COLORS.textDim;
          e.target.style.color = COLORS.text;
        } else {
          e.target.style.color = COLORS.text;
        }
      }}
      onMouseLeave={(e) => {
        if (variant === "primary") {
          e.target.style.background = COLORS.accent;
          e.target.style.transform = "translateY(0)";
          e.target.style.boxShadow = `0 0 0 1px rgba(129,140,248,0.3), 0 2px 8px rgba(129,140,248,0.2)`;
        } else if (variant === "secondary") {
          e.target.style.borderColor = COLORS.border;
          e.target.style.color = COLORS.textMuted;
        } else {
          e.target.style.color = COLORS.textMuted;
        }
      }}
    >
      {children}
    </button>
  );
};

const Input = ({ label, placeholder, value, onChange, type = "text" }) => (
  <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
    {label && <label style={{ fontSize: 13, color: COLORS.textMuted, fontWeight: 500 }}>{label}</label>}
    <input
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      style={{
        padding: "10px 14px",
        background: COLORS.bg,
        border: `1px solid ${COLORS.border}`,
        borderRadius: 10,
        color: COLORS.text,
        fontSize: 14,
        outline: "none",
        transition: "border-color 0.2s",
        fontFamily: "inherit",
      }}
      onFocus={(e) => { e.target.style.borderColor = COLORS.accent; }}
      onBlur={(e) => { e.target.style.borderColor = COLORS.border; }}
    />
  </div>
);

const TextArea = ({ label, placeholder, value, onChange, rows = 4 }) => (
  <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
    {label && <label style={{ fontSize: 13, color: COLORS.textMuted, fontWeight: 500 }}>{label}</label>}
    <textarea
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      rows={rows}
      style={{
        padding: "10px 14px",
        background: COLORS.bg,
        border: `1px solid ${COLORS.border}`,
        borderRadius: 10,
        color: COLORS.text,
        fontSize: 14,
        outline: "none",
        resize: "vertical",
        transition: "border-color 0.2s",
        fontFamily: "inherit",
        lineHeight: 1.6,
      }}
      onFocus={(e) => { e.target.style.borderColor = COLORS.accent; }}
      onBlur={(e) => { e.target.style.borderColor = COLORS.border; }}
    />
  </div>
);

const Select = ({ label, options, value, onChange }) => (
  <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
    {label && <label style={{ fontSize: 13, color: COLORS.textMuted, fontWeight: 500 }}>{label}</label>}
    <div style={{ position: "relative" }}>
      <select
        value={value}
        onChange={onChange}
        style={{
          width: "100%",
          padding: "10px 14px",
          paddingRight: 36,
          background: COLORS.bg,
          border: `1px solid ${COLORS.border}`,
          borderRadius: 10,
          color: value ? COLORS.text : COLORS.textDim,
          fontSize: 14,
          outline: "none",
          appearance: "none",
          cursor: "pointer",
          fontFamily: "inherit",
          transition: "border-color 0.2s",
        }}
        onFocus={(e) => { e.target.style.borderColor = COLORS.accent; }}
        onBlur={(e) => { e.target.style.borderColor = COLORS.border; }}
      >
        {options.map((o) => (
          <option key={o.value} value={o.value} style={{ background: COLORS.surface, color: COLORS.text }}>
            {o.label}
          </option>
        ))}
      </select>
      <div style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", pointerEvents: "none", color: COLORS.textDim }}>
        <Icons.ChevronDown size={16} />
      </div>
    </div>
  </div>
);

const UploadZone = ({ label, hint }) => {
  const [file, setFile] = useState(null);
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
      {label && <label style={{ fontSize: 13, color: COLORS.textMuted, fontWeight: 500 }}>{label}</label>}
      <div
        onClick={() => {
          const input = document.createElement("input");
          input.type = "file";
          input.accept = "image/*";
          input.onchange = (e) => setFile(e.target.files[0]);
          input.click();
        }}
        style={{
          padding: 24,
          border: `1.5px dashed ${file ? COLORS.accent : COLORS.border}`,
          borderRadius: 10,
          background: file ? COLORS.accentDim : "transparent",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 8,
          cursor: "pointer",
          transition: "all 0.2s",
        }}
      >
        {file ? (
          <>
            <Icons.Check size={20} style={{ color: COLORS.accent }} />
            <span style={{ fontSize: 13, color: COLORS.accent }}>{file.name}</span>
          </>
        ) : (
          <>
            <Icons.Upload size={20} style={{ color: COLORS.textDim }} />
            <span style={{ fontSize: 13, color: COLORS.textDim }}>{hint || "Click to upload"}</span>
          </>
        )}
      </div>
    </div>
  );
};

const Badge = ({ children }) => (
  <span style={{
    display: "inline-flex",
    padding: "4px 10px",
    background: COLORS.accentDim,
    color: COLORS.accent,
    borderRadius: 6,
    fontSize: 12,
    fontWeight: 500,
    letterSpacing: "0.02em",
  }}>
    {children}
  </span>
);

const Card = ({ children, style, hoverable, onClick }) => {
  const [hovered, setHovered] = useState(false);
  return (
    <div
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: COLORS.surface,
        border: `1px solid ${hovered && hoverable ? COLORS.textDim : COLORS.border}`,
        borderRadius: 14,
        overflow: "hidden",
        transition: "all 0.3s cubic-bezier(0.16, 1, 0.3, 1)",
        transform: hovered && hoverable ? "translateY(-2px)" : "translateY(0)",
        cursor: hoverable ? "pointer" : "default",
        ...style,
      }}
    >
      {children}
    </div>
  );
};

// ─── ANIMATED FLOW ILLUSTRATION ─────────────────────────────────────────────
const FlowIllustration = () => {
  const steps = [
    { icon: <Icons.FileText size={22} />, label: "Form", color: COLORS.accent },
    { icon: <Icons.Sparkles size={22} />, label: "AI Gen", color: "#c084fc" },
    { icon: <Icons.Globe size={22} />, label: "Live Site", color: COLORS.success },
  ];

  return (
    <div style={{
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      gap: 0,
      padding: "40px 20px",
    }}>
      {steps.map((step, i) => (
        <div key={i} style={{ display: "flex", alignItems: "center" }}>
          <div
            className="animate-in"
            style={{
              animationDelay: `${0.8 + i * 0.2}s`,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 10,
            }}
          >
            <div style={{
              width: 56,
              height: 56,
              borderRadius: 14,
              background: `${step.color}12`,
              border: `1px solid ${step.color}30`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: step.color,
              animation: `float 3s ease-in-out ${i * 0.5}s infinite`,
            }}>
              {step.icon}
            </div>
            <span style={{ fontSize: 12, color: COLORS.textDim, fontWeight: 500 }}>{step.label}</span>
          </div>
          {i < steps.length - 1 && (
            <div
              className="animate-in"
              style={{
                animationDelay: `${1.0 + i * 0.2}s`,
                width: 48,
                height: 1,
                background: `linear-gradient(90deg, ${step.color}40, ${steps[i + 1].color}40)`,
                margin: "0 8px",
                marginBottom: 26,
              }}
            />
          )}
        </div>
      ))}
    </div>
  );
};

// ─── GRID BACKGROUND ────────────────────────────────────────────────────────
const GridBG = () => (
  <div style={{
    position: "absolute",
    inset: 0,
    overflow: "hidden",
    pointerEvents: "none",
  }}>
    <div style={{
      position: "absolute",
      inset: 0,
      backgroundImage: `
        linear-gradient(${COLORS.border}20 1px, transparent 1px),
        linear-gradient(90deg, ${COLORS.border}20 1px, transparent 1px)
      `,
      backgroundSize: "64px 64px",
      animation: "grid-fade 8s ease-in-out infinite",
    }} />
    <div style={{
      position: "absolute",
      top: "-20%",
      left: "50%",
      transform: "translateX(-50%)",
      width: 800,
      height: 800,
      background: `radial-gradient(circle, ${COLORS.accent}08 0%, transparent 60%)`,
      borderRadius: "50%",
    }} />
  </div>
);

// ─── NAVIGATION ─────────────────────────────────────────────────────────────
const Nav = ({ onGenerate, currentView }) => {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  if (currentView !== "landing") return null;

  return (
    <nav style={{
      position: "fixed",
      top: 0,
      left: 0,
      right: 0,
      zIndex: 100,
      padding: "0 24px",
      transition: "all 0.3s",
      background: scrolled ? `${COLORS.bg}e6` : "transparent",
      backdropFilter: scrolled ? "blur(20px) saturate(1.2)" : "none",
      borderBottom: scrolled ? `1px solid ${COLORS.border}` : "1px solid transparent",
    }}>
      <div style={{
        maxWidth: 1200,
        margin: "0 auto",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        height: 64,
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <div style={{
            width: 28,
            height: 28,
            borderRadius: 8,
            background: `linear-gradient(135deg, ${COLORS.accent}, #c084fc)`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}>
            <Icons.Zap size={15} style={{ color: "#fff" }} />
          </div>
          <span style={{ fontWeight: 600, fontSize: 16, letterSpacing: "-0.03em" }}>InstantSite</span>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <a href="#pricing" style={{ textDecoration: "none" }}>
            <Button variant="ghost" size="sm">Pricing</Button>
          </a>
          <a href="#examples" style={{ textDecoration: "none" }}>
            <Button variant="ghost" size="sm">Examples</Button>
          </a>
          <Button variant="primary" size="sm" onClick={onGenerate}>
            Generate Website
          </Button>
        </div>
      </div>
    </nav>
  );
};

// ─── HERO SECTION ───────────────────────────────────────────────────────────
const Hero = ({ onGenerate }) => (
  <section style={{
    position: "relative",
    minHeight: "100vh",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    textAlign: "center",
    padding: "120px 24px 80px",
    overflow: "hidden",
  }}>
    <GridBG />

    <div style={{ position: "relative", zIndex: 1, maxWidth: 720 }}>
      <div className="animate-in delay-1">
        <Badge>AI-Powered Website Generation</Badge>
      </div>

      <h1
        className="animate-in delay-2"
        style={{
          fontSize: "clamp(36px, 6vw, 64px)",
          fontWeight: 700,
          letterSpacing: "-0.04em",
          lineHeight: 1.05,
          marginTop: 24,
          background: `linear-gradient(180deg, ${COLORS.text} 40%, ${COLORS.textMuted})`,
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
        }}
      >
        Launch a website
        <br />in minutes.
      </h1>

      <p
        className="animate-in delay-3"
        style={{
          fontSize: "clamp(16px, 2vw, 18px)",
          color: COLORS.textMuted,
          lineHeight: 1.7,
          marginTop: 20,
          maxWidth: 520,
          marginLeft: "auto",
          marginRight: "auto",
        }}
      >
        Describe your business, upload a few images, and we generate
        a live website instantly. No code, no templates, no waiting.
      </p>

      <div
        className="animate-in delay-4"
        style={{
          display: "flex",
          gap: 12,
          justifyContent: "center",
          marginTop: 36,
          flexWrap: "wrap",
        }}
      >
        <Button variant="primary" size="lg" onClick={onGenerate}>
          Generate My Website <Icons.ArrowRight size={16} />
        </Button>
        <a href="#examples" style={{ textDecoration: "none" }}>
          <Button variant="secondary" size="lg">See Example Sites</Button>
        </a>
      </div>

      <FlowIllustration />
    </div>
  </section>
);

// ─── HOW IT WORKS ───────────────────────────────────────────────────────────
const HowItWorks = () => {
  const steps = [
    {
      num: "01",
      title: "Fill out the site brief",
      desc: "Tell us about your business, services, and design preferences in a simple guided form.",
      icon: <Icons.FileText size={24} />,
    },
    {
      num: "02",
      title: "AI generates your website",
      desc: "Our AI crafts a complete, professional website with copy, layout, and imagery tailored to you.",
      icon: <Icons.Sparkles size={24} />,
    },
    {
      num: "03",
      title: "Connect your domain & launch",
      desc: "Point your domain to your new site and go live. We provide all the instructions you need.",
      icon: <Icons.Globe size={24} />,
    },
  ];

  return (
    <section style={{ padding: "100px 24px", maxWidth: 1200, margin: "0 auto" }}>
      <div style={{ textAlign: "center", marginBottom: 64 }}>
        <Badge>Process</Badge>
        <h2 style={{
          fontSize: "clamp(28px, 4vw, 40px)",
          fontWeight: 700,
          letterSpacing: "-0.03em",
          marginTop: 16,
        }}>
          How it works
        </h2>
        <p style={{ color: COLORS.textMuted, marginTop: 12, fontSize: 16, maxWidth: 440, margin: "12px auto 0" }}>
          Three simple steps from idea to a live, professional website.
        </p>
      </div>

      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
        gap: 20,
      }}>
        {steps.map((step, i) => (
          <Card key={i} style={{ padding: 32 }}>
            <div style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: 20,
            }}>
              <span className="mono" style={{
                fontSize: 13,
                color: COLORS.accent,
                fontWeight: 500,
              }}>
                {step.num}
              </span>
              <div style={{ color: COLORS.textDim }}>{step.icon}</div>
            </div>
            <h3 style={{ fontSize: 18, fontWeight: 600, letterSpacing: "-0.02em", marginBottom: 8 }}>
              {step.title}
            </h3>
            <p style={{ fontSize: 14, color: COLORS.textMuted, lineHeight: 1.7 }}>
              {step.desc}
            </p>
          </Card>
        ))}
      </div>
    </section>
  );
};

// ─── EXAMPLE WEBSITES ───────────────────────────────────────────────────────
const ExampleWebsites = () => {
  const examples = [
    { name: "Bloom Studio", type: "Photography", color: "#f472b6", gradient: "linear-gradient(135deg, #831843, #be185d)" },
    { name: "Atlas Consulting", type: "Professional Services", color: "#60a5fa", gradient: "linear-gradient(135deg, #1e3a5f, #2563eb)" },
    { name: "Verde Kitchen", type: "Restaurant", color: "#34d399", gradient: "linear-gradient(135deg, #064e3b, #059669)" },
    { name: "Pulse Fitness", type: "Gym & Wellness", color: "#f97316", gradient: "linear-gradient(135deg, #7c2d12, #ea580c)" },
    { name: "Solace Therapy", type: "Health & Wellness", color: "#c084fc", gradient: "linear-gradient(135deg, #4c1d95, #7c3aed)" },
    { name: "Flux Creative", type: "Design Agency", color: "#fbbf24", gradient: "linear-gradient(135deg, #78350f, #d97706)" },
  ];

  return (
    <section id="examples" style={{ padding: "100px 24px", maxWidth: 1200, margin: "0 auto" }}>
      <div style={{ textAlign: "center", marginBottom: 64 }}>
        <Badge>Portfolio</Badge>
        <h2 style={{
          fontSize: "clamp(28px, 4vw, 40px)",
          fontWeight: 700,
          letterSpacing: "-0.03em",
          marginTop: 16,
        }}>
          Example websites
        </h2>
        <p style={{ color: COLORS.textMuted, marginTop: 12, fontSize: 16, maxWidth: 440, margin: "12px auto 0" }}>
          Real sites generated by InstantSite for businesses like yours.
        </p>
      </div>

      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(340px, 1fr))",
        gap: 20,
      }}>
        {examples.map((ex, i) => (
          <Card key={i} hoverable style={{ overflow: "hidden" }}>
            {/* Browser mockup */}
            <div style={{
              background: ex.gradient,
              height: 200,
              position: "relative",
              display: "flex",
              flexDirection: "column",
            }}>
              {/* Browser chrome */}
              <div style={{
                display: "flex",
                alignItems: "center",
                gap: 6,
                padding: "10px 14px",
                background: "rgba(0,0,0,0.3)",
                backdropFilter: "blur(10px)",
              }}>
                <div style={{ width: 8, height: 8, borderRadius: "50%", background: "rgba(255,255,255,0.2)" }} />
                <div style={{ width: 8, height: 8, borderRadius: "50%", background: "rgba(255,255,255,0.2)" }} />
                <div style={{ width: 8, height: 8, borderRadius: "50%", background: "rgba(255,255,255,0.2)" }} />
                <div style={{
                  flex: 1,
                  marginLeft: 8,
                  height: 22,
                  borderRadius: 6,
                  background: "rgba(0,0,0,0.3)",
                  display: "flex",
                  alignItems: "center",
                  paddingLeft: 10,
                }}>
                  <span className="mono" style={{ fontSize: 10, color: "rgba(255,255,255,0.4)" }}>
                    {ex.name.toLowerCase().replace(/\s+/g, "")}.com
                  </span>
                </div>
              </div>
              
              {/* Mock content */}
              <div style={{ flex: 1, padding: 20, display: "flex", flexDirection: "column", justifyContent: "center" }}>
                <div style={{ width: "60%", height: 8, borderRadius: 4, background: "rgba(255,255,255,0.25)", marginBottom: 10 }} />
                <div style={{ width: "80%", height: 20, borderRadius: 4, background: "rgba(255,255,255,0.15)", marginBottom: 8 }} />
                <div style={{ width: "50%", height: 6, borderRadius: 3, background: "rgba(255,255,255,0.1)", marginBottom: 16 }} />
                <div style={{ width: 80, height: 28, borderRadius: 6, background: "rgba(255,255,255,0.2)" }} />
              </div>
            </div>
            
            <div style={{ padding: "16px 20px" }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <div>
                  <h4 style={{ fontSize: 15, fontWeight: 600, letterSpacing: "-0.01em" }}>{ex.name}</h4>
                  <span style={{ fontSize: 13, color: COLORS.textDim }}>{ex.type}</span>
                </div>
                <Icons.ExternalLink size={14} style={{ color: COLORS.textDim }} />
              </div>
            </div>
          </Card>
        ))}
      </div>
    </section>
  );
};

// ─── PRICING ────────────────────────────────────────────────────────────────
const Pricing = ({ onGenerate }) => {
  const features = [
    "AI-powered website generation",
    "Professional copywriting",
    "Responsive mobile design",
    "Hosting-ready deployment",
    "Domain connection instructions",
    "SEO-optimized structure",
  ];

  return (
    <section id="pricing" style={{ padding: "100px 24px", maxWidth: 1200, margin: "0 auto" }}>
      <div style={{ textAlign: "center", marginBottom: 64 }}>
        <Badge>Pricing</Badge>
        <h2 style={{
          fontSize: "clamp(28px, 4vw, 40px)",
          fontWeight: 700,
          letterSpacing: "-0.03em",
          marginTop: 16,
        }}>
          Simple, transparent pricing
        </h2>
        <p style={{ color: COLORS.textMuted, marginTop: 12, fontSize: 16 }}>
          One price. Everything included. No subscriptions.
        </p>
      </div>

      <div style={{ maxWidth: 440, margin: "0 auto" }}>
        <Card style={{
          padding: 40,
          border: `1px solid ${COLORS.accent}30`,
          background: `linear-gradient(180deg, ${COLORS.surface}, ${COLORS.bg})`,
        }}>
          <div style={{ textAlign: "center", marginBottom: 32 }}>
            <span style={{ fontSize: 14, color: COLORS.textMuted, fontWeight: 500 }}>Per website</span>
            <div style={{ display: "flex", alignItems: "baseline", justifyContent: "center", gap: 4, marginTop: 8 }}>
              <span style={{ fontSize: 48, fontWeight: 700, letterSpacing: "-0.04em" }}>$499</span>
            </div>
            <span style={{ fontSize: 14, color: COLORS.textDim }}>one-time payment</span>
          </div>

          <div style={{
            display: "flex",
            flexDirection: "column",
            gap: 14,
            marginBottom: 32,
            padding: "24px 0",
            borderTop: `1px solid ${COLORS.border}`,
            borderBottom: `1px solid ${COLORS.border}`,
          }}>
            {features.map((f, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <div style={{
                  width: 20,
                  height: 20,
                  borderRadius: 6,
                  background: COLORS.successDim,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                }}>
                  <Icons.Check size={12} style={{ color: COLORS.success }} />
                </div>
                <span style={{ fontSize: 14, color: COLORS.textMuted }}>{f}</span>
              </div>
            ))}
          </div>

          <Button variant="primary" size="lg" onClick={onGenerate} style={{ width: "100%" }}>
            Generate My Website <Icons.ArrowRight size={16} />
          </Button>
        </Card>
      </div>
    </section>
  );
};

// ─── FAQ ────────────────────────────────────────────────────────────────────
const FAQ = () => {
  const [open, setOpen] = useState(null);
  const faqs = [
    {
      q: "Is the generated site editable?",
      a: "Yes. You receive the full source code of your website, which can be edited using any code editor or CMS. We also offer revision services if you need changes made."
    },
    {
      q: "Can I connect my own domain?",
      a: "Absolutely. We provide step-by-step DNS configuration instructions. Simply point your domain's A record and CNAME to our servers and your site goes live."
    },
    {
      q: "What if I want changes after generation?",
      a: "You can edit the code yourself, or reach out to us for revisions. Minor changes are included within 7 days of generation at no extra cost."
    },
    {
      q: "How long does generation take?",
      a: "Most websites are generated within 2–3 minutes. Complex sites with many pages may take slightly longer."
    },
    {
      q: "What technology are the sites built with?",
      a: "Generated sites use modern HTML, CSS, and JavaScript. They're static, fast-loading, and optimized for performance and SEO."
    },
  ];

  return (
    <section style={{ padding: "100px 24px", maxWidth: 720, margin: "0 auto" }}>
      <div style={{ textAlign: "center", marginBottom: 64 }}>
        <Badge>FAQ</Badge>
        <h2 style={{
          fontSize: "clamp(28px, 4vw, 40px)",
          fontWeight: 700,
          letterSpacing: "-0.03em",
          marginTop: 16,
        }}>
          Common questions
        </h2>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
        {faqs.map((faq, i) => (
          <div
            key={i}
            style={{
              borderBottom: `1px solid ${COLORS.border}`,
              overflow: "hidden",
            }}
          >
            <button
              onClick={() => setOpen(open === i ? null : i)}
              style={{
                width: "100%",
                padding: "20px 0",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                background: "none",
                border: "none",
                color: COLORS.text,
                fontSize: 15,
                fontWeight: 500,
                cursor: "pointer",
                fontFamily: "inherit",
                textAlign: "left",
                letterSpacing: "-0.01em",
              }}
            >
              {faq.q}
              <Icons.ChevronDown
                size={16}
                style={{
                  color: COLORS.textDim,
                  transition: "transform 0.3s",
                  transform: open === i ? "rotate(180deg)" : "rotate(0)",
                  flexShrink: 0,
                  marginLeft: 16,
                }}
              />
            </button>
            <div style={{
              maxHeight: open === i ? 200 : 0,
              overflow: "hidden",
              transition: "max-height 0.3s cubic-bezier(0.16, 1, 0.3, 1)",
            }}>
              <p style={{
                fontSize: 14,
                color: COLORS.textMuted,
                lineHeight: 1.7,
                paddingBottom: 20,
              }}>
                {faq.a}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

// ─── FOOTER ─────────────────────────────────────────────────────────────────
const Footer = () => (
  <footer style={{
    padding: "40px 24px",
    borderTop: `1px solid ${COLORS.border}`,
    maxWidth: 1200,
    margin: "0 auto",
  }}>
    <div style={{
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      flexWrap: "wrap",
      gap: 16,
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <div style={{
          width: 24,
          height: 24,
          borderRadius: 6,
          background: `linear-gradient(135deg, ${COLORS.accent}, #c084fc)`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}>
          <Icons.Zap size={12} style={{ color: "#fff" }} />
        </div>
        <span style={{ fontWeight: 600, fontSize: 14, letterSpacing: "-0.02em" }}>InstantSite</span>
      </div>
      <span style={{ fontSize: 13, color: COLORS.textDim }}>
        &copy; 2026 InstantSite. All rights reserved.
      </span>
    </div>
  </footer>
);

// ─── FORM WIZARD ────────────────────────────────────────────────────────────
const StepIndicator = ({ current, total }) => (
  <div style={{ display: "flex", gap: 6, marginBottom: 32 }}>
    {Array.from({ length: total }, (_, i) => (
      <div key={i} style={{
        flex: 1,
        height: 3,
        borderRadius: 2,
        background: i <= current ? COLORS.accent : COLORS.border,
        transition: "background 0.3s",
      }} />
    ))}
  </div>
);

const OptionSelector = ({ label, options, value, onChange }) => (
  <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
    {label && <label style={{ fontSize: 13, color: COLORS.textMuted, fontWeight: 500 }}>{label}</label>}
    <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
      {options.map((opt) => (
        <button
          key={opt}
          onClick={() => onChange(opt)}
          style={{
            padding: "8px 16px",
            borderRadius: 8,
            border: `1px solid ${value === opt ? COLORS.accent : COLORS.border}`,
            background: value === opt ? COLORS.accentDim : "transparent",
            color: value === opt ? COLORS.accent : COLORS.textMuted,
            fontSize: 13,
            fontWeight: 500,
            cursor: "pointer",
            fontFamily: "inherit",
            transition: "all 0.2s",
          }}
        >
          {opt}
        </button>
      ))}
    </div>
  </div>
);

const FormWizard = ({ onClose, onGenerate }) => {
  const [step, setStep] = useState(0);
  const [form, setForm] = useState({
    businessName: "",
    businessType: "",
    location: "",
    goal: "",
    services: "",
    about: "",
    colorPalette: "",
    fontStyle: "",
    siteVibe: "",
  });

  const updateForm = (key, val) => setForm((prev) => ({ ...prev, [key]: val }));

  const steps = [
    {
      title: "Business basics",
      subtitle: "Tell us about your business",
      content: (
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          <Input label="Business name" placeholder="e.g. Bloom Studio" value={form.businessName} onChange={(e) => updateForm("businessName", e.target.value)} />
          <Select
            label="Business type"
            value={form.businessType}
            onChange={(e) => updateForm("businessType", e.target.value)}
            options={[
              { value: "", label: "Select type..." },
              { value: "restaurant", label: "Restaurant" },
              { value: "agency", label: "Agency" },
              { value: "photography", label: "Photography" },
              { value: "consulting", label: "Consulting" },
              { value: "fitness", label: "Fitness & Wellness" },
              { value: "retail", label: "Retail" },
              { value: "healthcare", label: "Healthcare" },
              { value: "other", label: "Other" },
            ]}
          />
          <Input label="Location" placeholder="e.g. San Francisco, CA" value={form.location} onChange={(e) => updateForm("location", e.target.value)} />
          <OptionSelector
            label="Primary goal of website"
            options={["Generate Leads", "Portfolio", "Informational"]}
            value={form.goal}
            onChange={(val) => updateForm("goal", val)}
          />
        </div>
      ),
    },
    {
      title: "Content",
      subtitle: "What should your website say?",
      content: (
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          <TextArea label="Services offered" placeholder="List the main services or products you offer..." value={form.services} onChange={(e) => updateForm("services", e.target.value)} />
          <TextArea label="About your business" placeholder="A brief description of your business, mission, and what makes you unique..." value={form.about} onChange={(e) => updateForm("about", e.target.value)} />
          <UploadZone label="Logo" hint="Upload your logo (PNG, SVG)" />
          <UploadZone label="Images" hint="Upload photos of your business, team, or products" />
        </div>
      ),
    },
    {
      title: "Design preferences",
      subtitle: "How should your site look and feel?",
      content: (
        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            <label style={{ fontSize: 13, color: COLORS.textMuted, fontWeight: 500 }}>Color palette</label>
            <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
              {[
                { name: "Ocean", colors: ["#0ea5e9", "#06b6d4", "#0d1b2a"] },
                { name: "Forest", colors: ["#22c55e", "#16a34a", "#0f1f0f"] },
                { name: "Sunset", colors: ["#f97316", "#ef4444", "#1a0a0a"] },
                { name: "Lavender", colors: ["#a78bfa", "#818cf8", "#0f0a1f"] },
                { name: "Monochrome", colors: ["#fafafa", "#71717a", "#09090b"] },
              ].map((palette) => (
                <button
                  key={palette.name}
                  onClick={() => updateForm("colorPalette", palette.name)}
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: 8,
                    padding: 12,
                    borderRadius: 10,
                    border: `1px solid ${form.colorPalette === palette.name ? COLORS.accent : COLORS.border}`,
                    background: form.colorPalette === palette.name ? COLORS.accentDim : "transparent",
                    cursor: "pointer",
                    transition: "all 0.2s",
                  }}
                >
                  <div style={{ display: "flex", gap: 3 }}>
                    {palette.colors.map((c, i) => (
                      <div key={i} style={{
                        width: 18,
                        height: 18,
                        borderRadius: 4,
                        background: c,
                        border: `1px solid ${COLORS.border}`,
                      }} />
                    ))}
                  </div>
                  <span style={{
                    fontSize: 11,
                    color: form.colorPalette === palette.name ? COLORS.accent : COLORS.textDim,
                    fontWeight: 500,
                  }}>
                    {palette.name}
                  </span>
                </button>
              ))}
            </div>
          </div>

          <OptionSelector
            label="Font style"
            options={["Modern", "Elegant", "Bold"]}
            value={form.fontStyle}
            onChange={(val) => updateForm("fontStyle", val)}
          />

          <OptionSelector
            label="Site vibe"
            options={["Professional", "Playful", "Minimal"]}
            value={form.siteVibe}
            onChange={(val) => updateForm("siteVibe", val)}
          />
        </div>
      ),
    },
    {
      title: "Review",
      subtitle: "Confirm your details",
      content: (
        <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
          {[
            ["Business name", form.businessName || "—"],
            ["Business type", form.businessType || "—"],
            ["Location", form.location || "—"],
            ["Website goal", form.goal || "—"],
            ["Services", form.services ? (form.services.length > 60 ? form.services.slice(0, 60) + "..." : form.services) : "—"],
            ["Color palette", form.colorPalette || "—"],
            ["Font style", form.fontStyle || "—"],
            ["Site vibe", form.siteVibe || "—"],
          ].map(([label, value], i) => (
            <div
              key={i}
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "14px 0",
                borderBottom: `1px solid ${COLORS.borderSubtle}`,
              }}
            >
              <span style={{ fontSize: 13, color: COLORS.textDim }}>{label}</span>
              <span style={{ fontSize: 14, color: COLORS.text, fontWeight: 500, textAlign: "right", maxWidth: "60%" }}>
                {value}
              </span>
            </div>
          ))}
        </div>
      ),
    },
  ];

  return (
    <div style={{
      position: "fixed",
      inset: 0,
      zIndex: 200,
      background: `${COLORS.bg}f0`,
      backdropFilter: "blur(24px)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: 24,
      animation: "fadeIn 0.3s ease",
    }}>
      <div style={{
        width: "100%",
        maxWidth: 540,
        maxHeight: "90vh",
        overflowY: "auto",
        background: COLORS.surface,
        border: `1px solid ${COLORS.border}`,
        borderRadius: 18,
        padding: "32px 32px 24px",
        animation: "fadeInUp 0.4s cubic-bezier(0.16, 1, 0.3, 1)",
      }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
          <div>
            <h3 style={{ fontSize: 20, fontWeight: 600, letterSpacing: "-0.02em" }}>{steps[step].title}</h3>
            <p style={{ fontSize: 14, color: COLORS.textMuted, marginTop: 4 }}>{steps[step].subtitle}</p>
          </div>
          <button
            onClick={onClose}
            style={{
              width: 32,
              height: 32,
              borderRadius: 8,
              border: `1px solid ${COLORS.border}`,
              background: "transparent",
              color: COLORS.textDim,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Icons.X size={14} />
          </button>
        </div>

        <StepIndicator current={step} total={steps.length} />

        <div key={step} style={{ animation: "slideInRight 0.3s ease" }}>
          {steps[step].content}
        </div>

        <div style={{ display: "flex", gap: 10, marginTop: 32, justifyContent: "space-between" }}>
          {step > 0 ? (
            <Button variant="secondary" onClick={() => setStep(step - 1)}>
              <Icons.ArrowLeft size={14} /> Back
            </Button>
          ) : <div />}
          
          {step < steps.length - 1 ? (
            <Button variant="primary" onClick={() => setStep(step + 1)}>
              Continue <Icons.ArrowRight size={14} />
            </Button>
          ) : (
            <Button variant="primary" onClick={() => onGenerate(form)}>
              <Icons.Sparkles size={14} /> Generate My Website
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

// ─── LOADING / GENERATION SCREEN ────────────────────────────────────────────
const GeneratingScreen = ({ onComplete }) => {
  const [stage, setStage] = useState(0);
  const stages = [
    "Analyzing your brief...",
    "Generating layout...",
    "Writing copy...",
    "Building components...",
    "Deploying site...",
  ];

  useEffect(() => {
    const timers = stages.map((_, i) =>
      setTimeout(() => setStage(i), i * 700)
    );
    const done = setTimeout(() => onComplete(), stages.length * 700 + 400);
    return () => { timers.forEach(clearTimeout); clearTimeout(done); };
  }, []);

  return (
    <div style={{
      position: "fixed",
      inset: 0,
      zIndex: 300,
      background: COLORS.bg,
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      gap: 40,
      animation: "fadeIn 0.3s ease",
    }}>
      <GridBG />

      <div style={{ position: "relative", zIndex: 1, textAlign: "center" }}>
        {/* Animated spinner */}
        <div style={{
          width: 64,
          height: 64,
          borderRadius: 18,
          background: COLORS.accentDim,
          border: `1px solid ${COLORS.accent}30`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          margin: "0 auto 32px",
          position: "relative",
        }}>
          <Icons.Sparkles size={28} style={{ color: COLORS.accent, animation: "float 2s ease-in-out infinite" }} />
          <div style={{
            position: "absolute",
            inset: -8,
            borderRadius: 22,
            border: `1px solid ${COLORS.accent}20`,
            animation: "pulse-ring 2s ease-in-out infinite",
          }} />
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 10, minHeight: 160 }}>
          {stages.map((s, i) => (
            <div
              key={i}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 12,
                justifyContent: "center",
                opacity: i <= stage ? 1 : 0.2,
                transition: "opacity 0.4s, transform 0.4s",
                transform: i <= stage ? "translateX(0)" : "translateX(10px)",
              }}
            >
              <div style={{
                width: 18,
                height: 18,
                borderRadius: 5,
                background: i < stage ? COLORS.successDim : i === stage ? COLORS.accentDim : "transparent",
                border: `1px solid ${i < stage ? COLORS.success + "40" : i === stage ? COLORS.accent + "40" : COLORS.border}`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                transition: "all 0.3s",
              }}>
                {i < stage && <Icons.Check size={10} style={{ color: COLORS.success }} />}
                {i === stage && (
                  <div style={{
                    width: 6,
                    height: 6,
                    borderRadius: 2,
                    background: COLORS.accent,
                    animation: "progress-pulse 1s ease-in-out infinite",
                  }} />
                )}
              </div>
              <span className="mono" style={{
                fontSize: 13,
                color: i <= stage ? COLORS.text : COLORS.textDim,
                fontWeight: i === stage ? 500 : 400,
              }}>
                {s}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// ─── PREVIEW PAGE ───────────────────────────────────────────────────────────
const PreviewPage = ({ form, onBack }) => {
  const [copied, setCopied] = useState(null);
  const slug = (form?.businessName || "mysite").toLowerCase().replace(/\s+/g, "");
  const previewUrl = `${slug}.preview.instantsite.com`;

  const dnsRecords = [
    { type: "A", name: "@", value: "76.76.21.21" },
    { type: "CNAME", name: "www", value: "cname.vercel-dns.com" },
  ];

  const copyText = (text, id) => {
    navigator.clipboard?.writeText(text);
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
  };

  return (
    <div style={{
      minHeight: "100vh",
      background: COLORS.bg,
      animation: "fadeIn 0.5s ease",
    }}>
      {/* Top bar */}
      <div style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "16px 24px",
        borderBottom: `1px solid ${COLORS.border}`,
        background: `${COLORS.surface}cc`,
        backdropFilter: "blur(20px)",
        position: "sticky",
        top: 0,
        zIndex: 10,
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <button
            onClick={onBack}
            style={{
              width: 32, height: 32, borderRadius: 8,
              border: `1px solid ${COLORS.border}`, background: "transparent",
              color: COLORS.textDim, cursor: "pointer",
              display: "flex", alignItems: "center", justifyContent: "center",
            }}
          >
            <Icons.ArrowLeft size={14} />
          </button>
          <div>
            <div style={{ fontSize: 14, fontWeight: 600 }}>{form?.businessName || "Your Website"}</div>
            <div className="mono" style={{ fontSize: 12, color: COLORS.textDim }}>{previewUrl}</div>
          </div>
        </div>
        <div style={{
          display: "flex",
          alignItems: "center",
          gap: 8,
        }}>
          <div style={{
            width: 8, height: 8, borderRadius: "50%",
            background: COLORS.success,
            boxShadow: `0 0 8px ${COLORS.success}60`,
          }} />
          <span style={{ fontSize: 13, color: COLORS.success, fontWeight: 500 }}>Live</span>
        </div>
      </div>

      <div style={{ maxWidth: 960, margin: "0 auto", padding: "40px 24px" }}>
        {/* Preview iframe mockup */}
        <div style={{
          borderRadius: 14,
          border: `1px solid ${COLORS.border}`,
          overflow: "hidden",
          marginBottom: 40,
          background: COLORS.surface,
        }}>
          {/* Browser chrome */}
          <div style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            padding: "12px 16px",
            background: COLORS.bg,
            borderBottom: `1px solid ${COLORS.border}`,
          }}>
            <div style={{ display: "flex", gap: 6 }}>
              <div style={{ width: 10, height: 10, borderRadius: "50%", background: "#ef4444" }} />
              <div style={{ width: 10, height: 10, borderRadius: "50%", background: "#eab308" }} />
              <div style={{ width: 10, height: 10, borderRadius: "50%", background: "#22c55e" }} />
            </div>
            <div style={{
              flex: 1,
              marginLeft: 8,
              padding: "6px 14px",
              background: COLORS.surface,
              borderRadius: 8,
              border: `1px solid ${COLORS.border}`,
            }}>
              <span className="mono" style={{ fontSize: 12, color: COLORS.textDim }}>
                https://{previewUrl}
              </span>
            </div>
          </div>

          {/* Site preview content */}
          <div style={{
            height: 480,
            background: `linear-gradient(180deg, #0f172a, #1e1b4b)`,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            position: "relative",
            overflow: "hidden",
          }}>
            {/* Decorative grid */}
            <div style={{
              position: "absolute",
              inset: 0,
              backgroundImage: `
                linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px),
                linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)
              `,
              backgroundSize: "40px 40px",
            }} />

            <div style={{ position: "relative", textAlign: "center", padding: 40 }}>
              {/* Simulated nav */}
              <div style={{
                position: "absolute",
                top: -120,
                left: "50%",
                transform: "translateX(-50%)",
                display: "flex",
                gap: 24,
                opacity: 0.5,
              }}>
                {["Home", "Services", "About", "Contact"].map((n) => (
                  <span key={n} style={{ fontSize: 12, color: "rgba(255,255,255,0.4)" }}>{n}</span>
                ))}
              </div>

              <div style={{
                fontSize: "clamp(24px, 4vw, 40px)",
                fontWeight: 700,
                color: "white",
                letterSpacing: "-0.03em",
                marginBottom: 12,
              }}>
                {form?.businessName || "Your Business"}
              </div>
              <div style={{
                fontSize: 16,
                color: "rgba(255,255,255,0.5)",
                maxWidth: 360,
                margin: "0 auto 24px",
                lineHeight: 1.6,
              }}>
                {form?.about ? (form.about.length > 80 ? form.about.slice(0, 80) + "..." : form.about) : "Your professional website is live and ready."}
              </div>
              <div style={{
                display: "inline-flex",
                padding: "10px 24px",
                borderRadius: 8,
                background: COLORS.accent,
                color: "white",
                fontSize: 14,
                fontWeight: 500,
              }}>
                Get in Touch
              </div>
            </div>
          </div>
        </div>

        {/* Domain connection */}
        <Card style={{ padding: 32 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 24 }}>
            <div style={{
              width: 40,
              height: 40,
              borderRadius: 10,
              background: COLORS.accentDim,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}>
              <Icons.Globe size={20} style={{ color: COLORS.accent }} />
            </div>
            <div>
              <h3 style={{ fontSize: 18, fontWeight: 600, letterSpacing: "-0.02em" }}>Connect your domain</h3>
              <p style={{ fontSize: 14, color: COLORS.textMuted }}>Add these DNS records to your domain provider</p>
            </div>
          </div>

          <div style={{
            background: COLORS.bg,
            borderRadius: 10,
            border: `1px solid ${COLORS.border}`,
            overflow: "hidden",
            marginBottom: 24,
          }}>
            {/* Table header */}
            <div style={{
              display: "grid",
              gridTemplateColumns: "80px 80px 1fr 40px",
              padding: "10px 16px",
              borderBottom: `1px solid ${COLORS.border}`,
            }}>
              {["Type", "Name", "Value", ""].map((h) => (
                <span key={h} className="mono" style={{ fontSize: 11, color: COLORS.textDim, fontWeight: 500, textTransform: "uppercase", letterSpacing: "0.05em" }}>
                  {h}
                </span>
              ))}
            </div>

            {dnsRecords.map((rec, i) => (
              <div
                key={i}
                style={{
                  display: "grid",
                  gridTemplateColumns: "80px 80px 1fr 40px",
                  padding: "12px 16px",
                  borderBottom: i < dnsRecords.length - 1 ? `1px solid ${COLORS.borderSubtle}` : "none",
                  alignItems: "center",
                }}
              >
                <span style={{
                  display: "inline-flex",
                  padding: "2px 8px",
                  borderRadius: 4,
                  background: COLORS.accentDim,
                  color: COLORS.accent,
                  fontSize: 12,
                  fontWeight: 600,
                  fontFamily: "'JetBrains Mono', monospace",
                  width: "fit-content",
                }}>
                  {rec.type}
                </span>
                <span className="mono" style={{ fontSize: 13, color: COLORS.text }}>{rec.name}</span>
                <span className="mono" style={{ fontSize: 13, color: COLORS.textMuted, overflow: "hidden", textOverflow: "ellipsis" }}>{rec.value}</span>
                <button
                  onClick={() => copyText(rec.value, i)}
                  style={{
                    width: 28,
                    height: 28,
                    borderRadius: 6,
                    border: `1px solid ${COLORS.border}`,
                    background: "transparent",
                    color: copied === i ? COLORS.success : COLORS.textDim,
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    transition: "all 0.2s",
                  }}
                >
                  {copied === i ? <Icons.Check size={12} /> : <Icons.Copy size={12} />}
                </button>
              </div>
            ))}
          </div>

          <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
            <Button
              variant="primary"
              onClick={() => {
                const text = dnsRecords.map((r) => `${r.type} ${r.name} → ${r.value}`).join("\n");
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
    </div>
  );
};

// ─── MAIN APP ───────────────────────────────────────────────────────────────
export default function InstantSite() {
  const [view, setView] = useState("landing"); // landing, wizard, generating, preview
  const [formData, setFormData] = useState(null);

  const handleStartGenerate = () => setView("wizard");
  const handleCloseWizard = () => setView("landing");
  const handleGenerate = (data) => {
    setFormData(data);
    setView("generating");
  };
  const handleGenerationComplete = () => setView("preview");
  const handleBackToLanding = () => setView("landing");

  return (
    <div>
      <GlobalStyles />
      
      <Nav onGenerate={handleStartGenerate} currentView={view} />

      {view === "landing" && (
        <>
          <Hero onGenerate={handleStartGenerate} />
          <HowItWorks />
          <ExampleWebsites />
          <Pricing onGenerate={handleStartGenerate} />
          <FAQ />
          <Footer />
        </>
      )}

      {view === "wizard" && (
        <FormWizard onClose={handleCloseWizard} onGenerate={handleGenerate} />
      )}

      {view === "generating" && (
        <GeneratingScreen onComplete={handleGenerationComplete} />
      )}

      {view === "preview" && (
        <PreviewPage form={formData} onBack={handleBackToLanding} />
      )}
    </div>
  );
}
