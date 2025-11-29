interface Skill {
  name: string;
  logo: string;
}

// Using devicons CDN - reliable and consistent
const di = (name: string, variant: string = "original") =>
  `https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/${name}/${name}-${variant}.svg`;

// Row 1 skills (moves left) - AI/Data + Backend (12 items)
export const skillsAIML: Skill[] = [
  { name: "Python", logo: di("python") },
  { name: "TensorFlow", logo: di("tensorflow") },
  { name: "PyTorch", logo: di("pytorch") },
  { name: "Rust", logo: di("rust") },
  { name: "FastAPI", logo: di("fastapi") },
  { name: "PostgreSQL", logo: di("postgresql") },
];

// Row 2 skills (moves right) - Frontend + DevOps (11 items)
export const skillsWebDev: Skill[] = [
  { name: "React", logo: di("react") },
  { name: "Next.js", logo: di("nextjs") },
  { name: "TypeScript", logo: di("typescript") },
  { name: "Tailwind", logo: di("tailwindcss") },
  { name: "Docker", logo: di("docker") },
  { name: "Vercel", logo: di("vercel") },
];

// Backend skills (for backward compatibility)
export const skillsBackend: Skill[] = [
  { name: "Rust", logo: di("rust") },
  { name: "FastAPI", logo: di("fastapi") },
  { name: "PostgreSQL", logo: di("postgresql") },
  { name: "MongoDB", logo: di("mongodb") },
  { name: "Supabase", logo: di("supabase") },
];

// DevOps skills (for backward compatibility)
export const skillsDevOps: Skill[] = [
  { name: "Docker", logo: di("docker") },
  { name: "Vercel", logo: di("vercel") },
  { name: "Cloudflare", logo: di("cloudflare") },
  { name: "GitHub Actions", logo: di("githubactions") },
  { name: "Linux", logo: di("linux") },
];

// Comprehensive tech stack categories for the cards section
export const techStackCategories = {
  aiLLM: {
    title: "AI & LLM",
    icon: "brain",
    skills: [
      "OpenAI",
      "Anthropic",
      "Gemini",
      "LangChain",
      "LlamaIndex",
      "Pinecone",
      "RAG",
      "Prompt Engineering",
    ],
    gradient: "from-violet-500 to-purple-600",
  },
  dataScience: {
    title: "Data Science",
    icon: "chart",
    skills: [
      "TensorFlow",
      "PyTorch",
      "Scikit-Learn",
      "XGBoost",
      "Pandas",
      "NumPy",
      "spaCy",
      "NLTK",
    ],
    gradient: "from-blue-500 to-cyan-500",
  },
  frontend: {
    title: "Frontend",
    icon: "layout",
    skills: [
      "React",
      "Next.js",
      "TypeScript",
      "Tailwind CSS",
      "ShadCN",
      "Framer Motion",
      "Redux",
      "Zustand",
    ],
    gradient: "from-amber-500 to-orange-500",
  },
  backend: {
    title: "Backend",
    icon: "server",
    skills: [
      "Rust/Axum",
      "Node.js",
      "FastAPI",
      "Express",
      "PostgreSQL",
      "MongoDB",
      "Supabase",
      "n8n",
    ],
    gradient: "from-emerald-500 to-green-600",
  },
  devOps: {
    title: "DevOps & Cloud",
    icon: "cloud",
    skills: [
      "Docker",
      "GCP",
      "Vercel",
      "Cloudflare",
      "GitHub Actions",
      "CI/CD",
      "Linux",
      "Jenkins",
    ],
    gradient: "from-rose-500 to-pink-600",
  },
  tools: {
    title: "Tools & Platforms",
    icon: "tool",
    skills: [
      "Streamlit",
      "Gradio",
      "Power BI",
      "Jupyter",
      "VS Code",
      "Cursor",
      "Figma",
    ],
    gradient: "from-indigo-500 to-blue-600",
  },
};

// Combined skills for backward compatibility
export const skills: Skill[] = [
  ...skillsAIML,
  ...skillsWebDev,
  ...skillsBackend,
  ...skillsDevOps,
];

export const skillsDark = skills;
