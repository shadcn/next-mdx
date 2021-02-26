import { Layout } from "@/components/layout"
import { mdxComponents } from "@/components/mdx-components"
import { getMdxContent, getMdxPaths, MdxContent } from "next-mdx/server"
import { hydrate } from "next-mdx/client"

export interface PostPageProps {
  post: MdxContent
}

export default function PostPage({ post }: PostPageProps) {
  const content = hydrate(post, {
    components: mdxComponents,
  })

  return (
    <Layout>
      <article>
        <h1>{post.frontMatter.title}</h1>
        {post.frontMatter.excerpt ? <p>{post.frontMatter.excerpt}</p> : null}
        <hr />
        {content}
      </article>
    </Layout>
  )
}

export async function getStaticPaths() {
  return {
    paths: await getMdxPaths("content/blog"),
    fallback: false,
  }
}

export async function getStaticProps(context) {
  const [post] = await getMdxContent("./content/blog", {
    context,
    components: mdxComponents,
  })

  return {
    props: {
      post,
    },
  }
}
