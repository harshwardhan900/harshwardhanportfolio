export interface SkillGroup {
  label: string;
  accent: "amber" | "blue";
  skills: string[];
}

/**
 * EDIT ME — adjust these groups/skills to match your actual toolkit.
 */
export const skillGroups: SkillGroup[] = [
  {
    label: "AI",
    accent: "amber",
    skills: [
      "AI Workflows & Agents",
      "Prompt Engineering",
      "AI Avatar / Video Generation",
      "Automation Pipelines",
    ],
  },
  {
    label: "Creative & Video",
    accent: "blue",
    skills: [
      "Cinematic Ad Direction",
      "UGC Content Production",
      "Storytelling & Scripting",
      "Editing & Color",
    ],
  },
  {
    label: "Build",
    accent: "amber",
    skills: ["Next.js & React", "Three.js / 3D Web", "GSAP Animation", "Web Design"],
  },
];
