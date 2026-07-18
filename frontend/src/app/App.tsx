import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router';
import { LightFlow } from './components/LightFlow';
import { CustomCursor } from './components/CustomCursor';
import { LandingPage } from './screens/LandingPage';
import { LoginSignup } from './screens/LoginSignup';
import { Dashboard } from './screens/Dashboard';

export default function App() {
  return (
    <BrowserRouter>
      <div className="relative min-h-screen w-full bg-black text-[#A39E93] font-['Inter'] overflow-x-hidden selection:bg-[#C9A86A]/20 cursor-none">
        <CustomCursor />
        {/* Global background — light lines flow right → left on all pages */}
        <LightFlow />

        <div className="relative z-10 min-h-screen">
          <Routes>
            <Route path="/"          element={<LandingPage />} />
            <Route path="/auth"      element={<LoginSignup />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="*"          element={<Navigate to="/" replace />} />
          </Routes>
        </div>
      </div>
    </BrowserRouter>
  );
}
