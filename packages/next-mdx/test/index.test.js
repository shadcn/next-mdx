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
    "__fixtures__/content/authors": {
      "jane-doe.mdx": mock.load(
        path.resolve(__dirname, "__fixtures__/content/authors/jane-doe.mdx")
      ),
      "john-doe.mdx": mock.load(
        path.resolve(__dirname, "__fixtures__/content/authors/john-doe.mdx")
      ),
    },
  })
})

afterEach(() => {
  mock.restore()
})

test("gets all nodes for a source", async () => {
  const nodes = await getAllNodes("post")
  expect(nodes.length).toBe(2)
})

test("gets a node using slug", async () => {
  const post = await getNode("post", "post-one")
  expect(post.frontMatter.title).toBe("Post One")
  expect(post.url).toBe("/blog/post-one")

  const author = await getNode("author", "john-doe")
  expect(author.frontMatter.name).toBe("John Doe")
  expect(author.url).toBe("/authors/john-doe")
})

test("node relationships are properly attached", async () => {
  const post = await getNode("post", "post-one")
  expect(post.relationships.author.length).toBe(2)
  expect(post.relationships.author[0].frontMatter.name).toBe("John Doe")
  expect(post.relationships.author[1].frontMatter.name).toBe("Jane Doe")
})

test("an error is thrown for an invalid source", async () => {
  await expect(getAllNodes("foo")).rejects.toThrow(
    "Type foo does not exist in next-mdx.json"
  )
})
