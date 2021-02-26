import { promises as fs } from "fs"
import matter from "gray-matter"
import hasha from "hasha"
import renderToString from "next-mdx-remote/render-to-string"
import { MdxRemote } from "next-mdx-remote/types"
import { GetStaticPropsContext } from "next"
import { Pluggable, Compiler } from "unified"

import { MdxCache } from "./get-mdx-cache"
import { getMdxPathsRaw, MdxPath } from "./get-mdx-paths"

export interface MdxContent extends MdxPath {
  hash: string
  content: string
  url: string
  mdx: MdxRemote.Source
  frontMatter?: Record<string, unknown>
}

export interface GetMdxContentParams {
  context?: GetStaticPropsContext<NodeJS.Dict<string[]>>
  basePath?: string
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

export async function getMdxContent(
  source: string,
  params?: GetMdxContentParams
): Promise<MdxContent[]> {
  const basePath = params?.basePath
  let paths = await getMdxPathsRaw(source)

  if (params?.context) {
    const {
      params: { slug },
    } = params.context
    const slugs = [slug.join("/")]
    paths = paths.filter((mdxPath) =>
      slugs ? slugs.includes(mdxPath.slug) : true
    )
  }

  if (!paths.length) return []

  const mdxContent = await Promise.all(
    paths.map(async (mdxPath) => {
      const raw = await fs.readFile(mdxPath.filepath, "utf-8")
      const hash = hasha(raw.toString())

      const cachedContent = MdxCache.get<MdxContent>(hash)
      if (cachedContent && cachedContent.hash === hash) {
        return cachedContent
      }

      const { content, data: frontMatter } = matter(raw)

      const _mdx = await renderToString(content, {
        ...params,
        scope: {
          ...params?.scope,
          ...frontMatter,
        },
      })

      const mdxContent: MdxContent = {
        ...mdxPath,
        url: basePath ? `${basePath}/${mdxPath.slug}` : `/${mdxPath.slug}`,
        hash,
        content,
        mdx: _mdx,
        frontMatter,
      }

      MdxCache.set<MdxContent>(hash, mdxContent)

      return mdxContent
    })
  )

  return mdxContent
}
