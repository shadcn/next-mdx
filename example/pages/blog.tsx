import { getMdxNodes } from "next-mdx/server"
import { Layout } from "@/components/layout"
import { mdxComponents } from "@/components/mdx-components"
import { Posts } from "@/components/posts"
import { Post } from "types"

export interface BlogPageProps {
  posts: Post[]
}

export default function BlogPage({ posts }: BlogPageProps) {
  return (
    <Layout>
      <h1>Blog</h1>
      <Posts posts={posts} />
    </Layout>
  )
}

export async function getStaticProps() {
  const posts = await getMdxNodes("blog", {
    components: mdxComponents,
  })

  return {
    props: {
      posts,
    },
  }
}
