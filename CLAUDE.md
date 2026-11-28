# Project CLAUDE.md

## Default Design & Engineering Workflow

For all projects in this context, follow this standard workflow using the installed skills:

### 1. Design Direction (Start Here)
- Use **`/frontend-design`** to establish visual identity, typography, palette, and layout principles
- Use **`/unslop`** to avoid generic "AI slop" aesthetics from the start
- Use **`/ui-ux-pro-max`** for comprehensive design system (50 styles, 97 palettes, 9 stacks)

### 2. Architecture & Component Patterns
- Use **`/composition-patterns`** for compound components and scalable React patterns
- Use **`/react-best-practices`** for performance rules (rendering, data fetching, bundle size)
- Use **`/shadcn-ui`** for accessible, styled component library integration

### 3. Animation & Motion
- Use **`/gsap-react`** for React-integrated GSAP animations (useGSAP hook, cleanup)
- Use **`/gsap-scrolltrigger`** for scroll-linked animations and pinning
- Use **`/gsap-timeline`** for complex animation sequencing
- Use **`/gsap-performance`** to ensure 60fps smooth animations

### 4. Quality Assurance & Audit
- Use **`/web-design-guidelines`** for 100+ rule interface audit (accessibility, UX)
- Use **`/design-review`** for UI/UX auditing
- Once installed: **`/impeccable critique`** for polish and anti-slop audit

### 5. Specialized Skills (Use When Relevant)
- **`/logo-design`** — Brand identity
- **`/design-tokens`** — Systematic design systems
- **`/information-architecture`** — Structural UX planning
- **`/react-native-skills`** — Mobile UI patterns
- **`/remotion`** — Programmatic video
- **`/stitch-loop`** — Design-to-code iteration

---

## Skill Invocation Rules

| Scenario | Primary Skill | Supporting Skills |
|----------|---------------|-------------------|
| New project / landing page | `/frontend-design` | `/unslop`, `/ui-ux-pro-max` |
| Dashboard / app UI | `/web-design-guidelines` | `/composition-patterns`, `/shadcn-ui` |
| Complex animations | `/gsap-react` + `/gsap-timeline` | `/gsap-scrolltrigger`, `/gsap-performance` |
| Code review / refactor | `/react-best-practices` | `/composition-patterns` |
| Accessibility audit | `/web-design-guidelines` | `/accesslint` (once installed) |
| Final polish | `/unslop` | `/impeccable critique` (once installed) |

---

## Project-Specific Configuration

### Preferred Stack
- **Framework**: React + TypeScript (Next.js preferred)
- **Styling**: Tailwind CSS + shadcn/ui
- **Animation**: GSAP (React integration via `/gsap-react`)
- **Components**: Compound patterns via `/composition-patterns`

### Design Principles (Enforced)
1. **No AI slop** — Avoid: purple gradients, glossy blobs, emoji labels, "✨" badges, uppercase tracked labels, pulsing elements
2. **Intentional typography** — One or two deliberate typefaces, clear scale, <80ch line lengths
3. **Meaningful motion** — Single orchestrated moment, respect `prefers-reduced-motion`
4. **Accessible by default** — WCAG 2.1 AA, visible focus states, semantic HTML
5. **Performance first** — Transforms over layout, `will-change`, batch animations

---

## Available Skills Reference

### Installed & Ready (20+)
- `unslop` — Anti-slop polish
- `frontend-design` — Anthropic's flagship design
- `ui-ux-pro-max` + 7 sub-skills (banner-design, brand, design, design-system, slides, ui-styling)
- `web-design-guidelines` — Vercel's 100+ rule audit
- `react-best-practices` — 57 rules, 8 categories
- `composition-patterns` — Compound components
- `shadcn-ui` — Component library
- `gsap-core` through `gsap-utils` (8 skills)
- `react-components`, `remotion`, `stitch-design`, `stitch-loop`
- `logo-design`, `design-tokens`, `design-review`, `design-flow`, `design-brief`
- `information-architecture`, `antigravity-design-expert`, `gravitas`

### To Install (Marketplace)
```bash
# Run these in terminal to add:
claude plugin marketplace add pbakaus/impeccable
claude plugin marketplace add accesslint/claude-marketplace
claude plugin marketplace add bencium/bencium-claude-code-design-skill
```

---

## Custom Slash Commands

See `.claude/commands/` for project-specific workflow commands.