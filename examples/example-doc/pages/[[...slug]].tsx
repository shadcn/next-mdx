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
    <div className="container">
      <article>
        <h1>{doc.frontMatter.title}</h1>
        {doc.frontMatter.excerpt ? <p>{doc.frontMatter.excerpt}</p> : null}
        <hr />
        {content}
      </article>
      <aside>
        <h4>On this page:</h4>
        <Toc tree={tableOfContents} />
      </aside>
      <style jsx global>{`
        body {
          margin: 0;
          padding: 0;
          font-size: 18px;
          font-weight: 400;
          line-height: 1.8;
          color: #333;
          font-family: sans-serif;
        }
        h1 {
          font-weight: 700;
        }
        p {
          margin-bottom: 10px;
        }
        pre {
          background-color: black;
          color: white;
          padding: 20px;
        }
        a {
          text-decoration: none;
          color: blue;
        }
      `}</style>
      <style jsx>{`
        .container {
          max-width: 1000px;
          margin: 0 auto;
          display: grid;
          grid-template-columns: 1fr 300px;
          align-items: flex-start;
          gap: 80px;
        }
        aside {
          position: sticky;
          top: 0;
        }
      `}</style>
    </div>
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
