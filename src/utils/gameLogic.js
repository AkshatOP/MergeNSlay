import { TILE_TYPES, DIRECTIONS, calculateScore, calculateGold } from '../constants/gameConfig';

/**
 * Convert 1D array index to 2D coordinates
 */
const indexToCoords = (index, gridSize) => ({
    row: Math.floor(index / gridSize),
    col: index % gridSize,
});

/**
 * Convert 2D coordinates to 1D array index
 */
const coordsToIndex = (row, col, gridSize) => row * gridSize + col;

/**
 * Get the traversal order based on direction
 */
const getTraversalOrder = (direction, gridSize) => {
    const rows = Array.from({ length: gridSize }, (_, i) => i);
    const cols = Array.from({ length: gridSize }, (_, i) => i);

    if (direction === DIRECTIONS.DOWN) rows.reverse();
    if (direction === DIRECTIONS.RIGHT) cols.reverse();

    return { rows, cols };
};

/**
 * Get the next position in the given direction
 */
const getNextPosition = (row, col, direction) => {
    switch (direction) {
        case DIRECTIONS.UP:
            return { row: row - 1, col };
        case DIRECTIONS.DOWN:
            return { row: row + 1, col };
        case DIRECTIONS.LEFT:
            return { row, col: col - 1 };
        case DIRECTIONS.RIGHT:
            return { row, col: col + 1 };
        default:
            return { row, col };
    }
};

/**
 * Check if position is within grid bounds
 */
const isValidPosition = (row, col, gridSize) => {
    return row >= 0 && row < gridSize && col >= 0 && col < gridSize;
};

/**
 * Check if two items can merge (same type, same level, both items)
 */
const canMerge = (tile1, tile2) => {
    return (
        tile1.type === TILE_TYPES.ITEM &&
        tile2.type === TILE_TYPES.ITEM &&
        tile1.level === tile2.level
    );
};

/**
 * Check if an item can kill a monster (item level >= monster level)
 */
const canKillMonster = (itemTile, monsterTile) => {
    return (
        itemTile.type === TILE_TYPES.ITEM &&
        monsterTile.type === TILE_TYPES.MONSTER &&
        itemTile.level >= monsterTile.level
    );
};

/**
 * Move tiles in the specified direction
 * Returns: { newBoard, moved, score, gold, kills }
 */
export const moveTiles = (board, direction, gridSize) => {
    const newBoard = board.map(tile => ({ ...tile }));
    let moved = false;
    let scoreGained = 0;
    let goldGained = 0;
    const kills = []; // Array of { position, gold } for floating text

    const { rows, cols } = getTraversalOrder(direction, gridSize);
    const merged = Array(gridSize * gridSize).fill(false);

    // Traverse in the correct order based on direction
    rows.forEach((row) => {
        cols.forEach((col) => {
            const currentIndex = coordsToIndex(row, col, gridSize);
            const currentTile = newBoard[currentIndex];

            if (currentTile.type === TILE_TYPES.EMPTY) return;

            let { row: nextRow, col: nextCol } = { row, col };
            let farthestEmpty = null;

            // Find the farthest position this tile can move to
            while (true) {
                const next = getNextPosition(nextRow, nextCol, direction);

                if (!isValidPosition(next.row, next.col, gridSize)) break;

                const nextIndex = coordsToIndex(next.row, next.col, gridSize);
                const nextTile = newBoard[nextIndex];

                // Empty cell - can move here
                if (nextTile.type === TILE_TYPES.EMPTY) {
                    farthestEmpty = next;
                    nextRow = next.row;
                    nextCol = next.col;
                    continue;
                }

                // Check for merge (items only)
                if (canMerge(currentTile, nextTile) && !merged[nextIndex]) {
                    // Merge items
                    newBoard[nextIndex] = {
                        ...nextTile,
                        level: nextTile.level + 1,
                        id: crypto.randomUUID(), // New ID for animation
                    };
                    newBoard[currentIndex] = {
                        id: crypto.randomUUID(),
                        type: TILE_TYPES.EMPTY,
                        level: 0,
                    };
                    merged[nextIndex] = true;
                    moved = true;
                    scoreGained += calculateScore(nextTile.level + 1);
                    return;
                }

                // Check for combat (item vs monster)
                if (canKillMonster(currentTile, nextTile)) {
                    // Item kills monster
                    const gold = calculateGold(nextTile.level);
                    goldGained += gold;
                    scoreGained += calculateScore(currentTile.level);

                    kills.push({
                        position: coordsToIndex(next.row, next.col, gridSize),
                        gold,
                    });

                    newBoard[nextIndex] = { ...currentTile, id: crypto.randomUUID() };
                    newBoard[currentIndex] = {
                        id: crypto.randomUUID(),
                        type: TILE_TYPES.EMPTY,
                        level: 0,
                    };
                    moved = true;
                    return;
                }

                // Blocked by monster (item level < monster level) or another monster
                break;
            }

            // Move to farthest empty position
            if (farthestEmpty) {
                const farthestIndex = coordsToIndex(farthestEmpty.row, farthestEmpty.col, gridSize);
                newBoard[farthestIndex] = { ...currentTile, id: crypto.randomUUID() };
                newBoard[currentIndex] = {
                    id: crypto.randomUUID(),
                    type: TILE_TYPES.EMPTY,
                    level: 0,
                };
                moved = true;
            }
        });
    });

    return { newBoard, moved, score: scoreGained, gold: goldGained, kills };
};

/**
 * Check if any moves are available
 */
export const hasMovesAvailable = (board, gridSize) => {
    // Check all four directions
    for (const direction of Object.values(DIRECTIONS)) {
        const { moved } = moveTiles(board, direction, gridSize);
        if (moved) return true;
    }
    return false;
};

/**
 * Check if the player has won (has a level 5 item)
 */
export const hasWon = (board) => {
    return board.some(tile => tile.type === TILE_TYPES.ITEM && tile.level === 5);
};

