import { getMdxContent, MdxContent } from "next-mdx/server"
import { mdxComponents } from "../src/components/mdx-components"
import Link from "next/link"

export interface IndexPageProps {
  pages: MdxContent[]
}

export default function IndexPage({ pages }: IndexPageProps) {
  return pages.length ? (
    <ul>
      {pages.map((page) => (
        <li key={page.url}>
          <Link href={page.url}>
            <a>{page.frontMatter.title}</a>
          </Link>
        </li>
      ))}
    </ul>
  ) : null
}

export async function getStaticProps() {
  const pages = await getMdxContent("./content/blog", {
    basePath: "/blog",
    components: mdxComponents,
  })
  return {
    props: {
      pages,
    },
  }
}
