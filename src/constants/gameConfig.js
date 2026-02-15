import {
    Sword, Wand2, Axe, Zap, Crown,
    Ghost, Skull, Dog, Flame
} from 'lucide-react';
/**
 * If you want any changes you can go ahead and edit below!
 */


/**
 * TILE TYPES
 */
export const TILE_TYPES = {
    EMPTY: 'empty',
    ITEM: 'item',
    MONSTER: 'monster',
};

/**
 * GAME CONFIGURATION
 */
export const GAME_CONFIG = {
    INITIAL_TILES: 4, // Number of tiles to spawn at game start
    TILES_PER_MOVE: 2, // Number of tiles to spawn after each move
    WIN_LEVEL: 5, // Reach level 5 to win
    GOLD_PER_KILL: 10, // Base gold earned per monster kill
    SCORE_MULTIPLIER: 100, // Score = level * multiplier
};

/**
 * ITEM DEFINITIONS
 * Items can merge with same-level items to create higher-level items
 */
export const ITEMS = {
    1: { name: 'Rusty Dagger', icon: Sword, color: 'cyan' },
    2: { name: 'Steel Blade', icon: Wand2, color: 'cyan' },
    3: { name: 'Mythic Axe', icon: Axe, color: 'cyan' },
    4: { name: 'Dragon Slayer', icon: Zap, color: 'cyan' },
    5: { name: 'God-Killer', icon: Crown, color: 'cyan' },
};

/**
 * MONSTER DEFINITIONS
 * Monsters do NOT merge. They can only be killed by items of equal or higher level.
 */
export const MONSTERS = {
    1: { name: 'Green Slime', icon: Ghost, color: 'red' },
    2: { name: 'Undead Guard', icon: Skull, color: 'red' },
    3: { name: 'Shadow Beast', icon: Dog, color: 'red' },
    4: { name: 'Fire Drake', icon: Flame, color: 'red' },
    5: { name: 'Arch-Demon', icon: Skull, color: 'purple' },
};

/**
 * MOVEMENT DIRECTIONS
 */
export const DIRECTIONS = {
    UP: 'up',
    DOWN: 'down',
    LEFT: 'left',
    RIGHT: 'right',
};

/**
 * Get item or monster data by level
 */
export const getItemData = (level) => ITEMS[level] || ITEMS[1];
export const getMonsterData = (level) => MONSTERS[level] || MONSTERS[1];

/**
 * Calculate score for a given level
 */
export const calculateScore = (level) => level * GAME_CONFIG.SCORE_MULTIPLIER;

/**
 * Calculate gold for killing a monster
 */
export const calculateGold = (monsterLevel) => GAME_CONFIG.GOLD_PER_KILL * monsterLevel;
