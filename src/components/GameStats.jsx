import React from 'react';
import { Trophy, Coins, Move } from 'lucide-react';


const GameStats = ({ score, gold, moves }) => {
    return (
        <div className="flex flex-wrap gap-4 justify-center mb-6">
            <div className="flex items-center gap-2 bg-slate-800/50 px-4 py-2 rounded-lg border border-slate-700/50">
                <Trophy className="w-5 h-5 text-yellow-400" />
                <div>
                    <p className="text-xs text-slate-400">Score</p>
                    <p className="text-lg font-bold text-white">{score}</p>
                </div>
            </div>

            <div className="flex items-center gap-2 bg-slate-800/50 px-4 py-2 rounded-lg border border-slate-700/50">
                <Coins className="w-5 h-5 text-yellow-400" />
                <div>
                    <p className="text-xs text-slate-400">Gold</p>
                    <p className="text-lg font-bold text-white">{gold}</p>
                </div>
            </div>

            <div className="flex items-center gap-2 bg-slate-800/50 px-4 py-2 rounded-lg border border-slate-700/50">
                <Move className="w-5 h-5 text-cyan-400" />
                <div>
                    <p className="text-xs text-slate-400">Moves</p>
                    <p className="text-lg font-bold text-white">{moves}</p>
                </div>
            </div>
        </div>
    );
};

export default GameStats;
