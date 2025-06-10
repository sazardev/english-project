import { defineCollection, z } from "astro:content";

const blogCollection = defineCollection({
  type: "content",
  schema: z.object({
    title: z.string(),
    description: z.string(),
    category: z.enum([
      "grammar",
      "vocabulary",
      "speaking",
      "listening",
      "writing",
      "reading",
      "pronunciation",
      "culture",
    ]),
    level: z.enum(["beginner", "intermediate", "advanced"]),
    tags: z.array(z.string()).optional(),
    author: z.string().optional(),
    readingTime: z.number().optional(),
    featured: z.boolean().default(false),
    publishDate: z.date().optional(),
  }),
});

export const collections = {
  blog: blogCollection,
};
