# next-mdx-toc

Add table of contents to MDX.

## Installation

```
npm i --save next-mdx-toc remark-slug remark-autolink-headings
```

## Usage

1. Retrieve the MDX node using `getMdxNode`:

```js
const doc = await getMdxNode("doc", context, {
  mdxOptions: {
    remarkPlugins: [
      require("remark-slug"),
      require("remark-autolink-headings"),
    ],
  },
})
```

2. Then call `getTableOfContents(node: MdxNode): TableOfContents`:

```js
const toc = await getTableOfContents(doc)
```

## Example

```jsx
import * as React from "react"
import { getMdxNode } from "next-mdx/server"
import { getTableOfContents } from "next-mdx-toc"

export default function Page({ doc, tableOfContents }) {}

export async function getStaticProps(context) {
  const doc = await getMdxNode("doc", context, {
    mdxOptions: {
      remarkPlugins: [
        require("remark-slug"),
        require("remark-autolink-headings"),
      ],
    },
  })

  return {
    props: {
      doc,
      tableOfContents: await getTableOfContents(doc),
    },
  }
}
```

## Render

To render the table of contents, use a recursive component type:

```tsx
import { TableOfContents } from "next-mdx-toc"

function Toc({ tree }: { tree: TableOfContents }) {
  return tree?.items.length ? (
    <ul>
      {tree.items.map((item) => {
        return (
          <li key={item.title}>
            <a href={item.url}>{item.title}</a>
            {item.items?.length ? <Toc tree={item} /> : null}
          </li>
        )
      })}
    </ul>
  ) : null
}
```

```tsx
<Toc tree={tableOfContents} />
```

## TypeScript

If you want to add the table of contents to your `MdxNode`, you can do so as follows:

```ts
import { TableOfContents } from "next-mdx-toc"
import { MdxNode } from "next-mdx/server"

interface Doc extends MdxNode {
  toc: TableOfContents
}
```

## License

Licensed under the [MIT license](https://github.com/shadcn/next-mdx/blob/master/LICENSE).
