import { Layout } from "@/components/layout"
import { mdxComponents } from "@/components/mdx-components"
import { Posts } from "@/components/posts"
import { getMdxNode, getAllMdxNodes, getMdxPaths } from "next-mdx/server"

export default function AuthorPage({ author, posts }) {
  return (
    <Layout>
      <h1>All posts by {author.frontMatter.title}.</h1>
      <Posts posts={posts} />
    </Layout>
  )
}

export async function getStaticPaths() {
  return {
    paths: await getMdxPaths("author"),
    fallback: false,
  }
}

export async function getStaticProps(context) {
  const author = await getMdxNode("author", context)

  if (!author) {
    return {
      notFound: true,
    }
  }

  const posts = await getAllMdxNodes("blog", {
    components: mdxComponents,
    sortBy: "date",
  })

  return {
    props: {
      author,
      posts,
    },
  }
}
