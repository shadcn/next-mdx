import * as React from "react"
import { getAllNodes } from "next-mdx/server"
import { Post } from "types"
import { Pager } from "src/pager"
import { Posts } from "src/posts"

export const POSTS_PER_PAGE = 3

export interface IndexPageProps {
  posts: Post[]
  totalPages: number
}

export default function PostPage({ posts, totalPages }: IndexPageProps) {
  return (
    <div>
      <Posts posts={posts} />
      <Pager totalPages={totalPages} />
    </div>
  )
}

export async function getStaticProps() {
  const posts = await getAllNodes("post")

  return {
    props: {
      posts: posts.splice(0, POSTS_PER_PAGE),
      totalPages: Math.ceil(posts.length / POSTS_PER_PAGE),
    },
  }
}
