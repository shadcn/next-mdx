import { promises as fs } from "fs"
import matter from "gray-matter"
import hasha from "hasha"
import { getConfig } from "./get-config"
import { MdxCache } from "./get-cache"
import { getFiles, MdxFile } from "./get-files"

export interface NodeRelationships {
  [key: string]: Node[]
}

export interface MdxFileData<T = Record<string, string | string[]>> {
  hash: string
  frontMatter?: T
  content?: string
  relationships?: NodeRelationships
}

export interface Node<T = Record<string, string | string[]>>
  extends MdxFile,
    MdxFileData<T> {}

export async function getNode(sourceName: string, slug: string): Promise<Node> {
  const files = await getFiles(sourceName)

  if (!files.length) return null

  const [file] = files.filter((file) => file.slug === slug)

  if (!file) return null

  return {
    ...file,
    ...(await getFileData(file)),
  }
}

export async function getAllNodes(sourceName: string): Promise<Node[]> {
  const files = await getFiles(sourceName)

  if (!files.length) return []

  return Promise.all(
    files.map(async (file) => ({
      ...file,
      ...(await getFileData(file)),
    }))
  )
}

export interface GetFileDataParams {
  withRelationships?: boolean
}

export async function getFileData(
  file: MdxFile,
  params: GetFileDataParams = { withRelationships: true }
): Promise<MdxFileData> {
  const raw = await fs.readFile(file.filepath, "utf-8")
  const hash = hasha(raw.toString())

  const cachedContent = MdxCache.get<MdxFileData>(hash)
  if (cachedContent && cachedContent.hash === hash) {
    return cachedContent
  }

  const config = await getConfig()
  const { content, data: frontMatter } = matter(raw)

  const relationships: NodeRelationships = {}

  if (params?.withRelationships) {
    for (const key of Object.keys(frontMatter)) {
      if (!config[key]) continue

      const values = frontMatter[key]

      if (!values) continue

      const valueAsArray: string[] = Array.isArray(values) ? values : [values]
      relationships[key] = await Promise.all(
        valueAsArray.map(async (value) => await getNode(key, value))
      )
    }
  }

  const fileData: MdxFileData = {
    hash,
    content,
    frontMatter,
    relationships,
  }

  MdxCache.set<MdxFileData>(hash, fileData)

  return fileData
}
