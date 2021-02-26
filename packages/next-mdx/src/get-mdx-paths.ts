import path from "path"
import glob from "fast-glob"

export interface MdxPath {
  filepath: string
  slug: string
  params: {
    slug: string[]
  }
}

export interface GetMdxPathsOptions {}

export async function getMdxPathsRaw(contentPath: string): Promise<MdxPath[]> {
  const files = glob.sync(`${contentPath}/**/*.{md,mdx}`)

  if (!files.length) return []

  return await Promise.all<MdxPath>(
    files.map(async (filepath) => {
      let slug = filepath
        .replace(contentPath, "")
        .replace(/^\/+/, "")
        .replace(new RegExp(path.extname(filepath) + "$"), "")

      slug = slug === "index" ? "" : slug

      return {
        filepath,
        slug,
        params: {
          slug: slug.split("/"),
        },
      }
    })
  )
}

export async function getMdxPaths(
  contentPath: string
): Promise<Pick<MdxPath, "params">[]> {
  const paths = await getMdxPathsRaw(contentPath)
  return paths.map(({ params }) => ({ params }))
}
