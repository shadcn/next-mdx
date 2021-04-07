import { MdxNode } from "next-mdx"

declare global {
  interface Window {
    /* eslint-disable  @typescript-eslint/no-explicit-any */
    docsearch: any
  }
}

export interface MdxComponents {
  [name: string]: React.ReactNode
}

export type Doc = MdxNode<{
  title: string
  excerpt?: string
}>

export type Guide = MdxNode<{
  title?: string
  date?: string
  excerpt?: string
  author?: string
  image?: string
  caption?: string
}>

export type NavLink = {
  title: string
  external?: boolean
  activePathNames?: string[]
} & (
  | {
      url: string
      items?: never
    }
  | {
      url?: string
      items: NavLink[]
    }
)

export type NavLinks = NavLink[]

export interface SiteConfig {
  name: string
  description?: string
  copyright?: string
  links: NavLinks
  social: {
    github?: string
    twitter?: string
  }
}

export interface DocsConfig {
  links: NavLinks
}

export interface GuidesConfig {
  links: NavLinks
}
