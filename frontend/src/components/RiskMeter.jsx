import React from 'react';
import { motion } from 'framer-motion';
import { AlertTriangle, ShieldCheck, Skull, Target } from 'lucide-react';

const RiskMeter = ({ score, status, confidence }) => {
  // Determine colors and icons based on status
  let colorClass = 'text-[#5E8B4A]'; // Sap Green
  let bgClass = 'bg-[#5E8B4A]';
  let tintClass = 'bg-[#5E8B4A]/10 border-[#5E8B4A]/20';
  let Icon = ShieldCheck;

  if (status === 'Suspicious') {
    colorClass = 'text-[#D97706]'; // Amber
    bgClass = 'bg-[#D97706]';
    tintClass = 'bg-[#D97706]/10 border-[#D97706]/20';
    Icon = AlertTriangle;
  } else if (status === 'Dangerous') {
    colorClass = 'text-[#DC2626]'; // Red
    bgClass = 'bg-[#DC2626]';
    tintClass = 'bg-[#DC2626]/10 border-[#DC2626]/20';
    Icon = Skull;
  }

  // Animation variants for the progress bar
  const meterVariants = {
    initial: { width: 0 },
    animate: { 
      width: `${score}%`, 
      transition: { duration: 1.8, ease: [0.34, 1.56, 0.64, 1] } 
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full flex flex-col items-center justify-center p-6 sm:p-10 bg-white border border-surface-200 rounded-[2rem] sm:rounded-[2.5rem] shadow-2xl shadow-surface-900/5 relative overflow-hidden"
    >
      
      {/* Confidence Badge */}
      <motion.div 
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.5 }}
        className="absolute top-4 right-4 sm:top-6 sm:right-6 flex items-center gap-2 bg-surface-50/80 backdrop-blur-sm border border-surface-200 px-3 sm:px-4 py-1.5 sm:py-2 rounded-xl sm:rounded-2xl shadow-sm z-20"
      >
        <Target size={14} className="text-primary" />
        <div className="flex flex-col">
          <span className="text-[8px] sm:text-[10px] font-black uppercase tracking-widest text-text-400 leading-none mb-1">AI Confidence</span>
          <span className="text-xs sm:text-sm font-black text-text-900 leading-none">{confidence}%</span>
        </div>
      </motion.div>

      <div className="relative z-10 w-full max-w-md flex flex-col items-center">
        
        <div className="flex items-center gap-4 sm:gap-5 mb-8">
          <motion.div
            initial={{ scale: 0, rotate: -20 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: 'spring', damping: 12, stiffness: 200, delay: 0.1 }}
            className={`p-4 sm:p-5 rounded-2xl sm:rounded-3xl border-2 ${tintClass} ${colorClass} shadow-inner`}
          >
            <Icon size={32} className="sm:w-10 sm:h-10" />
          </motion.div>
          <div>
            <div className="text-[10px] sm:text-xs font-black uppercase tracking-[0.25em] text-text-400 mb-1">Safety Status</div>
            <h2 className={`text-2xl sm:text-4xl font-black tracking-tight ${colorClass}`}>
              {status.toUpperCase()}
            </h2>
          </div>
        </div>

        {/* Score Display */}
        <div className="flex flex-col items-center mb-8 sm:mb-10">
          <div className="flex items-baseline gap-2">
            <motion.span 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1 }}
              className="text-6xl sm:text-8xl font-black tabular-nums text-text-900 tracking-tighter leading-none"
            >
              {score}
            </motion.span>
            <span className="text-xl sm:text-2xl font-bold text-text-300 uppercase tracking-widest">/ 100</span>
          </div>
          <div className="mt-2 text-[10px] font-black text-text-400 uppercase tracking-[0.3em]">Risk Probability</div>
        </div>

        {/* Meter Bar Container */}
        <div className="w-full space-y-4">
          <div className="w-full h-4 sm:h-5 bg-surface-100 rounded-full overflow-hidden border border-surface-200/50 p-1">
            <motion.div
              variants={meterVariants}
              initial="initial"
              animate="animate"
              className={`h-full rounded-full ${bgClass} shadow-[0_0_20px_rgba(0,0,0,0.1)] relative transition-colors duration-500`}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-white/30 to-transparent" />
              <motion.div 
                animate={{ opacity: [0.3, 0.6, 0.3] }}
                transition={{ repeat: Infinity, duration: 2 }}
                className="absolute inset-0 bg-white/20"
              />
            </motion.div>
          </div>
          
          <div className="w-full flex justify-between text-[9px] sm:text-[10px] font-black text-text-400 uppercase tracking-widest px-1">
            <span className={`flex items-center gap-1.5 ${status === 'Safe' ? 'text-[#5E8B4A]' : ''}`}>
              <div className={`w-2 h-2 rounded-full ${status === 'Safe' ? 'bg-[#5E8B4A] animate-pulse' : 'bg-surface-300'}`} /> 
              Safe
            </span>
            <span className={`flex items-center gap-1.5 ${status === 'Suspicious' ? 'text-[#D97706]' : ''}`}>
              <div className={`w-2 h-2 rounded-full ${status === 'Suspicious' ? 'bg-[#D97706] animate-pulse' : 'bg-surface-300'}`} /> 
              Caution
            </span>
            <span className={`flex items-center gap-1.5 ${status === 'Dangerous' ? 'text-[#DC2626]' : ''}`}>
              <div className={`w-2 h-2 rounded-full ${status === 'Dangerous' ? 'bg-[#DC2626] animate-pulse' : 'bg-surface-300'}`} /> 
              Danger
            </span>
          </div>
        </div>

      </div>

      {/* Decorative background element */}
      <div className={`absolute -bottom-24 -right-24 w-64 h-64 rounded-full opacity-[0.03] pointer-events-none transition-colors duration-500 ${bgClass}`} />
    </motion.div>
  );
};

export default RiskMeter;


