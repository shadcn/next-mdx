import { MdxNode } from "next-mdx/server"

interface Author
  extends MdxNode<{
    name: string
    bio?: string
  }> {}

interface Category
  extends MdxNode<{
    name: string
  }> {}

interface Post
  extends MdxNode<{
    title: string
    excerpt?: string
    image?: string
    authors?: string[]
    category?: string
    date?: string
    featured?: boolean
  }> {
  relationships?: {
    authors: Author[]
    category: Category
  }
}

interface Page
  extends MdxNode<{
    title: string
    excerpt?: string
  }> {}
