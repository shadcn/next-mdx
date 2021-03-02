import Link from "next/link"
import { Post } from "types"
import { Layout } from "@/components/layout"
import { mdxComponents } from "@/components/mdx-components"
import { useHydrate } from "next-mdx/client"
import { getMdxNode, getMdxPaths } from "next-mdx/server"

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
        {content}
        {post.frontMatter.author?.length ? (
          <p>
            Posted by{" "}
            {post.relationships?.author.map((author) => (
              <Link href={author.url} key={author.slug}>
                <a>{author.frontMatter.title}</a>
              </Link>
            ))}
          </p>
        ) : null}
      </article>
    </Layout>
  )
}

export async function getStaticPaths() {
  return {
    paths: await getMdxPaths("blog"),
    fallback: false,
  }
}

export async function getStaticProps(context) {
  const post = await getMdxNode("blog", context, {
    components: mdxComponents,
  })

  return {
    props: {
      post,
    },
  }
}
