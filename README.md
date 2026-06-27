# Harsh Wardhan — Cinematic Portfolio Hero

A fullscreen, sticky, cinematic video hero built with Next.js (App Router),
React, Three.js, GSAP, and CSS Modules. The hero uses your talking-head
video as both the sharp foreground subject and a blurred ambient
background layer, with a Three.js particle/bokeh field and warm/cool
gradient overlays layered on top for depth.

## Getting started

```bash
npm install
npm run dev
```

Open http://localhost:3000.

To build for production:

```bash
npm run build
npm start
```

## Project structure

```
app/
  layout.tsx          Root layout + metadata + font notes
  globals.css          Design tokens (colors, type, motion easing)
  page.tsx              Assembles hero + work + about + contact
  page.module.css       Layout wrapper for the fixed 3D background

lib/
  gsap.ts                Shared GSAP instance with ScrollTrigger registered
  projects.ts            Work section data — EDIT titles/descriptions here
  skills.ts               About section skill groups — EDIT here

components/VideoIntro/
  VideoIntro.tsx         Main hero component: video, controls, GSAP timeline
  VideoIntro.module.css  All hero styling (layers, gradients, controls, type)
  CinematicLayer.tsx     Three.js particle/bokeh layer (its own lifecycle)
  icons.tsx              Inline SVG icons (play/pause/mute/unmute)
  index.ts               Barrel export

components/FloatingObjectsBackground/
  FloatingObjectsBackground.tsx   Ambient Three.js layer behind Work/About/Contact

components/Work/
  Work.tsx / Work.module.css      Project grid with category + Instagram links

components/About/
  About.tsx / About.module.css    Bio + grouped skill tags

components/Contact/
  Contact.tsx / Contact.module.css  Email + social CTA, closing section

public/video/
  hero.mp4               Your uploaded talking-head video
```

## Editing your Work section

Open `lib/projects.ts` — each project has a `title`, `description`,
`category`, and `link` (currently pointing at your real Instagram posts).
Edit the placeholder titles/descriptions to your own copy whenever you're
ready; no other file needs to change.

## Editing About / Skills

Open `components/About/About.tsx` for the bio paragraphs, and
`lib/skills.ts` for the skill tag groups.

## Editing Contact

Open `app/page.tsx` and update the `email`, `instagramHandle`, and
`instagramUrl` props passed to `<Contact />`.

## Customizing the hero content

Edit the props passed to `<VideoIntro />` in `app/page.tsx`:

```tsx
<VideoIntro
  tagline="AI Generalist / Builder"
  firstName="Harsh"
  lastName="Wardhan"
  role="AI Generalist"
  description="I design and build at the intersection of..."
  videoSrc="/video/hero.mp4"
  nextSectionId="work"
/>
```

## Fonts

This environment couldn't reach Google Fonts at build time, so the project
ships with a careful system-font fallback stack (`-apple-system`, `SF Pro`,
`Segoe UI`, etc.) defined in `app/globals.css`. On your own machine, with
normal internet access, you can restore the originally-intended **Inter
Tight** (display) + **Inter** (body) pairing — instructions are in a
comment block at the top of `app/layout.tsx`. The CSS variable names
(`--font-display`, `--font-body`) already match, so it's a drop-in swap.

## Design notes

The palette is pulled directly from the two practical light sources
already in your footage — a warm amber desk-lamp glow and a cool blue
monitor glow. Those two colors drive the particle field (roughly 60% warm
/ 40% cool), the gradient color wash, the divider line next to the
subtitle, and the gradient text on your last name. Nothing here is a
generic "purple gradient" default — every color choice ties back to your
actual video.

The name is set big and stacked, anchored bottom-left like a film credit
rather than dead-center, so it reads as a title card over the footage
rather than a generic hero banner.

## Performance notes

- The Three.js layer pauses its render loop via `IntersectionObserver`
  when the hero scrolls out of view, and disposes all GPU resources
  (geometry, material, texture, renderer) on unmount.
- Particle count automatically drops on narrow viewports (mobile).
- The foreground video fades in only once it can play through, avoiding a
  flash of an unstyled `<video>` element.
- `prefers-reduced-motion` is respected — entrance animation and looping
  micro-animations (sound badge pulse, scroll pulse) are disabled.

## Replacing the video

Swap `public/video/hero.mp4` for a different file (same filename) or pass
a different path via the `videoSrc` prop. Keep it reasonably compressed —
this one is a 10s 1280×720 H.264 clip at ~2.5MB, which is a good target
for a hero background.
