import { DocsConfig } from "@/core/types"

export const docs: DocsConfig = {
  links: [
    {
      title: "Documentation",
      items: [
        {
          title: "Introduction",
          url: "/",
        },
        {
          title: "Demo",
          url: "https://next-mdx-example.vercel.app",
          external: true,
        },
        {
          title: "Installation",
          url: "/installation",
        },
        {
          title: "Components",
          url: "/components",
        },
        {
          title: "Relational Data",
          url: "/relational-data",
        },
        {
          title: "MDX Options",
          url: "/mdx-options",
        },
        {
          title: "TypeScript",
          url: "/typescript",
        },
      ],
    },
    {
      title: "Reference",
      items: [
        {
          title: "getMdxPaths",
          url: "/api#getmdxpaths",
        },
        {
          title: "getNode",
          url: "/api#getnode",
        },
        {
          title: "getAllNodes",
          url: "/api#getallnodes",
        },
        {
          title: "getMdxPaths",
          url: "/api#getmdxpaths",
        },
        {
          title: "getMdxNode",
          url: "/api#getmdxnode",
        },
        {
          title: "getAllMdxNodes",
          url: "/api#getallmdxnodes",
        },
        {
          title: "useHydrate",
          url: "/api#usehydrate",
        },
      ],
    },
    {
      title: "Plugins",
      items: [
        {
          title: "next-mdx-toc",
          url: "/plugins/next-mdx-toc",
        },
      ],
    },
  ],
}
