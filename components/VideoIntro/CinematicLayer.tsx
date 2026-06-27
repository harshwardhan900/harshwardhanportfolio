"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

interface CinematicLayerProps {
  className?: string;
}

/**
 * CinematicLayer
 * ----------------
 * A transparent, additive-blended particle field that echoes the two
 * practical light sources already present in the hero footage: a warm
 * amber lamp glow and a cool blue monitor glow. Particles drift slowly
 * on sine-wave paths and the camera gently parallaxes with the cursor,
 * producing a soft, dreamy, movie-intro atmosphere without ever
 * competing with the foreground subject.
 */
export default function CinematicLayer({ className }: CinematicLayerProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let width = container.clientWidth || window.innerWidth;
    let height = container.clientHeight || window.innerHeight;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(50, width / height, 0.1, 100);
    camera.position.z = 18;

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({
        alpha: true,
        antialias: true,
        powerPreference: "low-power",
      });
    } catch (err) {
      console.warn("CinematicLayer: WebGL unavailable, skipping particle layer.", err);
      return;
    }
    renderer.setClearColor(0x000000, 0);
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    renderer.setPixelRatio(dpr);
    renderer.setSize(width, height);
    container.appendChild(renderer.domElement);

    // --- Particle field -----------------------------------------------
    const PARTICLE_COUNT = window.innerWidth < 700 ? 70 : 150;

    const positions = new Float32Array(PARTICLE_COUNT * 3);
    const seeds = new Float32Array(PARTICLE_COUNT); // randomized phase per particle
    const speeds = new Float32Array(PARTICLE_COUNT);
    const sizes = new Float32Array(PARTICLE_COUNT);
    const colorAttr = new Float32Array(PARTICLE_COUNT * 3);

    const amber = new THREE.Color("#ff9a52");
    const blue = new THREE.Color("#6fa1ff");

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const i3 = i * 3;
      positions[i3] = (Math.random() - 0.5) * 26;
      positions[i3 + 1] = (Math.random() - 0.5) * 16;
      positions[i3 + 2] = (Math.random() - 0.5) * 14;

      seeds[i] = Math.random() * Math.PI * 2;
      speeds[i] = 0.15 + Math.random() * 0.25;
      sizes[i] = Math.random() * 1.6 + 0.6;

      // Bias roughly 60% warm amber, 40% cool blue — mirrors the footage's
      // lamp-vs-monitor lighting ratio.
      const mixed = Math.random() > 0.4 ? amber : blue;
      colorAttr[i3] = mixed.r;
      colorAttr[i3 + 1] = mixed.g;
      colorAttr[i3 + 2] = mixed.b;
    }

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute("color", new THREE.BufferAttribute(colorAttr, 3));
    geometry.setAttribute("size", new THREE.BufferAttribute(sizes, 1));

    // Soft circular sprite generated on a canvas — avoids loading an
    // external texture asset and gives a clean radial-gradient bokeh dot.
    const spriteCanvas = document.createElement("canvas");
    spriteCanvas.width = 64;
    spriteCanvas.height = 64;
    const ctx = spriteCanvas.getContext("2d")!;
    const gradient = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
    gradient.addColorStop(0, "rgba(255,255,255,1)");
    gradient.addColorStop(0.35, "rgba(255,255,255,0.55)");
    gradient.addColorStop(1, "rgba(255,255,255,0)");
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 64, 64);
    const sprite = new THREE.CanvasTexture(spriteCanvas);

    const material = new THREE.PointsMaterial({
      size: 0.9,
      map: sprite,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      vertexColors: true,
      sizeAttenuation: true,
      opacity: 0.85,
    });

    const points = new THREE.Points(geometry, material);
    scene.add(points);

    // --- Mouse parallax --------------------------------------------------
    const mouse = { x: 0, y: 0 };
    const targetCam = { x: 0, y: 0 };

    function handlePointerMove(e: PointerEvent) {
      mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
      mouse.y = (e.clientY / window.innerHeight) * 2 - 1;
    }
    window.addEventListener("pointermove", handlePointerMove, { passive: true });

    // --- Resize handling ---------------------------------------------------
    function handleResize() {
      if (!container) return;
      width = container.clientWidth;
      height = container.clientHeight;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    }
    window.addEventListener("resize", handleResize);

    // --- Animation loop ----------------------------------------------------
    let rafId = 0;
    let isVisible = true;
    const clock = new THREE.Clock();

    const observer = new IntersectionObserver(
      (entries) => {
        isVisible = entries[0]?.isIntersecting ?? true;
      },
      { threshold: 0.05 }
    );
    observer.observe(container);

    function animate() {
      rafId = requestAnimationFrame(animate);
      if (!isVisible) return;

      const t = clock.getElapsedTime();
      const posAttr = geometry.getAttribute("position") as THREE.BufferAttribute;

      for (let i = 0; i < PARTICLE_COUNT; i++) {
        const i3 = i * 3;
        const seed = seeds[i];
        const speed = speeds[i];
        // Slow sine-wave drift on x/y, gentle depth breathing on z
        posAttr.array[i3 + 1] += Math.sin(t * speed + seed) * 0.0009;
        posAttr.array[i3] += Math.cos(t * speed * 0.6 + seed) * 0.0007;
      }
      posAttr.needsUpdate = true;

      // Smooth camera parallax toward pointer position
      targetCam.x += (mouse.x * 1.1 - targetCam.x) * 0.02;
      targetCam.y += (-mouse.y * 0.7 - targetCam.y) * 0.02;
      camera.position.x = targetCam.x;
      camera.position.y = targetCam.y;
      camera.lookAt(0, 0, 0);

      renderer.render(scene, camera);
    }
    animate();

    // --- Cleanup -------------------------------------------------------------
    return () => {
      cancelAnimationFrame(rafId);
      observer.disconnect();
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("resize", handleResize);
      geometry.dispose();
      material.dispose();
      sprite.dispose();
      renderer.dispose();
      if (renderer.domElement.parentElement === container) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  return <div ref={containerRef} className={className} aria-hidden="true" />;
}
