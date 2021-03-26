import * as React from "react"
import Link from "next/link"
import { getMdxNode, getMdxPaths, MdxNode } from "next-mdx/server"
import { useHydrate } from "next-mdx/client"

const mdxComponents = {
  p: (props) => (
    <p
      {...props}
      style={{
        margin: "1rem 0",
      }}
    />
  ),
  Link,
}

export interface PageProps {
  page: MdxNode
}

export default function PostPage({ page }: PageProps) {
  const content = useHydrate(page, {
    components: mdxComponents,
  })

  return (
    <article>
      <h1>{page.frontMatter.title}</h1>
      {page.frontMatter.excerpt ? <p>{page.frontMatter.excerpt}</p> : null}
      <hr />
      {content}
    </article>
  )
}

export async function getStaticPaths() {
  return {
    paths: await getMdxPaths("page"),
    fallback: false,
  }
}

export async function getStaticProps(context) {
  const page = await getMdxNode("page", context, {
    components: mdxComponents,
  })

  return {
    props: {
      page,
    },
  }
}
