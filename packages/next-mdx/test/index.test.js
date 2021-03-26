import path from "path"
import mock from "mock-fs"
import { getNode, getAllNodes } from "../src/get-nodes"

beforeEach(function () {
  mock({
    "next-mdx.json": mock.load(
      path.resolve(__dirname, "__mocks__/next-mdx.json")
    ),
    "__fixtures__/content/posts": {
      "post-one.mdx": mock.load(
        path.resolve(__dirname, "__fixtures__/content/posts/post-one.mdx")
      ),
      "post-two.mdx": mock.load(
        path.resolve(__dirname, "__fixtures__/content/posts/post-two.mdx")
      ),
    },
    "__fixtures__/content/posts/a/nested": {
      "post.mdx": mock.load(
        path.resolve(__dirname, "__fixtures__/content/posts/a/nested/post.mdx")
      ),
    },
    "__fixtures__/content/authors": {
      "jane-doe.mdx": mock.load(
        path.resolve(__dirname, "__fixtures__/content/authors/jane-doe.mdx")
      ),
      "john-doe.mdx": mock.load(
        path.resolve(__dirname, "__fixtures__/content/authors/john-doe.mdx")
      ),
    },
    "__fixtures__/content/pages": {
      "index.mdx": mock.load(
        path.resolve(__dirname, "__fixtures__/content/pages/index.mdx")
      ),
      "about.mdx": mock.load(
        path.resolve(__dirname, "__fixtures__/content/pages/about.mdx")
      ),
    },
  })
})

afterEach(() => {
  mock.restore()
})

test("gets all nodes for a source", async () => {
  const nodes = await getAllNodes("post")
  expect(nodes.length).toBe(3)
})

test("gets a node using slug", async () => {
  const post = await getNode("post", "post-one")
  expect(post.frontMatter.title).toBe("Post One")
  expect(post.url).toBe("/blog/post-one")

  const author = await getNode("author", "john-doe")
  expect(author.frontMatter.name).toBe("John Doe")
  expect(author.url).toBe(null)
})

test("basePath is optional", async () => {
  const author = await getNode("author", "john-doe")
  expect(author.frontMatter.name).toBe("John Doe")
  expect(author.url).toBe(null)
})

test("node relationships are properly attached", async () => {
  const post = await getNode("post", "post-one")
  expect(post.relationships.author.length).toBe(2)
  expect(post.relationships.author[0].frontMatter.name).toBe("John Doe")
  expect(post.relationships.author[1].frontMatter.name).toBe("Jane Doe")
})

test("nested post", async () => {
  const post = await getNode("post", "a/nested/post")
  expect(post.frontMatter.title).toBe("A nested post")
})

test("node can be retrieved using both and context", async () => {
  const postFromSlug = await getNode("post", "post-one")
  const postFromContext = await getNode("post", {
    params: { slug: ["post-one"] },
  })
  expect(postFromSlug.hash).toEqual(postFromContext.hash)

  const nestedFromSlug = await getNode("post", "a/nested/post")
  const nestedFromContext = await getNode("post", {
    params: { slug: ["a", "nested", "post"] },
  })
  expect(nestedFromSlug.hash).toEqual(nestedFromContext.hash)
})

test("an error is thrown for an invalid source", async () => {
  await expect(getAllNodes("foo")).rejects.toThrow(
    "Type foo does not exist in next-mdx.json"
  )
})

test("index.mdx should resolved to empty url for optional catch-all", async () => {
  const page = await getNode("page", "")
  expect(page.frontMatter.title).toBe("Home")
  expect(page.url).toBe("/")
})
