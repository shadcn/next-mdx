import { MdxNode } from "next-mdx/server"

interface Category
  extends MdxNode<{
    name: string
  }> {}

interface Post
  extends MdxNode<{
    title: string
    excerpt?: string
    image?: string
    category?: string[]
  }> {
  relationships?: {
    category: Category[]
  }
}

interface Page
  extends MdxNode<{
    title: string
    excerpt?: string
  }> {}
