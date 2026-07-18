---
version: "alpha"
name: "Lumina - Couture Atelier"
description: "Lumina Couture Background Effect is designed for delivering a visual treatment or immersive background effect. Key features include atmospheric visuals, motion depth, and flexible presentation layering. It is suitable for visual-first pages, motion studies, and atmospheric hero treatments."
colors:
  primary: "#C9A86A"
  secondary: "#A39E93"
  tertiary: "#AED16C"
  neutral: "#A39E93"
  background: "#C9A86A"
  surface: "#C9A86A"
  text-primary: "#C9A86A"
  text-secondary: "#A39E93"
  border: "#C9A86A"
  accent: "#C9A86A"
typography:
  display-lg:
    fontFamily: "Cormorant Garamond"
    fontSize: "96px"
    fontWeight: 300
    lineHeight: "100.8px"
    letterSpacing: "-0.025em"
  body-md:
    fontFamily: "Inter"
    fontSize: "12px"
    fontWeight: 300
    lineHeight: "16px"
    letterSpacing: "0.3em"
    textTransform: "uppercase"
  label-md:
    fontFamily: "Inter"
    fontSize: "12px"
    fontWeight: 300
    lineHeight: "16px"
    letterSpacing: "3.6px"
    textTransform: "uppercase"
rounded:
  md: "2px"
spacing:
  base: "4.8px"
  sm: "4.8px"
  md: "8px"
  lg: "10px"
  xl: "12px"
  gap: "12px"
  section-padding: "45px"
components:
  button-secondary:
    textColor: "{colors.primary}"
    typography: "{typography.label-md}"
    rounded: "{rounded.md}"
    padding: "12px"
  button-link:
    textColor: "{colors.secondary}"
    typography: "{typography.label-md}"
    rounded: "0px"
    padding: "0px"
---

## Overview

- **Composition cues:**
  - Layout: Flex
  - Content Width: Bounded
  - Framing: Framed
  - Grid: Minimal

## Colors

The color system uses light mode with #C9A86A as the main accent and #A39E93 as the neutral foundation.

