import React from "react";
import bgImg from "../assets/bg.svg";
import CardBase from "../components/CardBase";
import HeroSection from "../components/HeroSection";
import LogInPage from "../components/Login";

export default function LandingPage() {
  return (
    <div className="relative min-h-screen">
      <img className="absolute top-0 w-full h-full object-cover z-0" src={bgImg} alt="" />

      {/* Content */}
      <div className="relative z-10">
        <LogInPage />
        <HeroSection />
        <div id="base">
          <CardBase />
        </div>
      </div>
    </div>
  );
}
