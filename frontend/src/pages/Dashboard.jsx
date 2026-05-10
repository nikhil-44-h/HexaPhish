import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, AlertTriangle, Skull, History, Trash2, ExternalLink } from 'lucide-react';

const Dashboard = () => {
  const [history, setHistory] = useState([]);

  useEffect(() => {
    const data = JSON.parse(localStorage.getItem('hexaphish_history') || '[]');
    setHistory(data);
  }, []);

  const clearHistory = () => {
    localStorage.removeItem('hexaphish_history');
    setHistory([]);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Safe': return 'text-success bg-success/10 border-success/20';
      case 'Suspicious': return 'text-warning bg-warning/10 border-warning/20';
      case 'Dangerous': return 'text-danger bg-danger/10 border-danger/20';
      default: return 'text-text-400 bg-surface-100 border-surface-200';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Safe': return <ShieldCheck size={16} />;
      case 'Suspicious': return <AlertTriangle size={16} />;
      case 'Dangerous': return <Skull size={16} />;
      default: return null;
    }
  };

  return (
    <div className="w-full max-w-6xl mx-auto py-12 px-4 sm:px-6">
      
      <div className="flex justify-between items-end mb-8 border-b border-surface-200 pb-6">
        <div>
          <h1 className="text-3xl font-black text-text-900 flex items-center gap-3">
            <History className="text-primary" />
            Scan History
          </h1>
          <p className="text-text-600 mt-2 font-medium">Recent URL threat analysis logs and reports.</p>
        </div>
        
        {history.length > 0 && (
          <button 
            onClick={clearHistory}
            className="flex items-center gap-2 px-4 py-2 text-sm font-bold text-danger hover:bg-danger/10 rounded-lg transition-colors border border-transparent hover:border-danger/20"
          >
            <Trash2 size={16} />
            Clear Data
          </button>
        )}
      </div>

      {history.length === 0 ? (
        <div className="text-center py-20 bg-white border border-surface-200 rounded-3xl shadow-soft">
          <History size={48} className="mx-auto text-surface-200 mb-4" />
          <h3 className="text-xl font-bold text-text-900">No scan history found</h3>
          <p className="text-text-400 mt-2">Analyze a URL on the home page to see it appear here.</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {history.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="bg-white border border-surface-200 p-5 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 group hover:border-primary/30 hover:shadow-soft-md transition-all duration-300"
            >
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-3 mb-2">
                  <span className={`flex items-center gap-1.5 px-2.5 py-0.5 rounded-full font-bold text-[10px] uppercase tracking-wider border ${getStatusColor(item.status)}`}>
                    {getStatusIcon(item.status)}
                    {item.status}
                  </span>
                  <span className="text-[11px] font-bold text-text-400 uppercase tracking-tighter">
                    {new Date(item.timestamp).toLocaleString()}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-text-600 truncate font-mono text-sm font-medium">
                  <span className="truncate" title={item.url}>{item.url}</span>
                  <a href={item.url.startsWith('http') ? item.url : `http://${item.url}`} target="_blank" rel="noopener noreferrer" className="text-text-400 hover:text-primary shrink-0 transition-colors">
                    <ExternalLink size={14} />
                  </a>
                </div>
              </div>

              <div className="shrink-0 flex items-center gap-6 pl-4 sm:border-l border-surface-100">
                <div className="text-right">
                  <div className="text-[10px] text-text-400 uppercase font-black tracking-[0.1em] mb-0.5">Risk Score</div>
                  <div className={`text-3xl font-black tabular-nums leading-none ${item.score > 70 ? 'text-danger' : item.score > 30 ? 'text-warning' : 'text-success'}`}>
                    {item.score}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

    </div>
  );
};

export default Dashboard;
