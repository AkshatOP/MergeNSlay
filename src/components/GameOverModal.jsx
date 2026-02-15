import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trophy, Skull, RotateCcw } from 'lucide-react';
import { modalVariants } from '../utils/animations';


const GameOverModal = ({ isOpen, victory, score, gold, moves, onRestart }) => {
    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                >
                    <motion.div
                        variants={modalVariants}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        className="bg-slate-900 border-2 border-slate-700 rounded-2xl p-8 max-w-md w-full text-center"
                    >
                        {/* Icon */}
                        <div className="mb-6">
                            {victory ? (
                                <Trophy className="w-20 h-20 mx-auto text-yellow-400 animate-pulse" />
                            ) : (
                                <Skull className="w-20 h-20 mx-auto text-red-400 animate-pulse" />
                            )}
                        </div>

                        {/* Title */}
                        <h2 className={`text-4xl font-bold mb-4 ${victory ? 'text-yellow-400' : 'text-red-400'
                            }`}>
                            {victory ? 'Victory!' : 'Game Over'}
                        </h2>

                        {/* Message */}
                        <p className="text-slate-300 mb-6">
                            {victory
                                ? 'You have forged the legendary God-Killer!'
                                : 'No more moves available. The dungeon has defeated you.'}
                        </p>

                        {/* Stats */}
                        <div className="bg-slate-800/50 rounded-lg p-4 mb-6 space-y-2">
                            <div className="flex justify-between">
                                <span className="text-slate-400">Final Score:</span>
                                <span className="text-white font-bold">{score}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-slate-400">Gold Earned:</span>
                                <span className="text-yellow-400 font-bold">{gold}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-slate-400">Total Moves:</span>
                                <span className="text-cyan-400 font-bold">{moves}</span>
                            </div>
                        </div>

                        {/* Restart Button */}
                        <button
                            onClick={onRestart}
                            className="
                w-full bg-gradient-to-r from-cyan-600 to-blue-600 
                hover:from-cyan-500 hover:to-blue-500
                text-white font-bold py-3 px-6 rounded-lg
                flex items-center justify-center gap-2
                transition-all duration-300 transform hover:scale-105
              "
                        >
                            <RotateCcw className="w-5 h-5" />
                            Play Again
                        </button>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default GameOverModal;
