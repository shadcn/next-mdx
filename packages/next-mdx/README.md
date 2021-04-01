<div align="center">
  <img src="https://user-images.githubusercontent.com/124599/109961945-0c061b00-7d04-11eb-9c19-17f33430b59f.jpg" />
  <h1>next-mdx</h1>
</div>

<p align="center">
  <a href="https://github.com/arshad/next-mdx/actions/workflows/ci.yml"><img src="https://github.com/arshad/next-mdx/actions/workflows/ci.yml/badge.svg" alt="Test"></a>
  <a href="https://github.com/arshad/next-mdx/blob/master/LICENSE"><img src="https://img.shields.io/npm/l/@arshad/gatsby-theme-phoenix.svg" alt="License"></a>
  <a href="https://github.com/arshad/next-mdx/pulls"><img src="https://img.shields.io/badge/PRs-welcome-brightgreen.svg" alt="PRs welcome!" /></a>
  <a href="https://twitter.com/arshadcn"><img src="https://img.shields.io/badge/Follow-%40arshadcn-1da1f2" alt="Follow @arshadcn" /></a>
</p>

<p align="center">
  <strong>next-mdx</strong> provides a set of helper functions for fetching and rendering local MDX files. It handles <strong>relational data</strong>, supports <strong>custom components</strong>, <strong>TypeScript</strong> ready and is <strong>really fast</strong>.
</p>

<p align="center">
<strong>next-mdx</strong> is great for building mdx-powered pages, multi-user blogs, category pages..etc.
</p>

<div align="center">
  <img src="https://user-images.githubusercontent.com/124599/110736366-f2edf480-8244-11eb-9b43-f27f6f578f4c.jpg" alt="next-mdx-relational-data" />
</div>

## TLDR

- 👉 Learn how to create a Next.js blog in 5 tweets: https://twitter.com/arshadcn/status/1367888421805383683
- 🚀 What about build times? Is this fast? Yes: https://twitter.com/arshadcn/status/1372275646840279040

## Table of Contents

- [Demo](#demo)
- [Quick Start](#quick-start)
- [Examples](#examples)
- [Installation](#installation)
- [Configuration](#configuration)
- [Reference](#reference)
  - [getMdxPaths](#getmdxpaths)
  - [getNode](#getnode)
  - [getAllNodes](#getallnodes)
  - [getMdxNode](#getmdxnode)
  - [getAllMdxNodes](#getallmdxnodes)
  - [useHydrate](#usehydrate)
  - [getAllNodes vs getAllMdxNodes](#getallnodes-vs-getallmdxnodes)
- [MDX Components](#mdx-components)
- [MDX Options](#mdx-options)
- [Relational Data](#relational-data)
- [Plugins](#plugins)
- [TypeScript](#typescript)

## Demo

https://next-mdx-example.vercel.app

## Quick Start

Learn how next-mdx works by looking at examples.

1. Go to [example-page](examples/example-page)
2. Open `next-mdx.json` to see the sample configuration.
3. Open `pages/[[...slug]].tsx` to see how MDX files are fetched and rendered.
4. See `types/index.d.ts` for TypeScript.

## Examples

Click to expand examples.

<details>
  <summary>next-mdx.json</summary>
  
  ```json
  {
    "post": {
      "contentPath": "content/posts",
      "basePath": "/blog",
      "sortBy": "date",
      "sortOrder": "desc"
    },
  }
  ```
</details>

<details>
  <summary>pages/posts/[...slug].jsx</summary>
  
  ```jsx
  import { useHydrate } from "next-mdx/client"
  import { getMdxNode, getMdxPaths } from "next-mdx/server"

  export default function PostPage({ post }) {
    const content = useHydrate(post)
    
    return (
      <article>
        <h1 variant="heading.title">{post.frontMatter.title}</h1>
        {post.frontMatter.excerpt ? (
          <p variant="text.lead" mt="4">
            {post.frontMatter.excerpt}
          </p>
        ) : null}
        <hr />
        {content}
      </article>
    )
  }

  export async function getStaticPaths() {
    return {
      paths: await getMdxPaths("post"),
      fallback: false,
    }
  }

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
</details>


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
    "contentPath": "content/categories"
  }
}
```

1. `post`, `category` and `author` keys are unique IDs used as references for your MDX types.
2. `contentPath` (required) is where your MDX files are located.
3. `basePath` (optional) is the path used for generating URLs.
4. `sortBy` (optional, defaults to `title`) is the name of the frontMatter field used for sorting.
5. `sortOrder` (optional, defaults to `asc`) is the sorting order.

## Reference

`next-mdx` exposes 6 main helper functions:

- `getMdxPaths(sourceName: string)`
- `getNode(sourceName, context)`
- `getAllNodes(sourceName)`
- `getMdxNode(sourceName, context, params)`
- `getAllMdxNodes(sourceName, params)`
- `useHydrate(node, params)`

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

### getNode

`getNode(sourceName, context)` returns an `MDXNode` with frontMatter and relational data but **without** MDX data. This is really fast and cached.

Use this instead of `getMdxNode` if you are not rendering MDX content on a page.

- `sourceName` is the unique ID defined in `next-mdx.json`
- `context` is the context passed to `getStaticProps` or the slug as a string.

#### Example

```js
// pages/blog/[...slug].js
import { getNode } from "next-mdx/server"

export async function getStaticProps(context) {
  const post = await getNode("post", context)

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

### getAllNodes

`getAllNodes(sourceName)` returns all `MdxNode` of the given type/source with frontMatter and relational data but **without** MDX data. This is also really fast and cached.

- `sourceName` is the unique ID defined in `next-mdx.json`

#### Example

```js
import { getAllNodes } from "next-mdx/server"

export async function getStaticProps() {
  return {
    props: {
      posts: await getAllNodes("post"),
    },
  }
}
```

### getMdxNode

`getMdxNode(sourceName, context, params)` returns an `MDXNode`.

- `sourceName` is the unique ID defined in `next-mdx.json`
- `context` is the context passed to `getStaticProps` or the slug as a string.
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

## getAllNodes vs getAllMdxNodes

Use `getAllNodes` when you need nodes **without** the MDX content. It is backed by a cache and is really fast. This is handy when you need a list of nodes (example post teasers) and you're not using the MDX content.

## MDX Components

To use components inside MDX files, you need to pass the components to both `getMdxNode/getAllMdxNodes` and `useHydrate`.

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

## MDX Options

MDX options can be passed as `params` to both `getMdxNode(sourceName, context, params)` and `getAllMdxNodes(sourceName, params)` where `params` takes the shape of:

```ts
export interface MdxParams {
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

## Relational Data

When retrieving nodes with `getMdxNode` or `getAllMdxNodes`, `next-mdx` will automatically infer relational data from frontMatter keys.

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

## Plugins

- [next-mdx-toc](/packages/next-mdx-toc): Add table of contents to MDX pages.

## TypeScript

Define your node types as follows:

```ts
interface Post extends MdxNode<FrontMatterFields> {}
```

### Example

```ts
import { MdxNode } from "next-mdx/server"

interface Category
  extends MdxNode<{
    name: string
  }> {}

interface Post
  extends MdxNode<{
    title: string
    excerpt?: string
    category?: string[]
  }> {
  relationships?: {
    category: Category[]
  }
}
```

You can then use `Post` as the return type for `getNode`, `getAllNodes`, `getMdxNode` and `getAllMdxNode`:

```ts
const post = await getMdxNode<Post>("post", context)

const posts = await getAllNodes<Post>("post")
```

## License

Licensed under the [MIT license](https://github.com/arshad/next-mdx/blob/master/LICENSE).
