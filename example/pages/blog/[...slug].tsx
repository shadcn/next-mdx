import Link from "next/link"
import Image from "next/image"
import { Post } from "types"
import { Layout } from "@/components/layout"
import { mdxComponents } from "@/components/mdx-components"
import { useHydrate } from "next-mdx/client"
import { getMdxNode, getMdxPaths } from "next-mdx/server"
import { PostMeta } from "@/components/post-meta"
import { Icon } from "reflexjs"

export interface PostPageProps {
  post: Post
}

export default function PostPage({ post }: PostPageProps) {
  const content = useHydrate(post, {
    components: mdxComponents,
  })
  return (
    <Layout>
      <div variant="container.sm" py="4|10|12">
        <article>
          <h1 variant="heading.title">{post.frontMatter.title}</h1>
          {post.frontMatter.excerpt ? (
            <p variant="text.lead" mt="4">
              {post.frontMatter.excerpt}
            </p>
          ) : null}
          <PostMeta post={post} />
          <hr />
          {post.frontMatter.image ? (
            <figure
              position="relative"
              height="250px|350px|450px"
              rounded="sm"
              overflow="hidden"
            >
              <Image
                src={post.frontMatter.image}
                alt={post.frontMatter.title}
                layout="fill"
              />
            </figure>
          ) : null}
          {content}
          <Link href="/blog" passHref>
            <a
              display="inline-flex"
              mt="8"
              alignItems="center"
              color="primary"
              textDecoration="none"
              _hover={{
                textDecoration: "underline",
              }}
            >
              <Icon name="arrow" size="4" transform="rotate(180deg)" mr="2" />
              See all posts
            </a>
          </Link>
        </article>
      </div>
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
  const post = await getMdxNode("post", context, {
    components: mdxComponents,
  })

  return {
    props: {
      post,
    },
  }
}
