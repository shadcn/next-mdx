import renderToString from "next-mdx-remote/render-to-string"
import { MdxRemote } from "next-mdx-remote/types"
import { GetStaticPropsContext } from "next"
import { Pluggable, Compiler } from "unified"
import { getAllNodes, getNode, Node } from "./get-node"
import { getSourceConfig } from "./get-config"

export interface MdxNode<T = Record<string, string | string[]>>
  extends Node<T> {
  mdx: MdxRemote.Source
}

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

export interface GetMdxNodesParams extends MdxParams {
  sortBy?: string
  sortOrder?: "asc" | "desc"
}

export async function getMdxNode(
  sourceName: string,
  context: GetStaticPropsContext<NodeJS.Dict<string[]>>,
  params?: MdxParams
): Promise<MdxNode> {
  if (!context.params?.slug) {
    new Error(`slug params missing from context`)
  }

  const node = await getNode(sourceName, context.params.slug.join("/"))

  if (!node) return null

  return {
    ...node,
    mdx: await getNodeMdx(node, params),
  }
}

export async function getMdxNodes(
  sourceName: string,
  params?: GetMdxNodesParams
) {
  const { sortBy, sortOrder } = await getSourceConfig(sourceName)

  params = {
    sortBy,
    sortOrder,
    ...params,
  }

  const nodes = await getAllNodes(sourceName)

  if (!nodes.length) return []

  const mdxContent = await Promise.all<MdxNode>(
    nodes.map(async (node) => ({
      ...node,
      mdx: await getNodeMdx(node, params),
    }))
  )

  const adjust = params.sortOrder === "desc" ? -1 : 1
  return mdxContent.sort((a, b) => {
    if (a.frontMatter[params.sortBy] < b.frontMatter[params.sortBy]) {
      return -1 * adjust
    }
    if (a.frontMatter[params.sortBy] > b.frontMatter[params.sortBy]) {
      return 1 * adjust
    }
    return 0
  })
}

export async function getNodeMdx(node: Node, params?: MdxParams) {
  return await renderToString(node.content, {
    ...params,
    scope: {
      ...params?.scope,
      ...node.frontMatter,
    },
  })
}
