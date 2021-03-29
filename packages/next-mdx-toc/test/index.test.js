import fs from "fs"
import path from "path"
import { getTableOfContents } from "../src"

const doc = fs.readFileSync(
  path.join(__dirname, "./__fixtures__/example.mdx"),
  "utf8"
)

const node = {
  content: doc,
}

test("returns toc tree from node", async () => {
  expect(await getTableOfContents(node)).toMatchSnapshot()
})
