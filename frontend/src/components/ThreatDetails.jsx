import React from 'react';
import { motion } from 'framer-motion';
import { Info, AlertTriangle, ShieldAlert, ShieldCheck, HelpCircle } from 'lucide-react';

const ThreatDetails = ({ threats }) => {
  if (!threats || threats.length === 0) return null;

  const getSeverityStyles = (severity) => {
    switch (severity) {
      case 'critical': return {
        base: 'border-[#DC2626]/30 bg-[#DC2626]/[0.02]',
        icon: 'text-[#DC2626]',
        badge: 'bg-[#DC2626] text-white',
        accent: 'bg-[#DC2626]/10'
      };
      case 'high': return {
        base: 'border-[#DC2626]/20 bg-[#DC2626]/[0.01]',
        icon: 'text-[#DC2626]',
        badge: 'bg-[#DC2626] text-white',
        accent: 'bg-[#DC2626]/5'
      };
      case 'medium': return {
        base: 'border-[#D97706]/30 bg-[#D97706]/[0.02]',
        icon: 'text-[#D97706]',
        badge: 'bg-[#D97706] text-white',
        accent: 'bg-[#D97706]/10'
      };
      case 'low': return {
        base: 'border-[#5E8B4A]/30 bg-[#5E8B4A]/[0.02]',
        icon: 'text-[#5E8B4A]',
        badge: 'bg-[#5E8B4A] text-white',
        accent: 'bg-[#5E8B4A]/10'
      };
      default: return {
        base: 'border-surface-200 bg-surface-50',
        icon: 'text-text-400',
        badge: 'bg-text-400 text-white',
        accent: 'bg-surface-100'
      };
    }
  };

  const getSeverityIcon = (severity) => {
    switch (severity) {
      case 'critical': return <ShieldAlert size={20} />;
      case 'high': return <AlertTriangle size={20} />;
      case 'medium': return <Info size={20} />;
      case 'low': return <ShieldCheck size={20} />;
      default: return <Info size={20} />;
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.2 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 300, damping: 24 } }
  };

  return (
    <div className="w-full mt-16">
      <div className="flex items-center justify-between mb-8">
        <h3 className="text-2xl font-black text-text-900 tracking-tight flex items-center gap-3">
          Analysis Insights
          <span className="text-xs font-medium px-3 py-1 rounded-full bg-white text-text-500 border border-surface-200 shadow-sm">
            {threats.length} {threats.length === 1 ? 'Finding' : 'Findings'}
          </span>
        </h3>
      </div>
      
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="grid gap-6"
      >
        {threats.map((threat, index) => {
          const styles = getSeverityStyles(threat.severity);
          
          return (
            <motion.div
              key={index}
              variants={itemVariants}
              className={`group p-6 rounded-[2rem] border-2 ${styles.base} flex flex-col md:flex-row items-start gap-6 transition-all hover:translate-x-1 hover:shadow-xl hover:shadow-surface-900/5`}
            >
              <div className={`p-5 rounded-[1.25rem] ${styles.accent} ${styles.icon} shrink-0 shadow-inner`}>
                {getSeverityIcon(threat.severity)}
              </div>

              <div className="flex-1 space-y-3">
                <div className="flex flex-wrap items-center gap-3">
                  <h4 className="font-black text-lg text-text-900 leading-none">
                    {threat.type}
                  </h4>
                  <span className={`text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest ${styles.badge}`}>
                    {threat.severity}
                  </span>
                </div>

                <p className="text-text-600 text-base leading-relaxed max-w-2xl font-medium">
                  {threat.description}
                </p>

                {threat.whyItMatters && (
                  <div className="pt-4 border-t border-surface-200/50 mt-4">
                    <div className="flex items-start gap-3">
                      <div className={`mt-1 p-1 rounded-full ${styles.accent} ${styles.icon}`}>
                        <HelpCircle size={12} />
                      </div>
                      <div className="space-y-1">
                        <span className="text-[10px] font-black uppercase tracking-widest text-text-400">Security Context</span>
                        <p className="text-sm text-text-500 font-medium italic">
                          {threat.whyItMatters}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          );
        })}
      </motion.div>
    </div>
  );
};

export default ThreatDetails;


