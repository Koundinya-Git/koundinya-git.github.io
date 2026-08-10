import { z, defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';

const blogCollection = defineCollection({
  loader: glob({ pattern: "**/*.{md,mdx}", base: "./src/content/blog" }),
  schema: z.object({
    title: z.string(),
    date: z.date(),
    description: z.string(),
    tags: z.array(z.string()).default([]),
    cover: z.string().optional(),
    draft: z.boolean().default(false),
    relatedProjects: z.array(z.string()).default([]),
    relatedResearch: z.array(z.string()).default([]),
  }),
});

const researchCollection = defineCollection({
  loader: glob({ pattern: "**/*.{md,mdx}", base: "./src/content/research" }),
  schema: z.object({
    title: z.string(),
    description: z.string().optional(),
    abstract: z.string().optional(),
    status: z.string().optional(),
    topics: z.array(z.string()).default([]),
    authors: z.array(z.string()).default([]),
    publication: z.string().optional(),
    pdf: z.string().optional(),
    url: z.string().optional(),
    date: z.date(),
    doi: z.string().optional(),
    links: z.array(z.object({ name: z.string(), url: z.string() })).default([]),
  }),
});

const projectsCollection = defineCollection({
  loader: glob({ pattern: "**/*.{md,mdx}", base: "./src/content/projects" }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    status: z.string(),
    technologies: z.array(z.string()).default([]),
    features: z.array(z.string()).default([]),
    github: z.string().optional(),
    demo: z.string().optional(),
    date: z.date(),
  }),
});

export const collections = {
  blog: blogCollection,
  research: researchCollection,
  projects: projectsCollection,
};
