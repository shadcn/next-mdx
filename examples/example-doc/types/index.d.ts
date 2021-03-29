import { MdxNode } from "next-mdx/server"

interface Doc
  extends MdxNode<{
    title: string
    excerpt?: string
  }> {}
