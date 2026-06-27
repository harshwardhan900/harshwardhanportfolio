import VideoSection from "@/components/VideoSection";
import styles from "./Contact.module.css";

interface ContactProps {
  videoSrc: string;
  email: string;
  instagramHandle?: string;
  instagramUrl?: string;
}

export default function Contact({
  videoSrc,
  email,
  instagramHandle = "@yourhandle",
  instagramUrl = "https://instagram.com",
}: ContactProps) {
  return (
    <VideoSection
      id="contact"
      videoSrc={videoSrc}
      eyebrow="Let's work together"
      heading={
        <>
          Have a brief in mind?
          <br />
          <span className={styles.headingAccent}>Let&apos;s make it.</span>
        </>
      }
      accent="amber"
    >
      <a href={`mailto:${email}`} className={styles.emailLink}>
        {email}
      </a>

      <div className={styles.socials}>
        <a
          href={instagramUrl}
          target="_blank"
          rel="noopener noreferrer"
          className={styles.socialLink}
        >
          Instagram — {instagramHandle} ↗
        </a>
      </div>

      <p className={styles.footerNote}>
        © {new Date().getFullYear()} Harsh Wardhan. Built with Next.js,
        Three.js, and GSAP.
      </p>
    </VideoSection>
  );
}
