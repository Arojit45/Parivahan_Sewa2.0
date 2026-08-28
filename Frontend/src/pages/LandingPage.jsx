import React from 'react';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import Hero from '../components/home/Hero';
import Stats from '../components/home/Stats';
import Services from '../components/home/Services';
import DashboardPreview from '../components/home/DashboardPreview';
import AiAssistant from '../components/home/AiAssistant';
import Features from '../components/home/Features';

const LandingPage = () => {
  return (
    <div className="min-h-screen flex flex-col font-sans bg-slate-50">
      <Navbar />
      
      <main className="flex-1">
        <Hero />
        <Stats />
        <Services />
        <DashboardPreview />
        <AiAssistant />
        <Features />
      </main>

      <Footer />
    </div>
  );
};

export default LandingPage;
