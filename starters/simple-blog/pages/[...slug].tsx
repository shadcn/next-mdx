import * as React from "react"
import { getMdxNode, getMdxPaths } from "next-mdx/server"
import { useHydrate } from "next-mdx/client"

import { Page } from "types"
import { Layout } from "@/components/layout"
import { mdxComponents } from "@/components/mdx-components"

export interface PageProps {
  page: Page
}

export default function PostPage({ page }: PageProps) {
  const content = useHydrate(page, {
    components: mdxComponents,
  })

  return (
    <Layout>
      <article>
        <div>
          <h1>{page.frontMatter.title}</h1>
          {page.frontMatter.excerpt ? <p>{page.frontMatter.excerpt}</p> : null}
          <hr />
          {content}
        </div>
      </article>
    </Layout>
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