- **Primary (#C9A86A):** Main accent and emphasis color.
- **Secondary (#A39E93):** Supporting accent for secondary emphasis.
- **Tertiary (#AED16C):** Reserved accent for supporting contrast moments.
- **Neutral (#A39E93):** Neutral foundation for backgrounds, surfaces, and supporting chrome.

- **Usage:** Background: #C9A86A; Surface: #C9A86A; Text Primary: #C9A86A; Text Secondary: #A39E93; Border: #C9A86A; Accent: #C9A86A

## Typography

Typography pairs Cormorant Garamond for display hierarchy with Inter for supporting content and interface copy.

- **Display (`display-lg`):** Cormorant Garamond, 96px, weight 300, line-height 100.8px, letter-spacing -0.025em.
- **Body (`body-md`):** Inter, 12px, weight 300, line-height 16px, letter-spacing 0.3em, uppercase.
- **Labels (`label-md`):** Inter, 12px, weight 300, line-height 16px, letter-spacing 3.6px, uppercase.

## Layout

Layout follows a flex composition with reusable spacing tokens. Preserve the flex, bounded structural frame before changing ornament or component styling. Use 4.8px as the base rhythm and let larger gaps step up from that cadence instead of introducing unrelated spacing values.

Treat the page as a flex / bounded composition, and keep that framing stable when adding or remixing sections.

- **Layout type:** Flex
- **Content width:** Bounded
- **Base unit:** 4.8px
- **Scale:** 4.8px, 8px, 10px, 12px, 16px, 20px, 24px, 32px
- **Section padding:** 45px
- **Gaps:** 12px, 16px, 24px, 40px

## Elevation & Depth

Depth is communicated through outlined, border contrast, and reusable shadow or blur treatments. Keep those recipes consistent across hero panels, cards, and controls so the page reads as one material system.

Surfaces should read as outlined first, with borders, shadows, and blur only reinforcing that material choice.

- **Surface style:** Outlined
- **Borders:** 0.8px #C9A86A

### Techniques
- **Gradient border shell:** Use a thin gradient border shell around the main card. Wrap the surface in an outer shell with 0px padding and a 0px radius. Drive the shell with radial-gradient(circle, rgba(201, 168, 106, 0.25) 0.5px, rgba(0, 0, 0, 0) 0.5px) so the edge reads like premium depth instead of a flat stroke. Keep the actual stroke understated so the gradient shell remains the hero edge treatment. Inset the real content surface inside the wrapper with a slightly smaller radius so the gradient only appears as a hairline frame.

## Shapes

Shapes rely on a tight radius system anchored by 2px and scaled across cards, buttons, and supporting surfaces. Icon geometry should stay compatible with that soft-to-controlled silhouette.

Use the radius family intentionally: larger surfaces can open up, but controls and badges should stay within the same rounded DNA instead of inventing sharper or pill-only exceptions.

- **Corner radii:** 2px, 9999px
- **Icon treatment:** Linear
- **Icon sets:** Solar

## Components

Anchor interactions to the detected button styles.

### Buttons
- **Secondary:** text #C9A86A, radius 2px, padding 12px, border 0.8px solid rgba(201, 168, 106, 0.3).
- **Links:** text #A39E93, radius 0px, padding 0px, border 0px solid rgb(229, 231, 235).

### Iconography
- **Treatment:** Linear.
- **Sets:** Solar.

## Do's and Don'ts

Use these constraints to keep future generations aligned with the current system instead of drifting into adjacent styles.

### Do
- Do use the primary palette as the main accent for emphasis and action states.
- Do keep spacing aligned to the detected 4.8px rhythm.
- Do reuse the Outlined surface treatment consistently across cards and controls.
- Do keep corner radii within the detected 2px, 9999px family.

### Don't
- Don't introduce extra accent colors outside the core palette roles unless the page needs a new semantic state.
- Don't exceed the detected moderate motion intensity without a deliberate reason.

## Motion

Motion feels controlled and interface-led across text, layout, and section transitions. Timing clusters around 150ms. Easing favors ease and cubic-bezier(0. Hover behavior focuses on text and color changes.

**Motion Level:** moderate

**Durations:** 150ms

**Easings:** ease, cubic-bezier(0, 0, 0.2, 1)

**Hover Patterns:** text, color, stroke

## WebGL

Reconstruct the graphics as a ambient background using alpha, dpr clamp, custom shaders. The effect should read as technical, meditative, and atmospheric: fine line lattice with black and sparse spacing. Build it from line trails + sparse anchors so the effect reads clearly. Animate it as slow breathing pulse. Interaction can react to the pointer, but only as a subtle drift. Preserve dom fallback.

**Id:** webgl

**Label:** WebGL

**Stack:** WebGL

**Insights:**
  - **Scene:**
    - **Value:** Ambient background
  - **Effect:**
    - **Value:** Fine line lattice
  - **Primitives:**
    - **Value:** Line trails + sparse anchors
  - **Motion:**
    - **Value:** Slow breathing pulse
  - **Interaction:**
    - **Value:** Pointer-reactive drift
  - **Render:**
    - **Value:** alpha, DPR clamp, custom shaders

**Techniques:** Perspective grid, Line lattice, Breathing pulse, Pointer parallax, Shader gradients

**Code Evidence:**
  - **JS reference:**
    - **Language:** js
    - **Snippet:**
      ```
      import { Renderer, Program, Mesh, Triangle } from 'https://esm.sh/ogl@1.0.11';
      import gsap from 'https://esm.sh/gsap@3.12.5';

      // --- Motion: Slow elegant fades and reveals ---
      document.addEventListener('DOMContentLoaded', () => {
          const tl = gsap.timeline({ defaults: { ease: "power2.out" } });
      ```
