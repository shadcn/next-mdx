import * as React from "react"
import { getAllNodes } from "next-mdx/server"
import { Post } from "types"
import { POSTS_PER_PAGE } from "pages"
import { Pager } from "src/pager"
import { Posts } from "src/posts"

export interface IndexPageProps {
  posts: Post[]
  pageNumber: number
  totalPages: number
}

export default function PostPage({
  posts,
  pageNumber,
  totalPages,
}: IndexPageProps) {
  return (
    <div>
      <Posts posts={posts} />
      <Pager totalPages={totalPages} pageNumber={pageNumber} />
    </div>
  )
}

export async function getStaticPaths() {
  const posts = await getAllNodes("post")
  const totalPages = Math.ceil(posts.length / POSTS_PER_PAGE) - 1

  return {
    paths: Array.from({ length: totalPages }, (_, i) => i + 1).map(
      (pageNumber) => ({
        params: {
          page: pageNumber + "",
        },
      })
    ),
    fallback: false,
  }
}

export async function getStaticProps(context) {
  const {
    params: { page },
  } = context
  const posts = await getAllNodes("post")
  const pageNumber = parseInt(page)

  return {
    props: {
      posts: posts.splice(POSTS_PER_PAGE * pageNumber, POSTS_PER_PAGE),
      pageNumber,
      totalPages: Math.ceil(posts.length / POSTS_PER_PAGE),
    },
  }
}
