/**
 * ANIMATION VARIANTS FOR FRAMER MOTION
 */

/**
 * Tile animation variants
 */
export const tileVariants = {
    initial: { scale: 0, opacity: 0 },
    animate: {
        scale: 1,
        opacity: 1,
        transition: { type: 'spring', stiffness: 300, damping: 20 }
    },
    exit: {
        scale: 0,
        opacity: 0,
        transition: { duration: 0.2 }
    },
};

/**
 * Floating text animation variants
 */
export const floatingTextVariants = {
    initial: { y: 0, opacity: 1 },
    animate: {
        y: -50,
        opacity: 0,
        transition: { duration: 1, ease: 'easeOut' }
    },
};

/**
 * Modal animation variants
 */
export const modalVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: {
        opacity: 1,
        scale: 1,
        transition: { type: 'spring', stiffness: 300, damping: 25 }
    },
    exit: {
        opacity: 0,
        scale: 0.8,
        transition: { duration: 0.2 }
    },
};

/**
 * Trigger screen shake effect
 */
export const triggerScreenShake = (elementRef) => {
    if (!elementRef.current) return;

    elementRef.current.classList.add('animate-shake');
    setTimeout(() => {
        elementRef.current?.classList.remove('animate-shake');
    }, 500);
};

/**
 * Create floating text notification
 */
export const createFloatingText = (text, position) => ({
    id: crypto.randomUUID(),
    text,
    x: position.x,
    y: position.y,
    timestamp: Date.now(),
});
