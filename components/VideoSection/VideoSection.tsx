"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import dynamic from "next/dynamic";
import styles from "./VideoSection.module.css";

const CinematicLayer = dynamic(() => import("../VideoIntro/CinematicLayer"), {
  ssr: false,
});

interface VideoSectionProps {
  id: string;
  videoSrc: string;
  eyebrow: string;
  heading: ReactNode;
  /** Main body content for the section — paragraphs, cards, links, etc. */
  children: ReactNode;
  /** Tint applied to the gradient wash */
  accent?: "amber" | "blue";
  /** Optional next-section id for an in-page scroll link at the bottom */
  nextSectionId?: string;
  /** Show the cinematic particle layer (defaults to true) */
  showParticles?: boolean;
}

/**
 * VideoSection
 * -------------
 * A fullscreen, video-backed content section — the same visual language
 * as the hero (sharp foreground video + blurred ambient layer + gradient
 * overlays + Three.js particles) but reusable for any later section
 * (Work, About, Contact).
 *
 * Deliberately uses plain CSS transitions instead of GSAP/ScrollTrigger
 * for its entrance animation. Content has a visible default state from
 * the first frame, so even if a transition class never gets applied for
 * any reason, nothing stays permanently hidden.
 */
export default function VideoSection({
  id,
  videoSrc,
  eyebrow,
  heading,
  children,
  accent = "amber",
  nextSectionId,
  showParticles = true,
}: VideoSectionProps) {
  const fgVideoRef = useRef<HTMLVideoElement>(null);
  const bgVideoRef = useRef<HTMLVideoElement>(null);
  const sectionRef = useRef<HTMLElement>(null);

  const [isReady, setIsReady] = useState(false);
  const [isInView, setIsInView] = useState(false);

  // --- Video readiness → fade in -----------------------------------------
  useEffect(() => {
    const video = fgVideoRef.current;
    if (!video) return;

    function handleCanPlay() {
      setIsReady(true);
    }
    video.addEventListener("canplaythrough", handleCanPlay);
    const fallback = window.setTimeout(() => setIsReady(true), 1800);

    return () => {
      video.removeEventListener("canplaythrough", handleCanPlay);
      window.clearTimeout(fallback);
    };
  }, []);

  // --- Keep bg/fg videos in sync ------------------------------------------
  useEffect(() => {
    const fg = fgVideoRef.current;
    const bg = bgVideoRef.current;
    if (!fg || !bg) return;

    function syncPlay() {
      bg?.play().catch(() => {});
    }
    function syncPause() {
      bg?.pause();
    }
    fg.addEventListener("play", syncPlay);
    fg.addEventListener("pause", syncPause);
    return () => {
      fg.removeEventListener("play", syncPlay);
      fg.removeEventListener("pause", syncPause);
    };
  }, []);

  // --- Play/pause videos based on viewport visibility ----------------------
  // (Plain IntersectionObserver — no animation library, no scroll math
  // that could fail silently. Visibility of CONTENT never depends on this;
  // it only pauses/plays the <video> elements for performance.)
  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries[0]?.isIntersecting ?? false;
        setIsInView(visible);
        const fg = fgVideoRef.current;
        const bg = bgVideoRef.current;
        if (visible) {
          fg?.play().catch(() => {});
          bg?.play().catch(() => {});
        } else {
          fg?.pause();
          bg?.pause();
        }
      },
      { threshold: 0.15 }
    );
    observer.observe(section);
    return () => observer.disconnect();
  }, []);

  function handleScrollClick() {
    if (nextSectionId) {
      document.getElementById(nextSectionId)?.scrollIntoView({ behavior: "smooth" });
    }
  }

  return (
    <section id={id} className={styles.section} ref={sectionRef}>
      {/* Ambient blurred background layer */}
      <div className={styles.bgVideoWrap}>
        <video
          ref={bgVideoRef}
          className={styles.bgVideo}
          src={videoSrc}
          muted
          loop
          playsInline
          aria-hidden="true"
          tabIndex={-1}
        />
      </div>

      {/* Foreground video */}
      <div className={styles.fgVideoWrap}>
        <video
          ref={fgVideoRef}
          className={`${styles.fgVideo} ${isReady ? styles.ready : ""}`}
          src={videoSrc}
          muted
          loop
          playsInline
          aria-hidden="true"
          tabIndex={-1}
        />
      </div>

      {/* Cinematic particle layer — only mounted while in view, to avoid
          piling up multiple simultaneous WebGL contexts across sections */}
      {showParticles && isInView && (
        <CinematicLayer className={styles.particleLayer} />
      )}

      {/* Legibility + mood gradients */}
      <div className={styles.gradientOverlay}>
        <div
          className={`${styles.gradientColorWash} ${
            accent === "blue" ? styles.washBlue : styles.washAmber
          }`}
        />
        <div className={styles.gradientTop} />
        <div className={styles.gradientBottom} />
        <div className={styles.gradientVignette} />
      </div>

      {/* Content — visible by default, CSS-only entrance, no JS required */}
      <div className={styles.content}>
        <span className={styles.eyebrow}>{eyebrow}</span>
        <h2 className={styles.heading}>{heading}</h2>
        <div className={styles.body}>{children}</div>
      </div>

      {nextSectionId && (
        <button
          type="button"
          className={styles.scrollIndicator}
          onClick={handleScrollClick}
          aria-label="Scroll to next section"
        >
          <span className={styles.scrollLine}>
            <span className={styles.scrollPulse} />
          </span>
        </button>
      )}
    </section>
  );
}
