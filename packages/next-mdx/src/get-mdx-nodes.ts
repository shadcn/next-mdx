import renderToString from "next-mdx-remote/render-to-string"
import { MdxRemote } from "next-mdx-remote/types"
import { GetStaticPropsContext } from "next"
import { Pluggable, Compiler } from "unified"
import { getAllNodes, getNode, Node } from "./get-node"
import { getConfig, getSourceConfig } from "./get-config"

// TODO: Properly type node relationships with generics.
export interface MdxNodeRelationships<T = MdxNode> {
  [key: string]: T[]
}

export interface MdxNode<T = Record<string, unknown>> extends Node<T> {
  mdx: MdxRemote.Source
  relationships?: MdxNodeRelationships
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

export interface getAllMdxNodesParams extends MdxParams {
  sortBy?: string
  sortOrder?: "asc" | "desc"
}

export async function getMdxNode<T extends MdxNode>(
  sourceName: string,
  context: string | GetStaticPropsContext<NodeJS.Dict<string[]>>,
  params?: MdxParams
): Promise<T> {
  if (!context || (typeof context !== "string" && !context.params?.slug)) {
    new Error(`slug params missing from context`)
  }

  const slug =
    typeof context === "string" ? context : context.params.slug.join("/")

  const node = await getNode(sourceName, slug)

  if (!node) return null

  return <T>{
    ...node,
    mdx: await renderNodeMdx(node, params),
    relationships: await getNodeRelationships(node),
  }
}

export async function getAllMdxNodes<T extends MdxNode>(
  sourceName: string,
  params?: getAllMdxNodesParams
): Promise<T[]> {
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
      mdx: await renderNodeMdx(node, params),
      relationships: await getNodeRelationships(node),
    }))
  )

  const adjust = params.sortOrder === "desc" ? -1 : 1
  return <T[]>mdxContent.sort((a, b) => {
    if (a.frontMatter[params.sortBy] < b.frontMatter[params.sortBy]) {
      return -1 * adjust
    }
    if (a.frontMatter[params.sortBy] > b.frontMatter[params.sortBy]) {
      return 1 * adjust
    }
    return 0
  })
}

async function renderNodeMdx(node: Node, params?: MdxParams) {
  return await renderToString(node.content, {
    ...params,
    scope: {
      ...params?.scope,
      ...node.frontMatter,
    },
  })
}

async function getNodeRelationships(node: Node): Promise<MdxNodeRelationships> {
  const relationships: MdxNodeRelationships = {}
  const config = await getConfig()

  for (const key of Object.keys(node.frontMatter)) {
    if (!config[key]) continue

    const values = node.frontMatter[key]

    if (!values) continue

    const valueAsArray: string[] = Array.isArray(values) ? values : [values]
    relationships[key] = await Promise.all(
      valueAsArray.map(async (value) => await getMdxNode(key, value))
    )
  }

  return relationships
}
