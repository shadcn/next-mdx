import { promises as fs } from "fs"
import matter from "gray-matter"
import hasha from "hasha"
import { mdxCache } from "./get-cache"
import { getFiles, MdxFile } from "./get-files"

export interface MdxFileData<T = Record<string, unknown>> {
  hash: string
  frontMatter?: T
  content?: string
}

export interface Node<T = Record<string, unknown>>
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
