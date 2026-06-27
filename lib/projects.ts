export interface Project {
  id: string;
  category: "Cinematic Ad" | "UGC Ad" | "Content Creation" | "3D Website Build";
  title: string;
  description: string;
  link: string;
}

/**
 * EDIT ME — swap these titles/descriptions for your own copy whenever
 * you're ready. The `link` fields point to the real Instagram posts you
 * shared; everything else here is a placeholder so the layout has real
 * content to render.
 */
export const projects: Project[] = [
  {
    id: "cinematic-ad",
    category: "Cinematic Ad",
    title: "Cinematic Product Film",
    description:
      "A moody, film-style ad built around dramatic lighting, slow pacing, and a clear emotional arc — produced end to end.",
    link: "https://www.instagram.com/p/DZ1ar1NN5ql/?hl=en",
  },
  {
    id: "storytelling",
    category: "Content Creation",
    title: "Brand Storytelling Piece",
    description:
      "A narrative-driven piece built to carry a brand's voice through story rather than a straight pitch.",
    link: "https://www.instagram.com/p/DZpqZFTt7AX/?hl=en",
  },
  {
    id: "ugc-shoot",
    category: "UGC Ad",
    title: "UGC Model Shoot",
    description:
      "A creator-style ad shot to feel native to the feed — casual delivery, real product use, built to convert.",
    link: "https://www.instagram.com/p/DZm8pIXygiZ/?hl=en",
  },
  {
    id: "content-piece",
    category: "Content Creation",
    title: "Short-Form Content Piece",
    description:
      "A short-form content piece built for reach and retention, edited for pacing across the first three seconds.",
    link: "https://www.instagram.com/p/DZcxq8mtupR/?hl=en",
  },
];
