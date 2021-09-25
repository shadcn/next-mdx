import { SiteConfig } from "@/core/types"

export const site: SiteConfig = {
  name: "Next MDX",
  description: "Build MDX powered websites using Next.js",
  copyright: `© ${new Date().getFullYear()} Next MDX - Project maintained by <a href="https://twitter.com/shadcn">@shadcn</a>.`,
  links: [
    {
      title: "Home",
      url: "/",
    },
    {
      title: "Documentation",
      url: "/",
      activePathNames: ["/[[...slug]]"],
    },
    {
      title: "Guides",
      url: "/guides",
    },
    {
      title: "GitHub",
      url: "https://github.com/shadcn/next-mdx",
      external: true,
    },
  ],
  social: {
    github: "shadcn/next-mdx",
    twitter: "shadcn",
  },
}
