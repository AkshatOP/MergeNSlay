import React from 'react';
import { motion } from 'framer-motion';
import { TILE_TYPES, getItemData, getMonsterData } from '../constants/gameConfig';
import { tileVariants } from '../utils/animations';


const Tile = ({ tile }) => {
    if (tile.type === TILE_TYPES.EMPTY) {
        return <div className="w-full h-full bg-slate-800/30 rounded-lg" />;
    }

    const isItem = tile.type === TILE_TYPES.ITEM;
    const data = isItem ? getItemData(tile.level) : getMonsterData(tile.level);
    const Icon = data.icon;

    return (
        <motion.div
            key={tile.id}
            layout
            variants={tileVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            className={`
        w-full h-full rounded-lg flex flex-col items-center justify-center gap-1
        ${isItem ? 'bg-cyan-900/40 shadow-item' : 'bg-red-900/40 shadow-monster'}
        ${!isItem ? 'animate-pulse-slow' : ''}
        border-2 ${isItem ? 'border-cyan-500/30' : 'border-red-500/30'}
        transition-all duration-300
      `}
        >
            <Icon
                className={`w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 ${isItem ? 'text-cyan-400' : 'text-red-400'
                    }`}
                strokeWidth={2}
            />
            <span className={`text-xs sm:text-sm font-bold ${isItem ? 'text-cyan-300' : 'text-red-300'
                }`}>
                Lv.{tile.level}
            </span>
            <span className={`text-[10px] sm:text-xs text-center px-1 ${isItem ? 'text-cyan-400/70' : 'text-red-400/70'
                }`}>
                {data.name}
            </span>
        </motion.div>
    );
};

export default Tile;
