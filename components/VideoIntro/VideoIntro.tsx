"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "@/lib/gsap";
import dynamic from "next/dynamic";
import styles from "./VideoIntro.module.css";
import { PlayIcon, PauseIcon, MuteIcon, UnmuteIcon } from "./icons";

const CinematicLayer = dynamic(() => import("./CinematicLayer"), {
  ssr: false,
});

interface VideoIntroProps {
  tagline: string;
  firstName: string;
  lastName: string;
  role: string;
  description: string;
  videoSrc: string;
  nextSectionId?: string;
}

export default function VideoIntro({
  tagline,
  firstName,
  lastName,
  role,
  description,
  videoSrc,
  nextSectionId = "work",
}: VideoIntroProps) {
  const fgVideoRef = useRef<HTMLVideoElement>(null);
  const bgVideoRef = useRef<HTMLVideoElement>(null);
  const heroRef = useRef<HTMLDivElement>(null);

  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(true);
  const [isReady, setIsReady] = useState(false);
  const [showSoundBadge, setShowSoundBadge] = useState(true);

  // --- Video readiness → fade in -----------------------------------------
  useEffect(() => {
    const video = fgVideoRef.current;
    if (!video) return;

    function handleCanPlay() {
      setIsReady(true);
    }
    video.addEventListener("canplaythrough", handleCanPlay);
    // Fallback in case canplaythrough never fires (e.g. slow network already cached)
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

  // --- Auto-hide sound badge -----------------------------------------------
  useEffect(() => {
    const timer = window.setTimeout(() => setShowSoundBadge(false), 4500);
    return () => window.clearTimeout(timer);
  }, []);

  // --- GSAP entrance animation --------------------------------------------
  useEffect(() => {
    if (!isReady) return;

    let ctx: ReturnType<typeof gsap.context> | undefined;
    try {
      ctx = gsap.context(() => {
        const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

        tl.to(`.${styles.tagline}`, { opacity: 1, duration: 0.8, delay: 0.2 })
          .to(
            `.${styles.nameLine} span`,
            {
              y: "0%",
              duration: 1.1,
              stagger: 0.12,
              ease: "power4.out",
            },
            "-=0.4"
          )
          .to(`.${styles.subtitleRow}`, { opacity: 1, duration: 0.9 }, "-=0.5")
          .to(`.${styles.controls}`, { opacity: 1, duration: 0.7 }, "-=0.6")
          .to(`.${styles.scrollIndicator}`, { opacity: 1, duration: 0.7 }, "-=0.6");
      }, heroRef);
    } catch (err) {
      console.warn("VideoIntro: GSAP entrance animation failed, content will still render statically.", err);
    }

    return () => ctx?.revert();
  }, [isReady]);

  // --- Controls --------------------------------------------------------------
  function togglePlay() {
    const fg = fgVideoRef.current;
    if (!fg) return;
    if (fg.paused) {
      fg.play();
      setIsPlaying(true);
    } else {
      fg.pause();
      setIsPlaying(false);
    }
  }

  function toggleMute() {
    const fg = fgVideoRef.current;
    if (!fg) return;
    fg.muted = !fg.muted;
    setIsMuted(fg.muted);
    setShowSoundBadge(false);
  }

  function handleScrollClick() {
    document.getElementById(nextSectionId)?.scrollIntoView({ behavior: "smooth" });
  }

  return (
    <section className={styles.hero} ref={heroRef}>
      {/* Ambient blurred background layer */}
      <div className={styles.bgVideoWrap}>
        <video
          ref={bgVideoRef}
          className={styles.bgVideo}
          src={videoSrc}
          muted
          loop
          playsInline
          autoPlay
          aria-hidden="true"
          tabIndex={-1}
        />
      </div>

      {/* Foreground subject video */}
      <div className={styles.fgVideoWrap}>
        <video
          ref={fgVideoRef}
          className={`${styles.fgVideo} ${isReady ? styles.ready : ""}`}
          src={videoSrc}
          muted={isMuted}
          loop
          playsInline
          autoPlay
          aria-label="Harsh Wardhan introduction video"
        />
      </div>

      {/* Cinematic Three.js particle layer */}
      <CinematicLayer className={styles.particleLayer} />

      {/* Legibility + mood gradients */}
      <div className={styles.gradientOverlay}>
        <div className={styles.gradientColorWash} />
        <div className={styles.gradientTop} />
        <div className={styles.gradientBottom} />
        <div className={styles.gradientVignette} />
      </div>

      {/* Content */}
      <div className={styles.content}>
        <p className={styles.tagline}>{tagline}</p>

        <div className={styles.nameBlock}>
          <h1 className={styles.nameLine}>
            <span>{firstName}</span>
          </h1>
          <h1 className={styles.nameLine}>
            <span>{lastName}</span>
          </h1>
        </div>

        <div className={styles.subtitleRow}>
          <div className={styles.subtitleDivider} />
          <p className={styles.subtitle}>
            <strong>{role}</strong> — {description}
          </p>
        </div>
      </div>

      {/* Sound hint badge */}
      <div
        className={`${styles.soundBadge} ${
          !showSoundBadge ? styles.soundBadgeHidden : ""
        }`}
      >
        <span className={styles.soundBadgeDot} />
        Tap for sound
      </div>

      {/* Controls */}
      <div className={styles.controls}>
        <button
          type="button"
          className={styles.controlBtn}
          onClick={togglePlay}
          aria-label={isPlaying ? "Pause video" : "Play video"}
        >
          {isPlaying ? <PauseIcon /> : <PlayIcon />}
        </button>
        <button
          type="button"
          className={styles.controlBtn}
          onClick={toggleMute}
          aria-label={isMuted ? "Unmute video" : "Mute video"}
        >
          {isMuted ? <MuteIcon /> : <UnmuteIcon />}
        </button>
      </div>

      {/* Scroll indicator */}
      <button
        type="button"
        className={styles.scrollIndicator}
        onClick={handleScrollClick}
        aria-label="Scroll to next section"
      >
        <span className={styles.scrollLabel}>Scroll</span>
        <span className={styles.scrollLine}>
          <span className={styles.scrollPulse} />
        </span>
      </button>
    </section>
  );
}
