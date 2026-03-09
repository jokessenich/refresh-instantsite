"use client";

import { useState, useCallback } from "react";
import { AnimatePresence } from "framer-motion";

// Layout
import { Nav } from "@/components/layout/nav";
import { Footer } from "@/components/layout/footer";

// Landing sections
import { Hero } from "@/components/sections/hero";
import { HowItWorks } from "@/components/sections/how-it-works";
import { ExampleWebsites } from "@/components/sections/examples";
import { Pricing } from "@/components/sections/pricing";
import { FAQ } from "@/components/sections/faq";

// Wizard flow
import { FormWizard } from "@/components/wizard/form-wizard";
import { GeneratingScreen } from "@/components/wizard/generating-screen";
import { PreviewPage } from "@/components/wizard/preview-page";

export default function Home() {
  const [view, setView] = useState("landing");
  const [formData, setFormData] = useState(null);

  const handleStartGenerate = useCallback(() => setView("wizard"), []);
  const handleCloseWizard = useCallback(() => setView("landing"), []);
  const handleGenerate = useCallback((data) => {
    setFormData(data);
    setView("generating");
  }, []);
  const handleGenerationComplete = useCallback(() => setView("preview"), []);
  const handleBackToLanding = useCallback(() => setView("landing"), []);

  return (
    <>
      {view === "landing" && <Nav onGenerate={handleStartGenerate} />}

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

      <AnimatePresence>
        {view === "wizard" && (
          <FormWizard
            onClose={handleCloseWizard}
            onGenerate={handleGenerate}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {view === "generating" && (
          <GeneratingScreen onComplete={handleGenerationComplete} />
        )}
      </AnimatePresence>

      {view === "preview" && (
        <PreviewPage form={formData} onBack={handleBackToLanding} />
      )}
    </>
  );
}
