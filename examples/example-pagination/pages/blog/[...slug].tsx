import * as React from "react"
import { getMdxNode, getMdxPaths } from "next-mdx/server"
import { useHydrate } from "next-mdx/client"
import { Post } from "types"

export interface PostPageProps {
  post: Post
}

export default function PostPage({ post }: PostPageProps) {
  const content = useHydrate(post)

  return (
    <article>
      <h1>{post.frontMatter.title}</h1>
      {post.frontMatter.excerpt ? <p>{post.frontMatter.excerpt}</p> : null}
      <hr />
      {content}
    </article>
  )
}

export async function getStaticPaths() {
  return {
    paths: await getMdxPaths("post"),
    fallback: false,
  }
}

export async function getStaticProps(context) {
  const post = await getMdxNode("post", context)

  return {
    props: {
      post,
    },
  }
}
