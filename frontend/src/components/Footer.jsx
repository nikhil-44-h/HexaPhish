import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

const Footer = () => {
  const [activeModal, setActiveModal] = useState(null);

  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape') setActiveModal(null);
    };
    if (activeModal) {
      window.addEventListener('keydown', handleEsc);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      window.removeEventListener('keydown', handleEsc);
      document.body.style.overflow = 'unset';
    };
  }, [activeModal]);

  const modalContent = {
    privacy: {
      title: 'Privacy Policy',
      content: (
        <div className="space-y-4 text-text-600">
          <p>At HexaPhish, we prioritize your digital anonymity. Our analysis engine is designed with "Privacy by Default" principles.</p>
          <section>
            <h4 className="text-text-900 font-black uppercase text-xs tracking-widest mb-2">Data Collection</h4>
            <p className="text-sm leading-relaxed">We only process the URLs explicitly submitted through our interface. No personal identifiers, IP addresses, or browsing history are linked to your analysis requests.</p>
          </section>
          <section>
            <h4 className="text-text-900 font-black uppercase text-xs tracking-widest mb-2">Storage</h4>
            <p className="text-sm leading-relaxed">Scan results are stored locally in your browser's storage for your convenience. Our servers do not maintain a permanent database of your analyzed links.</p>
          </section>
          <section>
            <h4 className="text-text-900 font-black uppercase text-xs tracking-widest mb-2">Third Parties</h4>
            <p className="text-sm leading-relaxed">We do not sell, trade, or share your data with third-party advertisers or data brokers.</p>
          </section>
        </div>
      )
    },
    terms: {
      title: 'Terms of Service',
      content: (
        <div className="space-y-4 text-text-600">
          <p>By using the HexaPhish Neural Engine, you agree to the following operational parameters:</p>
          <section>
            <h4 className="text-text-900 font-black uppercase text-xs tracking-widest mb-2">Educational Use</h4>
            <p className="text-sm leading-relaxed">HexaPhish is a heuristic-based tool provided for educational and research purposes. It is designed to assist in identifying potential threats, not as a definitive security guarantee.</p>
          </section>
          <section>
            <h4 className="text-text-900 font-black uppercase text-xs tracking-widest mb-2">Accuracy</h4>
            <p className="text-sm leading-relaxed">Phishing tactics evolve rapidly. While our engine is updated frequently, risk scores are probabilistic assessments. Users should exercise independent judgment before interacting with suspicious links.</p>
          </section>
          <section>
            <h4 className="text-text-900 font-black uppercase text-xs tracking-widest mb-2">Liability</h4>
            <p className="text-sm leading-relaxed">HexaPhish Security and its developers are not liable for any damages, data loss, or security breaches resulting from the use or interpretation of this tool.</p>
          </section>
        </div>
      )
    }
  };

  return (
    <footer className="w-full border-t border-surface-200 bg-white mt-auto relative z-40">
      <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6 text-center md:text-left">
          <div className="text-text-400 text-xs sm:text-sm font-medium">
            &copy; {new Date().getFullYear()} HexaPhish Security. <br className="sm:hidden" /> Designed for the digital frontier.
          </div>
          <div className="text-text-600 text-[9px] sm:text-[10px] font-black flex gap-6 sm:gap-8 uppercase tracking-[0.2em]">
            <span 
              onClick={() => setActiveModal('privacy')}
              className="hover:text-primary cursor-pointer transition-colors"
            >
              Privacy
            </span>
            <span 
              onClick={() => setActiveModal('terms')}
              className="hover:text-primary cursor-pointer transition-colors"
            >
              Terms
            </span>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {activeModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setActiveModal(null)}
              className="absolute inset-0 bg-text-900/40 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="relative w-full max-w-lg bg-white rounded-[1.5rem] sm:rounded-[2.5rem] shadow-2xl overflow-hidden border border-surface-200 max-h-[90vh] overflow-y-auto"
            >
              <div className="p-6 sm:p-10">
                <div className="flex items-center justify-between mb-6 sm:mb-8 sticky top-0 bg-white z-10 pb-2">
                  <h3 className="text-lg sm:text-2xl font-black text-text-900 tracking-tighter uppercase italic">
                    {modalContent[activeModal].title}
                  </h3>
                  <button 
                    onClick={() => setActiveModal(null)}
                    className="p-2 rounded-full hover:bg-surface-50 text-text-400 hover:text-text-900 transition-all"
                  >
                    <X size={18} className="sm:w-5 sm:h-5" />
                  </button>
                </div>
                <div className="modal-scroll-area">
                    {modalContent[activeModal].content}
                </div>
                <div className="mt-8 pt-6 border-t border-surface-100">
                  <button
                    onClick={() => setActiveModal(null)}
                    className="w-full py-4 bg-primary text-white font-black uppercase tracking-widest text-[10px] sm:text-xs rounded-xl sm:rounded-2xl hover:bg-primary-600 transition-all"
                  >
                    Accept & Close
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </footer>
  );
};

export default Footer;

