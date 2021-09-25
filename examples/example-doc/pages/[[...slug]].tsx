import * as React from "react"
import Link from "next/link"
import { getMdxNode, getMdxPaths } from "next-mdx/server"
import { useHydrate } from "next-mdx/client"
import { Doc } from "types"
import { getTableOfContents, TableOfContents } from "next-mdx-toc"

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

export interface DocProps {
  doc: Doc
  tableOfContents: TableOfContents
}

export default function Postdoc({ doc, tableOfContents }: DocProps) {
  const content = useHydrate(doc, {
    components: mdxComponents,
  })

  return (
    <>
      <header>
        👉 Demo for table of contents built with{" "}
        <a href="https://github.com/shadcn/next-mdx">next-mdx</a>.
      </header>
      <div className="container">
        <aside>
          <h4>On this page:</h4>
          <Toc tree={tableOfContents} />
        </aside>
        <article>
          <h1>{doc.frontMatter.title}</h1>
          {doc.frontMatter.excerpt ? <p>{doc.frontMatter.excerpt}</p> : null}
          <hr />
          {content}
        </article>
      </div>
    </>
  )
}

function Toc({ tree }: { tree: TableOfContents }) {
  return tree?.items.length ? (
    <ul>
      {tree.items.map((item) => {
        return (
          <li key={item.title}>
            <a href={item.url}>{item.title}</a>
            {item.items && <Toc tree={item} />}
          </li>
        )
      })}
    </ul>
  ) : null
}

export async function getStaticPaths() {
  return {
    paths: await getMdxPaths("doc"),
    fallback: false,
  }
}

export async function getStaticProps(context) {
  const doc = await getMdxNode("doc", context, {
    components: mdxComponents,
    mdxOptions: {
      remarkPlugins: [
        require("remark-slug"),
        require("remark-autolink-headings"),
      ],
    },
  })

  if (!doc) {
    return {
      notFound: true,
    }
  }

  return {
    props: {
      doc,
      tableOfContents: await getTableOfContents(doc),
    },
  }
}
