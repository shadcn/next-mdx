import { Icon } from "reflexjs"
import { Layout } from "@/components/layout"
import { Post } from "types"
import { getAllMdxNodes } from "next-mdx"
import Link from "next/link"
import Image from "next/image"

export interface IndexPageProps {
  posts: Post[]
}

export default function IndexPage({ posts }: IndexPageProps) {
  return (
    <Layout>
      <section py="10|18">
        <div variant="container">
          <div textAlign="center">
            <Icon name="zap" size="12" mb="6" />
            <h1 variant="heading.h1">A Modern Stack</h1>
            <p variant="text.lead" mx="auto" mt="4">
              Blast off with the speed of Next.js, the power of MDX and the
              flexibility of Reflexjs.
            </p>
            <div display="inline-grid" col="2" gap="4" mt="6">
              <a
                href="https://github.com/reflexjs/reflexjs"
                variant="button.primary.lg"
              >
                Get Started
              </a>
              <a
                href="https://github.com/reflexjs/reflexjs"
                variant="button.muted.lg"
              >
                GitHub
              </a>
            </div>
          </div>
        </div>
      </section>

      {posts.length ? (
        <section py="10|12">
          <div variant="container" maxW="1000">
            <h2 variant="heading.h1" mb="2" textAlign="center">
              Featured Posts
            </h2>
            <p variant="text.lead" textAlign="center" mt="0" mb="6">
              Aliquid impedit ducimus eum facere
            </p>
            <div display="grid" col="1|2|2|3" gap="10|10|10|20" py="8">
              {posts.map((post) => (
                <article key={post.slug}>
                  <Link href={post.url}>
                    <figure
                      borderRadius="md"
                      overflow="hidden"
                      mb="6"
                      borderWidth="1"
                      width="full|full|full|270"
                      height="450|270"
                      position="relative"
                    >
                      <Image src={post.frontMatter.image} layout="fill" />
                    </figure>
                  </Link>
                  <Link href={post.url} passHref>
                    <a
                      color="text"
                      textDecoration="none"
                      _hover={{
                        color: "primary",
                      }}
                    >
                      <h2 variant="heading.h4">{post.frontMatter.title}</h2>
                    </a>
                  </Link>

                  <p variant="text.paragraph" mt="2">
                    {post.frontMatter.excerpt}
                  </p>
                </article>
              ))}
            </div>
          </div>
        </section>
      ) : null}
    </Layout>
  )
}

export async function getStaticProps() {
  const posts = await getAllMdxNodes<Post>("post")

  return {
    props: {
      posts: posts.filter((post) => post.frontMatter.featured),
    },
  }
}
