import { MdxNode } from "next-mdx/server"

interface Author
  extends MdxNode<{
    title: string
    bio?: string
  }> {}

interface PostFields {
  title: string
  excerpt?: string
  author?: string[]
  tags?: string[]
  date?: string
  relationships?: {
    author: Author[]
  }
}

interface Post extends MdxNode<PostFields> {}
