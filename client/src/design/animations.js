/**
 * Shared Framer Motion variants for the Terminal Depth design system.
 * Import what you need: import { pageTransition, staggerContainer } from '../design/animations'
 */

// ─── Page transitions ──────────────────────────────────────────────────────

export const pageTransition = {
  initial:  { opacity: 0, y: 16 },
  animate:  { opacity: 1, y: 0 },
  exit:     { opacity: 0, y: -8 },
  transition: { duration: 0.28, ease: [0.22, 1, 0.36, 1] },
};

// ─── Stagger containers ────────────────────────────────────────────────────

export const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.06,
      delayChildren: 0.04,
    },
  },
};

export const staggerContainerFast = {
  animate: {
    transition: {
      staggerChildren: 0.04,
      delayChildren: 0.02,
    },
  },
};

// ─── Panel / card reveal ───────────────────────────────────────────────────

export const panelReveal = {
  initial:  { opacity: 0, y: 10 },
  animate:  { opacity: 1, y: 0, transition: { duration: 0.3, ease: [0.22, 1, 0.36, 1] } },
  exit:     { opacity: 0, y: 6,  transition: { duration: 0.18, ease: 'easeIn' } },
};

export const panelRevealLeft = {
  initial:  { opacity: 0, x: -12 },
  animate:  { opacity: 1, x: 0, transition: { duration: 0.3, ease: [0.22, 1, 0.36, 1] } },
  exit:     { opacity: 0, x: -8, transition: { duration: 0.18, ease: 'easeIn' } },
};

export const panelRevealScale = {
  initial:  { opacity: 0, scale: 0.96 },
  animate:  { opacity: 1, scale: 1, transition: { duration: 0.28, ease: [0.22, 1, 0.36, 1] } },
  exit:     { opacity: 0, scale: 0.97, transition: { duration: 0.16, ease: 'easeIn' } },
};

// ─── Hover / interaction states ────────────────────────────────────────────

export const hoverLift = {
  whileHover: { y: -2, transition: { duration: 0.15, ease: 'easeOut' } },
};

export const hoverScale = {
  whileHover: { scale: 1.02, transition: { duration: 0.15, ease: 'easeOut' } },
};

export const tapPress = {
  whileTap: { scale: 0.97, transition: { duration: 0.08 } },
};

// ─── Fade variants ─────────────────────────────────────────────────────────

export const fadeIn = {
  initial:  { opacity: 0 },
  animate:  { opacity: 1, transition: { duration: 0.35, ease: 'easeOut' } },
  exit:     { opacity: 0, transition: { duration: 0.2, ease: 'easeIn' } },
};

export const fadeUp = {
  initial:  { opacity: 0, y: 20 },
  animate:  { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] } },
  exit:     { opacity: 0, y: 10, transition: { duration: 0.2, ease: 'easeIn' } },
};

// ─── Slide expand (for collapsible panels) ─────────────────────────────────

export const slideDown = {
  initial:  { height: 0, opacity: 0 },
  animate:  { height: 'auto', opacity: 1, transition: { duration: 0.3, ease: [0.22, 1, 0.36, 1] } },
  exit:     { height: 0, opacity: 0, transition: { duration: 0.2, ease: 'easeIn' } },
};

// ─── Sidebar slide ─────────────────────────────────────────────────────────

export const sidebarDrawer = {
  initial:  { x: '-100%', opacity: 0 },
  animate:  { x: 0, opacity: 1, transition: { duration: 0.3, ease: [0.22, 1, 0.36, 1] } },
  exit:     { x: '-100%', opacity: 0, transition: { duration: 0.22, ease: 'easeIn' } },
};

// ─── Tooltip / popover ─────────────────────────────────────────────────────

export const tooltipReveal = {
  initial:  { opacity: 0, scale: 0.92, y: 4 },
  animate:  { opacity: 1, scale: 1, y: 0, transition: { duration: 0.14, ease: [0.22, 1, 0.36, 1] } },
  exit:     { opacity: 0, scale: 0.94, y: 3, transition: { duration: 0.1, ease: 'easeIn' } },
};

// ─── Chart / data animations ───────────────────────────────────────────────

export const chartEnter = {
  initial:  { opacity: 0, scaleY: 0.6 },
  animate:  { opacity: 1, scaleY: 1, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } },
};

// ─── Convenience spring config ────────────────────────────────────────────

export const spring = {
  soft:    { type: 'spring', stiffness: 300, damping: 30 },
  snappy:  { type: 'spring', stiffness: 500, damping: 40 },
  slow:    { type: 'spring', stiffness: 150, damping: 25 },
};

// ─── Combined preset for whileInView panels ───────────────────────────────

export const inViewReveal = {
  initial:    { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport:   { once: true, margin: '-60px' },
  transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] },
};
