import { MdxNode } from "next-mdx/server"

interface Post
  extends MdxNode<{
    title: string
    excerpt?: string
  }> {}
