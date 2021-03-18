import glob from "fast-glob"
import path from "path"

import { getSourceConfig } from "./get-config"

export interface MdxFile {
  filepath: string
  slug: string
  url?: string
}

export async function getFiles(sourceName: string): Promise<MdxFile[]> {
  const { contentPath, basePath } = await getSourceConfig(sourceName)
  const files = await glob(`${contentPath}/**/*.{md,mdx}`)

  if (!files.length) return []

  return files.map((filepath) => {
    let slug = filepath
      .replace(contentPath, "")
      .replace(/^\/+/, "")
      .replace(new RegExp(path.extname(filepath) + "$"), "")

    slug = slug === "index" ? "" : slug

    return {
      filepath,
      slug,
      url: basePath ? `${basePath.replace(/\/$/, "")}/${slug}` : null,
    }
  })
}
