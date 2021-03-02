import Link from "next/link"
import { getMdxNodes, MdxNode } from "next-mdx/server"
import { Layout } from "@/components/layout"
import { mdxComponents } from "@/components/mdx-components"

export interface IndexPageProps {
  pages: MdxNode[]
}

export default function IndexPage({ pages }: IndexPageProps) {
  return (
    <Layout>
      {pages.length ? (
        <>
          <h1>Pages</h1>
          <ul>
            {pages.map((page) => (
              <li key={page.url}>
                <Link href={page.url}>
                  <a>{page.frontMatter.title}</a>
                </Link>
              </li>
            ))}
          </ul>
        </>
      ) : null}
    </Layout>
  )
}

export async function getStaticProps() {
  const pages = await getMdxNodes("page", {
    components: mdxComponents,
  })

  return {
    props: {
      pages,
    },
  }
}
