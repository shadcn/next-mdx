import { getAllMdxNodes } from "next-mdx"
import { Post } from "types"
import { mdxComponents } from "@/components/mdx-components"
import { Layout } from "@/components/layout"
import { PostTeaser } from "@/components/post-teaser"

export interface BlogPageProps {
  posts: Post[]
}

export default function BlogPage({ posts }: BlogPageProps) {
  return (
    <Layout>
      <div variant="container" py="10|12">
        <h1 variant="heading.h1">All Posts.</h1>
        {posts.length ? (
          posts.map((post) => <PostTeaser key={post.slug} post={post} />)
        ) : (
          <p my="10" textAlign="center">
            No posts found.
          </p>
        )}
      </div>
    </Layout>
  )
}

export async function getStaticProps() {
  const posts = await getAllMdxNodes("post", {
    components: mdxComponents,
  })

  return {
    props: {
      posts,
    },
  }
}
