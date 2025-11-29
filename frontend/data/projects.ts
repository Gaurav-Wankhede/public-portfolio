/**
 * Fallback project data used when backend is not available.
 * Replace these with your own projects or configure via backend.
 */
export const projectsData = [
  {
    slug: "sample-project-1",
    date: "2024-01-15",
    title: "Sample Project One",
    description: {
      title: "Sample Project",
      overview:
        "This is a sample project description. Replace with your own project details.",
      datasetDescription: {
        title: "Features",
        items: ["Feature one", "Feature two", "Feature three"],
      },
      dashboardInfo: "Additional project information goes here.",
    },
    images: [],
    technologies: ["React", "TypeScript", "Node.js"],
    features: ["Key feature one", "Key feature two", "Key feature three"],
    githubUrl: "",
    demoUrl: "",
  },
  {
    slug: "sample-project-2",
    date: "2024-02-20",
    title: "Sample Project Two",
    description: {
      title: "Another Sample Project",
      overview:
        "This is another sample project. Configure your own projects via the backend or edit this file.",
      datasetDescription: {
        title: "Highlights",
        items: ["Highlight one", "Highlight two"],
      },
      dashboardInfo: "Project dashboard information.",
    },
    images: [],
    technologies: ["Python", "FastAPI", "PostgreSQL"],
    features: ["Feature A", "Feature B", "Feature C"],
    githubUrl: "",
    demoUrl: "",
  },
];
