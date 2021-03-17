import { getAllNodes } from "next-mdx/server"
import Link from "next/link"

export default function IndexPage({ posts }) {
  return (
    <div>
      {posts.map((post) => (
        <Link href={post.url} key={post.slug}>
          <a>{post.frontMatter.title}</a>
        </Link>
      ))}
    </div>
  )
}

export async function getStaticProps() {
  const posts = await getAllNodes("post")

  return {
    props: {
      posts,
    },
  }
}
