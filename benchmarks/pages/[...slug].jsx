import { useHydrate } from "next-mdx/client"
import { getMdxNode, getMdxPaths } from "next-mdx/server"

export function Callout({ children }) {
  return <div style={{ backgroundColor: "tomato" }}>{children}</div>
}

const components = {
  Callout,
}

export default function IndexPage({ post }) {
  const content = useHydrate(post, {
    components,
  })

  return (
    <div>
      <h1>{post.frontMatter.title}</h1>
      {content}
    </div>
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
    components,
  })

  if (!post) {
    return {
      notFound: true,
    }
  }

  return {
    props: {
      post: {
        ...post,
      },
    },
  }
}
