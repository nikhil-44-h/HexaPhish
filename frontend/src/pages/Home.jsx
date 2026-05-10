import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Loader2, Link2, Shield, Globe, Cpu, AlertCircle, Activity, Target } from 'lucide-react';
import axios from 'axios';
import RiskMeter from '../components/RiskMeter';
import ThreatDetails from '../components/ThreatDetails';

const Home = () => {
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [scanStep, setScanStep] = useState(0);
  const [scanProgress, setScanProgress] = useState(0);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  const [validationError, setValidationError] = useState('');

  const scanSteps = [
    { icon: <Globe size={18} />, label: 'Inspecting domain architecture...' },
    { icon: <Shield size={18} />, label: 'Verifying SSL/TLS certificates...' },
    { icon: <Activity size={18} />, label: 'Consulting threat intelligence...' },
    { icon: <Cpu size={18} />, label: 'Analyzing heuristic patterns...' },
    { icon: <Target size={18} />, label: 'Calculating risk probability...' }
  ];

  useEffect(() => {
    let stepInterval;
    let progressInterval;

    if (loading) {
      // Step cycling
      stepInterval = setInterval(() => {
        setScanStep((prev) => (prev < scanSteps.length - 1 ? prev + 1 : prev));
      }, 600);

      // Smooth progress bar fill
      progressInterval = setInterval(() => {
        setScanProgress((prev) => {
          if (prev >= 100) return 100;
          return prev + 1;
        });
      }, 30);
    } else {
      setScanStep(0);
      setScanProgress(0);
    }

    return () => {
      clearInterval(stepInterval);
      clearInterval(progressInterval);
    };
  }, [loading]);

  const isValidUrl = (string) => {
    try {
      if (!string.includes('.') || string.length < 3) return false;
      const testUrl = string.startsWith('http') ? string : `https://${string}`;
      new URL(testUrl);
      return true;
    } catch (_) {
      return false;
    }
  };

  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      if (text) {
        setUrl(text);
        if (validationError) setValidationError('');
      }
    } catch (err) {
      console.error('Failed to read clipboard:', err);
    }
  };

  const analyzeUrl = async (e) => {
    if (e) e.preventDefault();
    if (loading) return; // Prevent double clicks
    
    setValidationError('');
    if (!url.trim()) return;

    if (!isValidUrl(url)) {
      setValidationError('Please enter a valid URL');
      return;
    }
    
    setLoading(true);
    setError('');
    setResult(null);

    try {
      const response = await axios.post('http://localhost:5000/api/analyze', { url });
      
      // Total scan time ~3 seconds for "Premium Feel"
      await new Promise(resolve => setTimeout(resolve, 3200));
      
      setResult(response.data);
      
      // Save to local storage
      const history = JSON.parse(localStorage.getItem('hexaphish_history') || '[]');
      const newEntry = {
        url: response.data.url,
        score: response.data.riskScore,
        status: response.data.status,
        timestamp: response.data.timestamp
      };
      localStorage.setItem('hexaphish_history', JSON.stringify([newEntry, ...history].slice(0, 50)));

    } catch (err) {
      setError('Neural engine unavailable. Please check backend connection.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full min-h-[calc(100vh-8rem)] flex flex-col items-center justify-center py-20 px-4 sm:px-6 relative overflow-hidden">
      
      {/* Background Decorative Elements */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full max-w-7xl pointer-events-none z-0">
        <div className="absolute top-[10%] left-[5%] w-96 h-96 bg-primary/5 rounded-full blur-[120px] animate-pulse"></div>
        <div className="absolute bottom-[20%] right-[5%] w-96 h-96 bg-primary/5 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '1s' }}></div>
      </div>

      <motion.div
        animate={{ opacity: loading ? 0.3 : 1, y: loading ? -10 : 0 }}
        className="text-center mb-16 relative z-10 transition-all duration-700"
      >
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-surface-900 text-white text-[10px] font-black tracking-[0.3em] mb-8 uppercase border border-surface-700 shadow-xl"
        >
          <div className="w-1.5 h-1.5 rounded-full bg-primary animate-ping" />
          Neural Engine V2.0 Active
        </motion.div>
        <h1 className="text-6xl md:text-8xl font-black mb-8 text-text-900 tracking-tighter leading-[0.9]">
          HEXA<span className="text-primary">PHISH</span>
        </h1>
        <p className="text-text-500 max-w-2xl mx-auto text-lg md:text-xl font-medium leading-relaxed">
          Advanced threat intelligence for modern security. <br className="hidden md:block" /> Detect malicious patterns with precision.
        </p>
      </motion.div>

      <motion.form 
        onSubmit={analyzeUrl}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="w-full max-w-3xl relative group mb-20 z-10"
      >
        <div className={`relative flex items-center bg-white rounded-[2.5rem] border-2 ${loading ? 'border-primary' : validationError ? 'border-danger' : 'border-surface-200'} p-3 shadow-2xl transition-all duration-500`}>
          <motion.button
            type="button"
            onClick={handlePaste}
            disabled={loading}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            title="Paste from clipboard"
            className={`pl-6 pr-3 flex items-center justify-center transition-colors outline-none ${validationError ? 'text-danger' : 'text-text-400 hover:text-primary'}`}
          >
            <Link2 size={28} className={loading ? 'text-primary' : ''} />
          </motion.button>
          <input
            type="text"
            value={url}
            onChange={(e) => {
                setUrl(e.target.value);
                if (validationError) setValidationError('');
            }}
            disabled={loading}
            placeholder="Paste suspicious URL here..."
            className="flex-1 bg-transparent border-none outline-none text-text-900 px-3 py-6 font-mono text-xl placeholder:text-text-300 focus:ring-0"
          />
          <button
            type="submit"
            disabled={loading || !url}
            className="ml-3 bg-primary text-white px-10 py-6 rounded-[1.8rem] font-black tracking-widest flex items-center gap-3 hover:bg-primary-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-[0.98]"
          >
            {loading ? <Loader2 className="animate-spin" size={24} /> : <Search size={24} />}
            {loading ? 'SCANNING' : 'ANALYZE'}
          </button>
        </div>

        <AnimatePresence>
          {loading && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className="absolute -bottom-24 left-0 right-0 flex flex-col items-center gap-4"
            >
              <div className="flex items-center gap-3 bg-white px-6 py-3 rounded-2xl border border-surface-200 shadow-xl">
                <motion.div
                  key={scanStep}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-primary"
                >
                  {scanSteps[scanStep].icon}
                </motion.div>
                <span className="text-text-900 font-black text-sm tracking-wide min-w-[200px]">
                  {scanSteps[scanStep].label}
                </span>
                <span className="text-primary font-black text-xs tabular-nums">
                  {scanProgress}%
                </span>
              </div>
              
              {/* Progress Bar */}
              <div className="w-64 h-1.5 bg-surface-100 rounded-full overflow-hidden border border-surface-200 shadow-inner">
                <motion.div 
                  className="h-full bg-primary"
                  initial={{ width: 0 }}
                  animate={{ width: `${scanProgress}%` }}
                />
              </div>
            </motion.div>
          )}
          
          {validationError && (
            <motion.div 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="absolute -bottom-10 left-6 flex items-center gap-2 text-danger font-bold text-sm"
            >
              <AlertCircle size={16} />
              {validationError}
            </motion.div>
          )}
        </AnimatePresence>

        {error && (
          <p className="absolute -bottom-14 left-0 right-0 text-center text-danger text-sm font-black flex items-center justify-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-danger animate-pulse" />
            {error}
          </p>
        )}
      </motion.form>

      <AnimatePresence mode="wait">
        {result && (
          <motion.div
            key="results"
            initial={{ opacity: 0, y: 60 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -60 }}
            transition={{ type: 'spring', damping: 20, stiffness: 80 }}
            className="w-full max-w-4xl space-y-12 z-10 pb-20"
          >
            <RiskMeter score={result.riskScore} status={result.status} confidence={result.confidence} />
            <ThreatDetails threats={result.threats} />
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
};

export default Home;



