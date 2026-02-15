import React, { useState, useEffect, useRef, useCallback } from 'react';
import gsap from 'gsap';
import { motion, AnimatePresence } from 'framer-motion';
import { Swords, Info } from 'lucide-react';
import ConfettiExplosion from 'react-confetti-explosion';
import { TILE_TYPES, getItemData, getMonsterData, DIRECTIONS, GAME_CONFIG } from '../constants/gameConfig';
import GameStats from './GameStats';
import GameOverModal from './GameOverModal';
import ModeSelectionModal from './ModeSelectionModal';
import { initializeBoard, addRandomTiles, getEmptyCells } from '../utils/tileGenerator';
import { moveTiles, hasMovesAvailable, hasWon } from '../utils/gameLogic';


const SLIDE_DURATION = 0.25;
const SLIDE_EASE = 'power3.out';
const MONSTER_DISSOLVE_DURATION = 0.6;


const Tile = React.forwardRef(({ tile, isAttacking, isDying, isBursting, isWinning }, ref) => {
    if (tile.type === TILE_TYPES.EMPTY) {
        return <div className="w-full h-full bg-slate-800/30 rounded-lg" />;
    }

    const isItem = tile.type === TILE_TYPES.ITEM;
    const data = isItem ? getItemData(tile.level) : getMonsterData(tile.level);
    const Icon = data.icon;

    
    const attackVariant = isAttacking ? {
        scale: [1, 1.08, 1],
        transition: { duration: 0.25, times: [0, 0.5, 1] }
    } : {};

    const deathVariant = isDying ? {
        scale: [1, 1.3, 0],
        opacity: [1, 0.8, 0],
        filter: ['blur(0px)', 'blur(3px)', 'blur(10px)'],
        rotate: [0, 8, -15],
        transition: {
            duration: MONSTER_DISSOLVE_DURATION,
            times: [0, 0.3, 1],
            ease: [0.4, 0, 0.2, 1]
        }
    } : {};

    const burstVariant = isBursting ? {
        scale: [1, 1.15, 0.95, 1],
        rotate: [0, -3, 3, 0],
        transition: {
            duration: 0.4,
            times: [0, 0.3, 0.7, 1],
            ease: 'easeOut'
        }
    } : {};


    const victoryVariant = isWinning ? {
        scale: [1, 1.15, 1.05],
        boxShadow: [
            '0 0 20px rgba(34, 211, 238, 0.6)',
            '0 0 60px rgba(255, 255, 255, 1)',
            '0 0 40px rgba(34, 211, 238, 0.8)'
        ],
        transition: {
            duration: 0.8,
            times: [0, 0.5, 1],
            ease: 'easeInOut',
            repeat: Infinity,
            repeatType: 'reverse'
        }
    } : {};

    return (
        <motion.div
            ref={ref}
            initial={{ scale: 0, opacity: 0 }}
            animate={{
                scale: 1,
                opacity: 1,
                ...attackVariant,
                ...deathVariant,
                ...burstVariant,
                ...victoryVariant,
            }}
            exit={{
                scale: 0,
                opacity: 0,
                transition: { duration: 0.15 }
            }}
            transition={{ type: 'spring', stiffness: 400, damping: 30, mass: 0.5 }}
            className={`
        w-full h-full rounded-lg flex flex-col items-center justify-center gap-1
        ${isItem ? 'bg-cyan-900/40 shadow-item' : 'bg-red-900/40 shadow-monster'}
        ${!isItem ? 'animate-pulse-slow' : ''}
        border-2 ${isItem ? 'border-cyan-500/30' : 'border-red-500/30'}
        relative overflow-hidden
      `}
            style={{
                transformOrigin: 'center center',
            }}
        >
            
            {isWinning && (
                <>
                    <motion.div
                        className="absolute inset-0 rounded-lg border-4 border-white/60"
                        initial={{ scale: 0.8, opacity: 1 }}
                        animate={{ scale: 2, opacity: 0 }}
                        transition={{ duration: 1.2, ease: 'easeOut', repeat: Infinity }}
                    />
                    <motion.div
                        className="absolute inset-0 bg-white/10 rounded-lg"
                        initial={{ opacity: 0.3 }}
                        animate={{ opacity: 0.6 }}
                        transition={{ duration: 0.8, repeat: Infinity, repeatType: 'reverse' }}
                    />
                </>
            )}

            
            {isBursting && (
                <>
                    <motion.div
                        className="absolute inset-0 rounded-lg border-4 border-yellow-400/60"
                        initial={{ scale: 0.8, opacity: 1 }}
                        animate={{ scale: 1.5, opacity: 0 }}
                        transition={{ duration: 0.4, ease: 'easeOut' }}
                    />
                    <motion.div
                        className="absolute inset-0 bg-yellow-400/20 rounded-lg"
                        initial={{ opacity: 0.6 }}
                        animate={{ opacity: 0 }}
                        transition={{ duration: 0.3 }}
                    />
                </>
            )}

            <Icon
                className={`w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 ${isItem ? 'text-cyan-400' : 'text-red-400'
                    } relative z-10`}
                strokeWidth={2}
            />
            <span className={`text-xs sm:text-sm font-bold ${isItem ? 'text-cyan-300' : 'text-red-300'
                } relative z-10`}>
                Lv.{tile.level}
            </span>
            <span className={`text-[10px] sm:text-xs text-center px-1 ${isItem ? 'text-cyan-400/70' : 'text-red-400/70'
                } relative z-10`}>
                {data.name}
            </span>
        </motion.div>
    );
});


