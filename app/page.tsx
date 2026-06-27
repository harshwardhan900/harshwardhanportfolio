import VideoIntro from "@/components/VideoIntro";
import Work from "@/components/Work";
import About from "@/components/About";
import Contact from "@/components/Contact";
import { SectionErrorBoundary } from "@/components/SectionErrorBoundary";

export default function Home() {
  return (
    <main>
      <SectionErrorBoundary label="Hero">
        <VideoIntro
          tagline="AI Generalist / Builder"
          firstName="Harsh"
          lastName="Wardhan"
          role="AI Generalist"
          description="I design and build at the intersection of artificial intelligence, cinematic storytelling, and modern frontend engineering."
          videoSrc="/video/hero.mp4"
          nextSectionId="work"
        />
      </SectionErrorBoundary>

      <SectionErrorBoundary label="Work">
        <Work videoSrc="/video/work.mp4" />
      </SectionErrorBoundary>

      <SectionErrorBoundary label="About">
        <About videoSrc="/video/about.mp4" />
      </SectionErrorBoundary>

      <SectionErrorBoundary label="Contact">
        <Contact
          videoSrc="/video/contact.mp4"
          email="harshpromtai@gmail.com"
          instagramHandle="@kreatiq.ai"
          instagramUrl="https://instagram.com/kreatiq.ai"
        />
      </SectionErrorBoundary>
    </main>
  );
}
