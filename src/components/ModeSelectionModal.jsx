import React from 'react';
import { motion } from 'framer-motion';
import { Grid3x3, Grid2x2 } from 'lucide-react';


const ModeSelectionModal = ({ onSelectMode }) => {
    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed inset-0 bg-black/90 flex items-center justify-center z-50 p-4"
        >
            <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                className="bg-slate-900/95 p-8 rounded-2xl border-2 border-slate-700/50 backdrop-blur-sm max-w-2xl w-full"
            >
                <h2 className="text-4xl font-bold text-center mb-2 text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">
                    Choose Your Grid
                </h2>
                <p className="text-slate-400 text-center mb-8">Select your difficulty tier</p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    {/* 4×4 Hardcore Mode */}
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => onSelectMode(4)}
                        className="group relative overflow-hidden"
                    >
                        <div className="bg-gradient-to-br from-red-900/40 to-red-950/40 border-2 border-red-500/50 p-8 rounded-xl hover:border-red-400 transition-all">
                            <Grid2x2 className="w-16 h-16 mx-auto mb-4 text-red-400 group-hover:text-red-300" />
                            <h3 className="text-3xl font-bold text-red-400 mb-2">4×4</h3>
                            <p className="text-red-300 font-semibold mb-1">Hardcore Tactical Mode</p>
                            <p className="text-red-400/70 text-sm">16 cells • Intense • Fast-paced</p>
                        </div>
                    </motion.button>

                    {/* 6×6 Extended Mode */}
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => onSelectMode(6)}
                        className="group relative overflow-hidden"
                    >
                        <div className="bg-gradient-to-br from-cyan-900/40 to-cyan-950/40 border-2 border-cyan-500/50 p-8 rounded-xl hover:border-cyan-400 transition-all">
                            <Grid3x3 className="w-16 h-16 mx-auto mb-4 text-cyan-400 group-hover:text-cyan-300" />
                            <h3 className="text-3xl font-bold text-cyan-400 mb-2">6×6</h3>
                            <p className="text-cyan-300 font-semibold mb-1">Strategic Extended Mode</p>
                            <p className="text-cyan-400/70 text-sm">36 cells • Strategic • Classic</p>
                        </div>
                    </motion.button>
                </div>
            </motion.div>
        </motion.div>
    );
};

export default ModeSelectionModal;
