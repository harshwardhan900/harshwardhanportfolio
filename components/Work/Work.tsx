import VideoSection from "@/components/VideoSection";
import { projects } from "@/lib/projects";
import styles from "./Work.module.css";

const CATEGORY_ACCENT: Record<string, "amber" | "blue"> = {
  "Cinematic Ad": "amber",
  "UGC Ad": "blue",
  "Content Creation": "amber",
  "3D Website Build": "blue",
};

interface WorkProps {
  videoSrc: string;
}

export default function Work({ videoSrc }: WorkProps) {
  return (
    <VideoSection
      id="work"
      videoSrc={videoSrc}
      eyebrow="Selected Work"
      heading={
        <>
          Cinematic ads, UGC, content, and 3D builds —{" "}
          <span className={styles.headingAccent}>made to perform.</span>
        </>
      }
      accent="amber"
      nextSectionId="about"
    >
      <p className={styles.subheading}>
        A working sample of recent projects. Tap any card to view it on
        Instagram.
      </p>

      <div className={styles.grid}>
        {projects.map((project) => {
          const accent = CATEGORY_ACCENT[project.category] ?? "amber";
          return (
            <a
              key={project.id}
              href={project.link}
              target="_blank"
              rel="noopener noreferrer"
              className={`${styles.card} ${styles[`card_${accent}`]}`}
            >
              <div className={styles.cardTop}>
                <span className={styles.cardCategory}>{project.category}</span>
                <span className={styles.cardArrow} aria-hidden="true">
                  ↗
                </span>
              </div>
              <h3 className={styles.cardTitle}>{project.title}</h3>
              <p className={styles.cardDescription}>{project.description}</p>
              <span className={styles.cardLink}>View on Instagram</span>
            </a>
          );
        })}
      </div>
    </VideoSection>
  );
}
