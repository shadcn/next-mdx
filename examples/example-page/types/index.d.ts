import { MdxNode } from "next-mdx/server"

interface Page
  extends MdxNode<{
    title: string
    excerpt?: string
  }> {}
