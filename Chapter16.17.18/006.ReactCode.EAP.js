import React, { useState, useEffect } from 'react';
import { Laptop, Router, Server, ArrowRight, ArrowLeft, Lock, CheckCircle, ShieldAlert, Wifi, Zap } from 'lucide-react';

const App = () => {
  const [step, setStep] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  const steps = [
    {
      title: "Step 1: The Request",
      desc: "The Authenticator (Bouncer) asks the Peer: Who are you?",
      msg: "EAP-Request/Identity",
      sender: "auth",
      receiver: "peer",
      color: "text-blue-400",
      bg: "bg-blue-500/10"
    },
    {
      title: "Step 2: The Response",
      desc: "The Peer provides their identity (e.g., alice@company.com).",
      msg: "EAP-Response/Identity",
      sender: "peer",
      receiver: "auth",
      color: "text-emerald-400",
      bg: "bg-emerald-500/10"
    },
    {
      title: "Step 3: Forwarding",
      desc: "The Bouncer doesn't check the ID; he radios the Manager (AAA Server).",
      msg: "Radius-Access-Request",
      sender: "auth",
      receiver: "aaa",
      color: "text-violet-400",
      bg: "bg-violet-500/10"
    },
    {
      title: "Step 4: Negotiation",
      desc: "A secure loop begins. Certificates and tokens are swapped.",
      msg: "EAP-Method Negotiation (Certs/Tokens)",
      sender: "aaa",
      receiver: "peer",
      color: "text-amber-400",
      bg: "bg-amber-500/10"
    },
    {
      title: "Step 5: The Verdict",
      desc: "The Manager tells the Bouncer to open the gate.",
      msg: "EAP-Success",
      sender: "aaa",
      receiver: "auth",
      color: "text-emerald-500",
      bg: "bg-emerald-500/20"
    }
  ];

  const nextStep = () => {
    if (step < steps.length - 1) {
      setIsAnimating(true);
      setTimeout(() => {
        setStep(s => s + 1);
        setIsAnimating(false);
      }, 600);
    } else {
      setStep(0);
    }
  };

  const getPosition = (actor) => {
    if (actor === 'peer') return '0%';
    if (actor === 'auth') return '50%';
    if (actor === 'aaa') return '100%';
    return '0%';
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 p-4 md:p-8 flex flex-col items-center justify-center font-sans">
      <div className="max-w-4xl w-full space-y-8">
        
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-black text-white tracking-tighter flex items-center justify-center gap-3">
            <Zap className="text-yellow-400 fill-yellow-400" />
            EAP AUTH DANCE
          </h1>
          <p className="text-slate-400 italic">Visualizing Figure 18-7 in high-def</p>
        </div>

        {/* The Stage */}
        <div className="relative bg-slate-900/50 border border-slate-800 rounded-[3rem] p-12 overflow-hidden shadow-2xl">
          
          {/* Actors */}
          <div className="flex justify-between items-start relative z-10 mb-24">
            <div className="flex flex-col items-center gap-3 w-24">
              <div className={`p-4 rounded-2xl transition-all duration-500 ${step === 1 || (step === 3 && steps[step].receiver === 'peer') ? 'bg-emerald-500/20 shadow-[0_0_20px_rgba(16,185,129,0.2)]' : 'bg-slate-800'}`}>
                <Laptop className="w-8 h-8 text-white" />
              </div>
              <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Peer</span>
            </div>

            <div className="flex flex-col items-center gap-3 w-24">
              <div className="p-4 rounded-2xl bg-slate-800 relative">
                <Router className="w-8 h-8 text-white" />
                {step === 4 && <div className="absolute -top-2 -right-2 bg-emerald-500 w-4 h-4 rounded-full animate-ping" />}
              </div>
              <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Authenticator</span>
            </div>

            <div className="flex flex-col items-center gap-3 w-24">
              <div className={`p-4 rounded-2xl transition-all duration-500 ${step >= 2 ? 'bg-indigo-500/20 shadow-[0_0_20px_rgba(99,102,241,0.2)]' : 'bg-slate-800'}`}>
                <Server className="w-8 h-8 text-white" />
              </div>
              <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500 text-center leading-tight">AAA Server</span>
            </div>
          </div>

          {/* Connection Lines */}
          <div className="absolute top-[108px] left-[15%] right-[15%] h-px bg-slate-800 border-t border-dashed border-slate-700" />

          {/* Animated Message Packet */}
          <div 
            className={`absolute transition-all duration-700 ease-in-out z-20`}
            style={{ 
              left: `calc(${getPosition(steps[step].sender)} + (50% - ${getPosition(steps[step].sender)}) * ${isAnimating ? 1 : 0})`,
              transform: 'translateX(-50%)',
              top: '90px',
              opacity: isAnimating ? 1 : 0
            }}
          >
            <div className={`px-4 py-2 rounded-full text-[10px] font-bold whitespace-nowrap shadow-xl border ${steps[step].bg} ${steps[step].color} border-current`}>
              {steps[step].msg}
            </div>
          </div>

          {/* Current Step Info */}
          <div className="bg-slate-950/80 border border-slate-800 p-8 rounded-3xl space-y-4">
            <div className="flex items-center justify-between">
              <h3 className={`text-xl font-bold ${steps[step].color}`}>{steps[step].title}</h3>
              <span className="bg-slate-800 px-3 py-1 rounded-full text-[10px] font-mono">STEP {step + 1} / 5</span>
            </div>
            <p className="text-slate-300 leading-relaxed">{steps[step].desc}</p>
            
            <div className={`flex items-center gap-3 p-4 rounded-xl border border-dashed border-slate-700 ${steps[step].bg}`}>
               {steps[step].sender === 'peer' || steps[step].receiver === 'peer' ? <ArrowLeft className={steps[step].color} /> : <ArrowRight className={steps[step].color} />}
               <span className={`text-xs font-mono font-bold ${steps[step].color}`}>{steps[step].msg}</span>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="mt-8 flex gap-1">
            {steps.map((_, i) => (
              <div key={i} className={`h-1 flex-1 rounded-full transition-all duration-500 ${i <= step ? 'bg-indigo-500' : 'bg-slate-800'}`} />
            ))}
          </div>
        </div>

        {/* Controls */}
        <div className="flex justify-center gap-4">
          <button 
            onClick={nextStep}
            className="group flex items-center gap-3 bg-white text-black px-8 py-4 rounded-2xl font-bold hover:bg-indigo-400 hover:text-white transition-all transform active:scale-95"
          >
            {step === steps.length - 1 ? "RESTART DANCE" : "NEXT STEP"}
            <ArrowRight className="group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        {/* Quick Legend */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 opacity-60">
           <div className="flex items-center gap-2 text-[10px] font-bold"><Wifi className="w-3 h-3" /> Over Air (EAPoL)</div>
           <div className="flex items-center gap-2 text-[10px] font-bold"><Lock className="w-3 h-3" /> Secure Tunnel</div>
           <div className="flex items-center gap-2 text-[10px] font-bold"><CheckCircle className="w-3 h-3" /> Gate Opened</div>
           <div className="flex items-center gap-2 text-[10px] font-bold"><ShieldAlert className="w-3 h-3" /> Port Blocked</div>
        </div>
      </div>
    </div>
  );
};

export default App;