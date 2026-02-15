import { useState, useEffect, useCallback, useRef } from 'react';
import { initializeBoard, addRandomTiles, getEmptyCells } from '../utils/tileGenerator';
import { moveTiles, hasMovesAvailable, hasWon } from '../utils/gameLogic';
import { DIRECTIONS, GAME_CONFIG } from '../constants/gameConfig';

/**
 * Custom hook for managing game state and logic
 */
export const useGameState = () => {
    const [board, setBoard] = useState(() => initializeBoard(GAME_CONFIG.INITIAL_TILES));
    const [score, setScore] = useState(0);
    const [gold, setGold] = useState(0);
    const [moves, setMoves] = useState(0);
    const [gameOver, setGameOver] = useState(false);
    const [victory, setVictory] = useState(false);
    const [floatingTexts, setFloatingTexts] = useState([]);

    const gridRef = useRef(null);
    const touchStartRef = useRef({ x: 0, y: 0 });

    /**
     * Handle tile movement in a direction
     */
    const handleMove = useCallback((direction) => {
        if (gameOver || victory) return;

        const result = moveTiles(board, direction);

        if (!result.moved) return; // No valid move

        // Update board
        let newBoard = result.newBoard;

        // Add new tiles after move
        const emptyCells = getEmptyCells(newBoard);
        if (emptyCells.length > 0) {
            newBoard = addRandomTiles(newBoard, GAME_CONFIG.TILES_PER_MOVE);
        }

        setBoard(newBoard);
        setScore(prev => prev + result.score);
        setGold(prev => prev + result.gold);
        setMoves(prev => prev + 1);

        // Add floating text for kills
        if (result.kills.length > 0) {
            const newFloatingTexts = result.kills.map(kill => ({
                id: crypto.randomUUID(),
                text: `+${kill.gold} Gold`,
                position: kill.position,
                timestamp: Date.now(),
            }));
            setFloatingTexts(prev => [...prev, ...newFloatingTexts]);

            // Trigger screen shake
            if (gridRef.current) {
                gridRef.current.classList.add('animate-shake');
                setTimeout(() => {
                    gridRef.current?.classList.remove('animate-shake');
                }, 500);
            }
        }

        // Check win condition
        if (hasWon(newBoard)) {
            setVictory(true);
            return;
        }

        // Check lose condition
        if (!hasMovesAvailable(newBoard)) {
            setGameOver(true);
        }
    }, [board, gameOver, victory]);

    /**
     * Handle keyboard input
     */
    const handleKeyDown = useCallback((e) => {
        if (gameOver || victory) return;

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
    }, [handleMove, gameOver, victory]);

    /**
     * Handle touch start
     */
    const handleTouchStart = useCallback((e) => {
        touchStartRef.current = {
            x: e.touches[0].clientX,
            y: e.touches[0].clientY,
        };
    }, []);

    /**
     * Handle touch end (swipe detection)
     */
    const handleTouchEnd = useCallback((e) => {
        if (gameOver || victory) return;

        const touchEnd = {
            x: e.changedTouches[0].clientX,
            y: e.changedTouches[0].clientY,
        };

        const deltaX = touchEnd.x - touchStartRef.current.x;
        const deltaY = touchEnd.y - touchStartRef.current.y;
        const minSwipeDistance = 50;

        if (Math.abs(deltaX) < minSwipeDistance && Math.abs(deltaY) < minSwipeDistance) {
            return; // Not a swipe
        }

        if (Math.abs(deltaX) > Math.abs(deltaY)) {
            // Horizontal swipe
            handleMove(deltaX > 0 ? DIRECTIONS.RIGHT : DIRECTIONS.LEFT);
        } else {
            // Vertical swipe
            handleMove(deltaY > 0 ? DIRECTIONS.DOWN : DIRECTIONS.UP);
        }
    }, [handleMove, gameOver, victory]);

    /**
     * Reset game
     */
    const resetGame = useCallback(() => {
        setBoard(initializeBoard(GAME_CONFIG.INITIAL_TILES));
        setScore(0);
        setGold(0);
        setMoves(0);
        setGameOver(false);
        setVictory(false);
        setFloatingTexts([]);
    }, []);

    /**
     * Clean up old floating texts
     */
    useEffect(() => {
        const interval = setInterval(() => {
            setFloatingTexts(prev =>
                prev.filter(text => Date.now() - text.timestamp < 1000)
            );
        }, 100);

        return () => clearInterval(interval);
    }, []);

    /**
     * Add keyboard event listener
     */
    useEffect(() => {
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [handleKeyDown]);

    return {
        board,
        score,
        gold,
        moves,
        gameOver,
        victory,
        floatingTexts,
        gridRef,
        handleTouchStart,
        handleTouchEnd,
        resetGame,
    };
};
