import { promises as fs } from "fs"
import matter from "gray-matter"
import hasha from "hasha"
import { GetStaticPropsContext } from "next"
import { Pluggable, Compiler } from "unified"
import renderToString from "next-mdx-remote/render-to-string"
import { MdxRemote } from "next-mdx-remote/types"

import { mdxCache } from "./get-cache"
import { getFiles, MdxFile } from "./get-files"
import { getConfig, getSourceConfig } from "./get-config"

export type NodeFrontMatter = Record<string, unknown>

// TODO: Properly type node relationships with generics.
export interface NodeRelationships<T = Node> {
  [key: string]: T[]
}

export interface Node<T = NodeFrontMatter> extends MdxFile, MdxFileData<T> {
  mdx: MdxRemote.Source
  relationships?: NodeRelationships
}

// type MdxNodeWithoutMdx<T extends Node> = Omit<T, "mdx">

export interface MdxNode<T = NodeFrontMatter> extends Node<T> {}

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

export interface MdxFileData<T = NodeFrontMatter> {
  hash: string
  frontMatter?: T
  content?: string
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

export async function getNode<T extends Node>(
  sourceName: string,
  slug: string
): Promise<T> {
  const files = await getFiles(sourceName)

  if (!files.length) return null

  const [file] = files.filter((file) => file.slug === slug)

  if (!file) return null

  const node = await buildNodeFromFile(file)

  return <T>{
    ...node,
    relationships: await getNodeRelationships(node),
  }
}

export async function getAllNodes<T extends Node>(
  sourceName: string
): Promise<T[]> {
  const files = await getFiles(sourceName)

  if (!files.length) return []

  return Promise.all<T>(
    files.map(async (file) => {
      const node = await buildNodeFromFile(file)

      return <T>{
        ...node,
        relationships: await getNodeRelationships(node),
      }
    })
  )
}

async function buildNodeFromFile<T extends Node>(file: MdxFile): Promise<T> {
  return <T>{
    ...file,
    ...(await getFileData(file)),
    mdx: {
      compiledSource: "",
      renderedOutput: "",
    },
  }
}

export async function getFileData(file: MdxFile): Promise<MdxFileData> {
  const raw = await fs.readFile(file.filepath, "utf-8")
  const hash = hasha(raw.toString())

  const cachedContent = mdxCache.get<MdxFileData>(hash)
  if (cachedContent?.hash === hash) {
    return cachedContent
  }

  const { content, data: frontMatter } = matter(raw)

  const fileData: MdxFileData = {
    hash,
    content,
    frontMatter,
  }

  mdxCache.set<MdxFileData>(hash, fileData)

  return fileData
}

async function getNodeRelationships(node: Node): Promise<NodeRelationships> {
  const relationships: NodeRelationships = {}
  const config = await getConfig()

  for (const key of Object.keys(node.frontMatter)) {
    if (!config[key]) continue

    const values = node.frontMatter[key]

    if (!values) continue

    const valueAsArray: string[] = Array.isArray(values) ? values : [values]
    relationships[key] = await Promise.all(
      valueAsArray.map(async (value) => await getNode(key, value))
    )
  }

  return relationships
}
