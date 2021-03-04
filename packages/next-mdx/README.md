# next-mdx

A set of helper functions to for fetching and rendering local [MDX](https://github.com/mdx-js/mdx) files.

<p>
  <a href="https://github.com/arshad/next-mdx/actions/workflows/ci.yml"><img src="https://github.com/arshad/next-mdx/actions/workflows/ci.yml/badge.svg" alt="Test"></a>
  <a href="https://github.com/reflexjs/reflex/blob/master/LICENSE"><img src="https://img.shields.io/npm/l/@arshad/gatsby-theme-phoenix.svg" alt="License"></a>
  <a href="https://github.com/reflexjs/reflex/pulls"><img src="https://img.shields.io/badge/PRs-welcome-brightgreen.svg" alt="PRs welcome!" /></a>
  <a href="https://twitter.com/arshadcn"><img src="https://img.shields.io/badge/Follow-%40arshadcn-1da1f2" alt="Follow @arshadcn" /></a>
</p>

## Table of Contents

- [Demo](#demo)
- [Installation](#installation)
- [Configuration](#configuration)
- [Reference](#reference)
  - [getMdxPaths](#getmdxpaths)
  - [getMdxNode](#getmdxnode)
  - [getMdxNodes](#getmdxnodes)
  - [useHydrate](#useHydrate)
- [MDX Components](#mdx-components)
- [Relational nodes](#relational-nodes)

## Demo

https://next-mdx-demo.vercel.app

## Installation

```
npm i --save next-mdx
```

## Configuration

Create a `next-mdx.json` file at the root of your project with the following:

```json
{
  "post": {
    "contentPath": "content/posts",
    "basePath": "/blog",
    "sortBy": "date",
    "sortOrder": "desc"
  },
  "category": {
    "contentPath": "content/categories",
    "basePath": "/blog/categories"
  }
}
```

1. `post` and `category` keys are unique IDs used as references for your MDX types.
2. `contentPath` (required) is where your MDX files are located.
3. `basePath` (required) is the path used for generating URLs.
4. `sortBy` (optional, defaults to `title`) is the name of the frontMatter field used for sorting.
5. `sortOrder` (optional, defaults to `asc`) is the sorting order.

## Reference

`next-mdx` exposes four main helper functions:

### getMdxPaths

`getMdxPaths(sourceName: string)` returns an array of path params which can be passed directly to `paths in `getStaticPaths`.

- `sourceName` is the unique ID defined in `next-mdx.json`

#### Example

```js
// pages/blog/[...slug].js
import { getMdxPaths } from "next-mdx/server"

export async function getStaticPaths() {
  return {
    paths: await getMdxPaths("post"),
    fallback: false,
  }
}
```

### getMdxNode

`getMdxNode(sourceName, context, params)` returns an `MDXNode`.

- `sourceName` is the unique ID defined in `next-mdx.json`
- `context` is the context passed to `getStaticProps`.
- `params`:

```js
{
  components?: MdxRemote.Components
  scope?: Record<string, unknown>
  provider?: MdxRemote.Provider
  mdxOptions?: {
    remarkPlugins?: Pluggable[]
    rehypePlugins?: Pluggable[]
    hastPlugins?: Pluggable[]
    compilers?: Compiler[]
    filepath?: string
  }
}
```

#### Example

```js
// pages/blog/[...slug].js
import { getMdxNode } from "next-mdx/server"

export async function getStaticProps(context) {
  const post = await getMdxNode("post", context)

  if (!post) {
    return {
      notFound: true,
    }
  }

  return {
    props: {
      post,
    },
  }
}
```

### getAllMdxNodes

`getAllMdxNodes(sourceName, params)` returns all `MdxNode` of the given type/source.

- `sourceName` is the unique ID defined in `next-mdx.json`
- `params`:

```js
{
  components?: { name: React.Component },
  scope?: {},
  provider?: { component: React.Component, props: Record<string, unknown> },
  mdxOptions: {
    remarkPlugins: [],
    rehypePlugins: [],
    hastPlugins: [],
    compilers: [],
  }
}
```

#### Example

```js
import { getAllMdxNodes } from "next-mdx/server"

export async function getStaticProps() {
  const posts = await getAllMdxNodes("post")

  return {
    props: {
      posts: posts.filter((post) => post.frontMatter.featured),
    },
  }
}
```

### useHydrate

`useHydrate(node, params)` is used on the client side for hydrating static content.

- `node` is the `MdxNode` object
- `params`:

```js
{
  components?: { name: React.Component },
  provider?: { component: React.Component, props: Record<string, unknown> }
}
```

### Example

```jsx
import { useHydrate } from "next-mdx/client"

export default function PostPage({ post }) {
  const content = useHydrate(post)

  return (
    <div>
      <h1>{post.frontMatter.title}</h1>

      {content}
    </div>
  )
}
```

## MDX Components

To use components inside MDX files, you need to pass the components to both `getMdxNode/getMdxNodes` and `useHydrate`.

### Example

```jsx
import { getMdxNode } from "next-mdx/server"
import { useHydrate } from "next-mdx/client"

export function Alert({ text }) {
  return <p>{text}</p>
}

export default function PostPage({ post }) {
  const content = useHydrate(post, {
    components: {
      Alert,
    },
  })

  return (
    <div>
      <h1>{post.frontMatter.title}</h1>

      {content}
    </div>
  )
}

export async function getStaticProps(context) {
  const post = await getMdxNode("post", context, {
    components: {
      Alert,
    },
  })

  return {
    props: {
      post,
    },
  }
}
```

## Relational data

When retrieving nodes with `getMdxNode` or `getMdxNodes`, `next-mdx` will automatically infer relational data from frontMatter keys.

### Convention

1. The frontMatter field name must be the same as the key defined in `next-mdx.json`
2. The frontMatter field must be an array of values.

### Example

Given the following MDX files.

```
.
└── content
    ├── categories
    │   └── category-a.mdx
    │   └── category-b.mdx
    └── posts:
        └── example-post.mdx
```

In `example-post` you can reference related categories using the following:

```md
---
title: Example Post
category:
  - category-a
---
```

You can then access the categories as follows:

```js
const post = getMdxNode("post", context)

// post.relationships.category
```

## License

Licensed under the [MIT license](https://github.com/arshad/next-mdx/blob/master/LICENSE).