import Link from "next/link"
import { getAllNodes } from "next-mdx"

import { Post } from "types"
import { Layout } from "@/components/layout"

export interface BlogPageProps {
  posts: Post[]
}

export default function BlogPage({ posts }: BlogPageProps) {
  return (
    <Layout>
      <div>
        <h1>All Posts.</h1>
        <hr />
        {posts.length ? (
          <ul>
            {posts.map((post) => (
              <li key={post.slug}>
                <Link href={post.url} passHref>
                  <a>{post.frontMatter.title}</a>
                </Link>
              </li>
            ))}
          </ul>
        ) : (
          <p>No posts found.</p>
        )}
      </div>
    </Layout>
  )
}

export async function getStaticProps() {
  const posts = await getAllNodes<Post>("post")

  return {
    props: {
      posts,
    },
  }
}
