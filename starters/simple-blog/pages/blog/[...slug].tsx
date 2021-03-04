import Image from "next/image"
import { useHydrate } from "next-mdx/client"
import { getMdxNode, getMdxPaths } from "next-mdx/server"
import { Post } from "types"
import { Layout } from "@/components/layout"
import { mdxComponents } from "@/components/mdx-components"

export interface PostPageProps {
  post: Post
}

export default function PostPage({ post }: PostPageProps) {
  const content = useHydrate(post, {
    components: mdxComponents,
  })
  return (
    <Layout>
      <article>
        <h1>{post.frontMatter.title}</h1>
        {post.frontMatter.excerpt ? <p>{post.frontMatter.excerpt}</p> : null}
        <hr />
        {post.frontMatter.image ? (
          <Image
            src={post.frontMatter.image}
            alt={post.frontMatter.title}
            layout="fixed"
            width={500}
            height={400}
          />
        ) : null}
        {content}
      </article>
    </Layout>
  )
}

export async function getStaticPaths() {
  return {
    paths: await getMdxPaths("post"),
    fallback: false,
  }
}

export async function getStaticProps(context) {
  const post = await getMdxNode<Post>("post", context)

  if (!post) {
    return {
      notFound: true,
    }
  }

  return {
    props: {
      post,
    },
  }
}
