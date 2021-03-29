import remark from "remark"
import toc from "mdast-util-toc"
import visit from "unist-util-visit"
import { MdxNode } from "next-mdx"

interface Item {
  title: string
  url: string
  items?: Item[]
}

interface Items {
  items?: Item[]
}

function getItems(node, current): Items {
  if (!node) {
    return {}
  }

  if (node.type === "paragraph") {
    visit(node, (item) => {
      if (item.type === "link") {
        current.url = item.url
      }

      if (item.type === "text") {
        current.title = item.value
      }
    })

    return current
  }

  if (node.type === "list") {
    current.items = node.children.map((i) => getItems(i, {}))

    return current
  } else if (node.type === "listItem") {
    const heading = getItems(node.children[0], {})

    if (node.children.length > 1) {
      getItems(node.children[1], heading)
    }

    return heading
  }

  return {}
}

const getToc = () => (node, file) => {
  const table = toc(node)
  file.data = getItems(table.map, {})
}

export interface TableOfContents extends Items {}

export async function getTableOfContents(
  node: MdxNode
): Promise<TableOfContents> {
  const result = await remark().use(getToc).process(node.content)

  return result.data
}