const CurvedGoldPopup = ({ text, position, delay = 0, gridSize }) => {
    const row = Math.floor(position / gridSize);
    const col = position % gridSize;
    const cellSize = 100 / gridSize;
    const curveX = (Math.random() - 0.5) * 30;

    return (
        <motion.div
            initial={{
                x: 0,
                y: 0,
                scale: 0.5,
                opacity: 0,
            }}
            animate={{
                x: [0, curveX, curveX * 0.5],
                y: [0, -60, -100],
                scale: [0.5, 1.2, 1],
                opacity: [0, 1, 0],
            }}
            transition={{
                duration: 1.2,
                delay,
                times: [0, 0.3, 1],
                ease: [0.34, 1.56, 0.64, 1],
            }}
            className="absolute pointer-events-none text-yellow-400 font-bold text-xl sm:text-2xl drop-shadow-lg"
            style={{
                left: `${col * cellSize + cellSize / 2}%`,
                top: `${row * cellSize + cellSize / 2}%`,
                transform: 'translate(-50%, -50%)',
                textShadow: '0 0 10px rgba(250, 204, 21, 0.8)',
            }}
        >
            {text}
        </motion.div>
    );
};


const Game = () => {

    const [gridSize, setGridSize] = useState(null);
    const [board, setBoard] = useState([]);
    const [score, setScore] = useState(0);
    const [gold, setGold] = useState(0);
    const [moves, setMoves] = useState(0);
    const [gameOver, setGameOver] = useState(false);
    const [floatingTexts, setFloatingTexts] = useState([]);
    const [isAnimating, setIsAnimating] = useState(false);

    // Victory phase state machine
    const [victoryPhase, setVictoryPhase] = useState(null); // null | "highlight" | "celebrate" | "modal"
    const [winningTileId, setWinningTileId] = useState(null);

    // Combat animation state
    const [attackingTiles, setAttackingTiles] = useState(new Set());
    const [dyingTiles, setDyingTiles] = useState(new Set());
    const [burstingTiles, setBurstingTiles] = useState(new Set());

    // Refs
    const gridRef = useRef(null);
    const tileRefs = useRef(new Map());
    const touchStartRef = useRef({ x: 0, y: 0 });
    const cellSizeRef = useRef(100);
    const prevBoardRef = useRef(board);


    const handleModeSelect = (size) => {
        setGridSize(size);
        const initialTiles = size === 4 ? 2 : 4;
        setBoard(initializeBoard(initialTiles, size));
    };


    const getPixelPosition = useCallback((index) => {
        if (!gridSize) return { x: 0, y: 0 };
        const row = Math.floor(index / gridSize);
        const col = index % gridSize;
        return {
            x: col * cellSizeRef.current,
            y: row * cellSizeRef.current
        };
    }, [gridSize]);


    const findTileInBoard = useCallback((board, tileId) => {
        return board.findIndex(tile => tile.id === tileId);
    }, []);


    const handleMove = useCallback(async (direction) => {
        if (gameOver || victoryPhase !== null || isAnimating || !gridSize) return;

        const result = moveTiles(board, direction, gridSize);
        if (!result.moved) return;

        setIsAnimating(true);

        
        const timeline = gsap.timeline();

        board.forEach((tile, oldIndex) => {
            if (tile.type === TILE_TYPES.EMPTY) return;

            const newIndex = findTileInBoard(result.newBoard, tile.id);
            if (newIndex === -1 || newIndex === oldIndex) return;

            const oldPos = getPixelPosition(oldIndex);
            const newPos = getPixelPosition(newIndex);
            const deltaX = newPos.x - oldPos.x;
            const deltaY = newPos.y - oldPos.y;

            const tileEl = tileRefs.current.get(tile.id);
            if (tileEl) {
                timeline.to(tileEl, {
                    x: deltaX,
                    y: deltaY,
                    duration: SLIDE_DURATION,
                    ease: SLIDE_EASE,
                }, 0); 
            }
        });

        await timeline.then();

        let newBoard = result.newBoard;
        const emptyCells = getEmptyCells(newBoard);
        if (emptyCells.length > 0) {
            newBoard = addRandomTiles(newBoard, GAME_CONFIG.TILES_PER_MOVE);
        }

        setBoard(newBoard);
        setScore(prev => prev + result.score);
        setGold(prev => prev + result.gold);
        setMoves(prev => prev + 1);

        
        if (result.kills.length > 0) {
            const newFloatingTexts = result.kills.map(kill => ({
                id: crypto.randomUUID(),
                text: `+${kill.gold} Gold`,
                position: kill.position,
                timestamp: Date.now(),
            }));
            setFloatingTexts(prev => [...prev, ...newFloatingTexts]);
        }

        
        tileRefs.current.forEach(el => {
            if (el) gsap.set(el, { x: 0, y: 0 });
        });


        if (hasWon(newBoard)) {
            const winningTile = newBoard.find(tile => tile.type === TILE_TYPES.ITEM && tile.level === 5);
            if (winningTile) {
                setWinningTileId(winningTile.id);
                setVictoryPhase('highlight');
            }
        } else if (!hasMovesAvailable(newBoard, gridSize)) {
            setGameOver(true);
            setIsAnimating(false);
        } else {
            setIsAnimating(false);
        }
    }, [board, gameOver, victoryPhase, isAnimating, gridSize, getPixelPosition, findTileInBoard]);

    useEffect(() => {
        if (victoryPhase === 'highlight') {
            const timer = setTimeout(() => {
                setVictoryPhase('celebrate');
            }, 400);
            return () => clearTimeout(timer);
        }
    }, [victoryPhase]);

    useEffect(() => {
        if (victoryPhase === 'celebrate') {
            const timer = setTimeout(() => {
                setVictoryPhase('modal');
            }, 2200); // 2000ms confetti + 200ms buffer
            return () => clearTimeout(timer);
        }
    }, [victoryPhase]);


    useEffect(() => {
        if (!gridSize) return;

        const prevBoard = prevBoardRef.current;
        const newAttackers = new Set();
        const newDying = new Set();
        const newBursting = new Set();

        board.forEach((tile, index) => {
            const prevTile = prevBoard[index];

            if (
                prevTile &&
                prevTile.type === TILE_TYPES.MONSTER &&
                tile.type !== TILE_TYPES.MONSTER
            ) {
                newDying.add(prevTile.id);

                if (tile.type === TILE_TYPES.ITEM) {
                    newBursting.add(tile.id);
                }

                // Find attacking item
                const row = Math.floor(index / gridSize);
                const col = index % gridSize;
                const directions = [
                    { dr: -1, dc: 0 },
                    { dr: 1, dc: 0 },
                    { dr: 0, dc: -1 },
                    { dr: 0, dc: 1 },
                ];

                directions.forEach(({ dr, dc }) => {
                    const newRow = row + dr;
                    const newCol = col + dc;
                    if (newRow >= 0 && newRow < gridSize && newCol >= 0 && newCol < gridSize) {
                        const adjIndex = newRow * gridSize + newCol;
                        const adjTile = board[adjIndex];
                        if (adjTile && adjTile.type === TILE_TYPES.ITEM) {
                            newAttackers.add(adjTile.id);
                        }
                    }
                });
            }
        });

        if (newDying.size > 0) {
            setDyingTiles(newDying);
            setAttackingTiles(newAttackers);
            setBurstingTiles(newBursting);

            setTimeout(() => setAttackingTiles(new Set()), 250);
            setTimeout(() => setBurstingTiles(new Set()), 400);
            setTimeout(() => setDyingTiles(new Set()), MONSTER_DISSOLVE_DURATION * 1000);
        }

        prevBoardRef.current = board;
    }, [board, gridSize]);


    useEffect(() => {
        if (gridRef.current && gridSize) {
            const updateCellSize = () => {
                const gridWidth = gridRef.current.offsetWidth;
                const gap = 12; // 3 * 4px (gap-3)
                cellSizeRef.current = (gridWidth - gap * (gridSize - 1)) / gridSize;
            };

            updateCellSize();
            window.addEventListener('resize', updateCellSize);
            return () => window.removeEventListener('resize', updateCellSize);
        }
    }, [gridSize]);

    const handleKeyDown = useCallback((e) => {
        if (gameOver || victoryPhase !== null) return;

        const keyMap = {
            ArrowUp: DIRECTIONS.UP,
            ArrowDown: DIRECTIONS.DOWN,
            ArrowLeft: DIRECTIONS.LEFT,
            ArrowRight: DIRECTIONS.RIGHT,
            w: DIRECTIONS.UP,
            s: DIRECTIONS.DOWN,
            a: DIRECTIONS.LEFT,
            d: DIRECTIONS.RIGHT,
        };

        const direction = keyMap[e.key];
        if (direction) {
            e.preventDefault();
            handleMove(direction);
        }
    }, [handleMove, gameOver, victoryPhase]);


    const handleTouchStart = useCallback((e) => {
        touchStartRef.current = {
            x: e.touches[0].clientX,
            y: e.touches[0].clientY,
        };
    }, []);

    const handleTouchEnd = useCallback((e) => {
        if (gameOver || victoryPhase !== null) return;

        const touchEnd = {
            x: e.changedTouches[0].clientX,
            y: e.changedTouches[0].clientY,
        };

        const deltaX = touchEnd.x - touchStartRef.current.x;
        const deltaY = touchEnd.y - touchStartRef.current.y;
        const minSwipeDistance = 50;

        if (Math.abs(deltaX) < minSwipeDistance && Math.abs(deltaY) < minSwipeDistance) {
            return;
        }

        if (Math.abs(deltaX) > Math.abs(deltaY)) {
            handleMove(deltaX > 0 ? DIRECTIONS.RIGHT : DIRECTIONS.LEFT);
        } else {
            handleMove(deltaY > 0 ? DIRECTIONS.DOWN : DIRECTIONS.UP);
        }
    }, [handleMove, gameOver, victoryPhase]);


    const resetGame = useCallback(() => {
        setGridSize(null); // Return to mode selection
        setBoard([]);
        setScore(0);
        setGold(0);
        setMoves(0);
        setGameOver(false);
        setVictoryPhase(null);
        setWinningTileId(null);
        setFloatingTexts([]);
        setIsAnimating(false);
    }, []);


    useEffect(() => {
        const interval = setInterval(() => {
            setFloatingTexts(prev =>
                prev.filter(text => Date.now() - text.timestamp < 1000)
            );
        }, 100);

        return () => clearInterval(interval);
    }, []);


    useEffect(() => {
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [handleKeyDown]);

    // Show mode selection if no grid size chosen
    if (!gridSize) {
        return <ModeSelectionModal onSelectMode={handleModeSelect} />;
    }

    // Determine grid container size based on mode
    const gridContainerSize = gridSize === 4 ? 'min(90vw, 500px)' : 'min(90vw, 600px)';

    return (
        <div className="min-h-screen flex flex-col items-center justify-center p-4">
            {/* Header */}
            <motion.div
                className="text-center mb-8"
                initial={{ y: -50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ type: 'spring', stiffness: 300, damping: 25 }}
            >
                <div className="flex items-center justify-center gap-3 mb-2">
                    <Swords className="w-8 h-8 text-cyan-400" />
                    <h1 className="text-4xl sm:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">
                        Merge & Slay
                    </h1>
                    <Swords className="w-8 h-8 text-cyan-400" />
                </div>
                <p className="text-slate-400 text-sm sm:text-base">
                    {gridSize === 4 ? 'Hardcore Tactical Mode' : 'Strategic Extended Mode'} • {gridSize}×{gridSize} Grid
                </p>
            </motion.div>

            {/* Game Stats */}
            <GameStats score={score} gold={gold} moves={moves} />

            {/* Game Grid */}
            <div className="relative">
                <div
                    ref={gridRef}
                    onTouchStart={handleTouchStart}
                    onTouchEnd={handleTouchEnd}
                    className="grid gap-2 sm:gap-3 p-3 sm:p-4 bg-slate-900/50 rounded-xl backdrop-blur-sm border-2 border-slate-700/50 relative"
                    style={{
                        gridTemplateColumns: `repeat(${gridSize}, minmax(0, 1fr))`,
                        gridTemplateRows: `repeat(${gridSize}, minmax(0, 1fr))`,
                        width: gridContainerSize,
                        height: gridContainerSize,
                    }}
                >
                    <AnimatePresence mode="sync">
                        {board.map((tile, index) => (
                            <div
                                key={`cell-${index}`}
                                className="relative"
                                style={{
                                    opacity: victoryPhase && tile.id !== winningTileId ? 0.25 : 1,
                                    filter: victoryPhase && tile.id !== winningTileId ? 'blur(2px) saturate(0.5)' : 'none',
                                    transition: 'opacity 0.3s ease, filter 0.3s ease'
                                }}
                            >
                                <Tile
                                    ref={el => {
                                        if (el && tile.id) {
                                            tileRefs.current.set(tile.id, el);
                                        }
                                    }}
                                    tile={tile}
                                    isAttacking={attackingTiles.has(tile.id)}
                                    isDying={dyingTiles.has(tile.id)}
                                    isBursting={burstingTiles.has(tile.id)}
                                    isWinning={tile.id === winningTileId}
                                />
                            </div>
                        ))}
                    </AnimatePresence>
                </div>

                {/* Confetti Explosion */}
                {victoryPhase === 'celebrate' && (
                    <div className="absolute" style={{
                        left: '50%',
                        top: '50%',
                        transform: 'translate(-50%, -50%)',
                        zIndex: 50
                    }}>
                        <ConfettiExplosion
                            force={0.8}
                            duration={2000}
                            particleCount={150}
                            width={1600}
                            colors={['#22d3ee', '#3b82f6', '#8b5cf6', '#ec4899', '#f59e0b']}
                        />
                    </div>
                )}

                {/* Gold Popups */}
                <AnimatePresence>
                    {floatingTexts.map((text, index) => (
                        <CurvedGoldPopup
                            key={text.id}
                            text={text.text}
                            position={text.position}
                            delay={index * 0.05}
                            gridSize={gridSize}
                        />
                    ))}
                </AnimatePresence>
            </div>

            {/* Instructions */}
            <motion.div
                className="mt-6 bg-slate-800/50 rounded-lg p-4 max-w-md border border-slate-700/50"
                initial={{ y: 50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ type: 'spring', stiffness: 300, damping: 25, delay: 0.2 }}
            >
                <div className="flex items-start gap-2">
                    <Info className="w-5 h-5 text-cyan-400 flex-shrink-0 mt-0.5" />
                    <div className="text-sm text-slate-300 space-y-1">
                        <p><strong className="text-cyan-400">Controls:</strong> Arrow keys or WASD to move, swipe on mobile</p>
                        <p><strong className="text-cyan-400">Merge:</strong> Combine same-level items to upgrade</p>
                        <p><strong className="text-cyan-400">Combat:</strong> Items kill monsters if level ≥ monster level</p>
                        <p><strong className="text-cyan-400">Goal:</strong> Forge the God-Killer (Level 5 item)</p>
                    </div>
                </div>
            </motion.div>

            {/* Game Over Modal */}
            <GameOverModal
                isOpen={victoryPhase === 'modal' || gameOver}
                victory={victoryPhase === 'modal'}
                score={score}
                gold={gold}
                moves={moves}
                onRestart={resetGame}
            />
        </div>
    );
};

export default Game;
