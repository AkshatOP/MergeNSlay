import { TILE_TYPES } from '../constants/gameConfig';

/**
 * Generate a random level (1-3 for early game, weighted distribution)
 */
export const getRandomLevel = () => {
    const rand = Math.random();
    if (rand < 0.6) return 1; // 60% chance
    if (rand < 0.9) return 2; // 30% chance
    return 3; // 10% chance
};

/**
 * Generate a random item tile
 */
export const generateItemTile = () => ({
    id: crypto.randomUUID(),
    type: TILE_TYPES.ITEM,
    level: getRandomLevel(),
});

/**
 * Generate a random monster tile
 */
export const generateMonsterTile = () => ({
    id: crypto.randomUUID(),
    type: TILE_TYPES.MONSTER,
    level: getRandomLevel(),
});

/**
 * Generate an empty tile
 */
export const generateEmptyTile = () => ({
    id: crypto.randomUUID(),
    type: TILE_TYPES.EMPTY,
    level: 0,
});

/**
 * Get all empty cell indices from the board
 */
export const getEmptyCells = (board) => {
    return board
        .map((tile, index) => (tile.type === TILE_TYPES.EMPTY ? index : null))
        .filter((index) => index !== null);
};

/**
 * Add random tiles to the board (one item, one monster)
 */
export const addRandomTiles = (board, count = 2) => {
    const emptyCells = getEmptyCells(board);

    if (emptyCells.length === 0) return board;

    const newBoard = [...board];
    const tilesToAdd = Math.min(count, emptyCells.length);

    for (let i = 0; i < tilesToAdd; i++) {
        const randomIndex = Math.floor(Math.random() * emptyCells.length);
        const cellIndex = emptyCells.splice(randomIndex, 1)[0];

        // Alternate between item and monster
        newBoard[cellIndex] = i % 2 === 0 ? generateItemTile() : generateMonsterTile();
    }

    return newBoard;
};

/**
 * Initialize the game board with starting tiles
 * @param {number} initialTileCount - Number of tiles to spawn at start
 * @param {number} gridSize - Size of the grid (4 for 4×4, 6 for 6×6)
 */
export const initializeBoard = (initialTileCount = 4, gridSize = 6) => {
    const totalCells = gridSize * gridSize;
    const board = Array(totalCells)
        .fill(null)
        .map(() => generateEmptyTile());

    return addRandomTiles(board, initialTileCount);
};

