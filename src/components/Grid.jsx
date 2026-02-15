import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Tile from './Tile';
import { GRID_SIZE } from '../constants/gameConfig';
import { floatingTextVariants } from '../utils/animations';

const Grid = ({ board, floatingTexts, gridRef, onTouchStart, onTouchEnd }) => {
    return (
        <div className="relative">
            <div
                ref={gridRef}
                onTouchStart={onTouchStart}
                onTouchEnd={onTouchEnd}
                className={`
          grid gap-2 sm:gap-3 p-3 sm:p-4 bg-slate-900/50 rounded-xl
          backdrop-blur-sm border-2 border-slate-700/50
        `}
                style={{
                    gridTemplateColumns: `repeat(${GRID_SIZE}, minmax(0, 1fr))`,
                    gridTemplateRows: `repeat(${GRID_SIZE}, minmax(0, 1fr))`,
                    width: 'min(90vw, 600px)',
                    height: 'min(90vw, 600px)',
                }}
            >
                <AnimatePresence mode="popLayout">
                    {board.map((tile, index) => (
                        <div key={tile.id} className="relative">
                            <Tile tile={tile} />
                        </div>
                    ))}
                </AnimatePresence>
            </div>

            {/* Floating Text Notifications */}
            <AnimatePresence>
                {floatingTexts.map((text) => {
                    const row = Math.floor(text.position / GRID_SIZE);
                    const col = text.position % GRID_SIZE;
                    const cellSize = 100 / GRID_SIZE;

                    return (
                        <motion.div
                            key={text.id}
                            variants={floatingTextVariants}
                            initial="initial"
                            animate="animate"
                            exit="exit"
                            className="absolute pointer-events-none text-yellow-400 font-bold text-xl sm:text-2xl"
                            style={{
                                left: `${col * cellSize + cellSize / 2}%`,
                                top: `${row * cellSize + cellSize / 2}%`,
                                transform: 'translate(-50%, -50%)',
                            }}
                        >
                            {text.text}
                        </motion.div>
                    );
                })}
            </AnimatePresence>
        </div>
    );
};

export default Grid;
