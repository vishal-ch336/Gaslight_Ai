# Figma Make Prompt

Paste the block below directly into Figma Make.

---

Design a dark-themed, cybersecurity-tool web app called "Prompt Injection Defense Simulator." Build 3 screens: Landing Page, Login/Signup, and Dashboard.

**Overall style:** Dark hacker/terminal aesthetic — near-black background (#0A0E14 style), monospace font (JetBrains Mono or similar) for terminal/code elements, a clean sans-serif (Inter) for UI chrome. Accent colors: neon red/orange for danger/compromised states, neon green/cyan for safe/neutral states. Subtle scanline or glow effects allowed but keep it usable, not gimmicky.

**Screen 1 — Landing Page**
- Full-height hero with a one-line headline: "Test your AI's defenses against real prompt injection attacks."
- Subheadline (1 sentence) and a primary CTA button "Get Started" leading to signup.
- Below the fold: 3 feature cards in a row — "Explainable X-Ray", "Configurable Defenses", "Local & Private" — each with an icon and 1-line description.
- Simple top nav with logo/wordmark and a "Log In" link.

**Screen 2 — Login / Signup**
- Centered card on dark background, app logo above it.
- Tabs or toggle at top of card: "Log In" / "Sign Up"
- Email field, password field, primary submit button
- Small link to switch between login/signup modes

**Screen 3 — Dashboard (core screen, most important)**
Three-zone layout — build as a left sidebar + center column + right column (adjust to a clean responsive layout, sidebar can collapse on smaller screens):

1. **Left sidebar — "Defense Control Panel"** (~280px fixed width)
   - Panel header: "Defense Control Panel"
   - 3 toggle rows, each with: toggle switch, label, small info (i) icon with tooltip on hover
     - Level 1: XML Enclosure
     - Level 2: Input Content Blacklist
     - Level 3: The Guardian / LLM Judge
   - Below toggles: a status chip showing "2/3 Defenses Active" style counter
   - "Reset to Level 0" secondary/ghost button at the bottom

2. **Center column — "Attack Terminal"**
   - Panel header: "Attack Terminal"
   - Dropdown labeled "Preset Attack Library" above the input
   - Large multi-line monospace textarea styled like a terminal (dark background, green/cyan text, blinking cursor feel)
   - Primary CTA button "Execute Attack" (bold, high-contrast, maybe red/orange accent to signal danger/action)
   - A processing state variant: button disabled, showing an animated "Analyzing prompt against active defenses…" label, not just a spinner
   - Below the input: a thin horizontal "Attack History" strip showing 3-4 small pill/chip items from past runs this session

3. **Right column (or full-width panel below) — "X-Ray Explainability Engine"**
   Design TWO states of this panel: empty/idle state (before any attack run) and populated state (after a run). For the populated state include:
   - **Status Banner** at the top: full-width, large bold text banner. Design two variants — a red/danger "⚠ SYSTEM COMPROMISED" banner and a green/success "✓ ATTACK NEUTRALIZED" banner. Make these visually loud — this is the emotional payoff of the screen.
   - **Live Prompt Compilation Map**: a vertically stacked series of styled "chips" or "blocks", each representing a prompt segment, color-coded by type — e.g. blue for "system", purple for "defense_wrapper", orange/red for "user_payload". Each block shows a small type label tag plus the segment text in monospace. This should be the most visually polished element on the screen.
   - **Leaked Data Highlight**: within the LLM response area, show a snippet of text with one substring highlighted with a red underline/background — labeled "LEAKED" with a small tag.
   - **Security Log**: a dark terminal-style scrolling console box showing lines prefixed with ✓ or ✗, monospace, colored green for pass and red for fail, ending in a bold "RESULT:" line.
   - **Attack Results Table**: a compact table below everything — columns: Attack Name, Defenses Active, Result (badge: Compromised/Blocked), Timestamp. Include 4-5 sample rows.

Add a "My History" tab accessible from the dashboard (same table layout, framed as a personal/persisted view).

Use consistent spacing, rounded-corner cards (8-12px radius), and subtle borders/glows to separate panels on the dark background. Prioritize the Status Banner and Prompt Compilation Map as the highest-polish elements on the page.

---

*Tip: If Figma Make's first pass under-emphasizes the Prompt Compilation Map or Status Banner, follow up with: "Make the Status Banner and Prompt Compilation Map more visually dominant — bigger, more color contrast, more motion/glow" to push it further.*
