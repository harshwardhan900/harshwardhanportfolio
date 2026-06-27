import VideoSection from "@/components/VideoSection";
import { skillGroups } from "@/lib/skills";
import styles from "./About.module.css";

interface AboutProps {
  videoSrc: string;
}

export default function About({ videoSrc }: AboutProps) {
  return (
    <VideoSection
      id="about"
      videoSrc={videoSrc}
      eyebrow="About"
      heading="I build the work, then build the page it lives on."
      accent="blue"
      nextSectionId="contact"
    >
      <p className={styles.bioText}>
        I&apos;m Harsh Wardhan, an AI generalist working across cinematic
        ads, UGC content, and storytelling — and the frontend engineering
        to showcase it. I move between creative direction and code, using
        AI tools to speed up production without cutting corners on craft.
      </p>
      <p className={styles.bioText}>
        Most projects start as a brief, end as a finished film or a
        shipped site, and use whatever combination of AI, camera work,
        and frontend gets there fastest.
      </p>

      <div className={styles.skillsRow}>
        {skillGroups.map((group) => (
          <div key={group.label} className={styles.skillGroup}>
            <h3
              className={`${styles.skillGroupLabel} ${
                group.accent === "blue" ? styles.accentBlue : styles.accentAmber
              }`}
            >
              {group.label}
            </h3>
            <ul className={styles.skillList}>
              {group.skills.map((skill) => (
                <li key={skill} className={styles.skillItem}>
                  {skill}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </VideoSection>
  );
}
