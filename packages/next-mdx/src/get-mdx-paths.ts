import { getAllNodes, Node } from "./get-nodes"

export interface MdxPath extends Node {
  params: {
    slug: string[]
  }
}

export async function getMdxPathsRaw(sourceName: string): Promise<MdxPath[]> {
  const nodes = await getAllNodes(sourceName)

  if (!nodes.length) return []

  return await Promise.all<MdxPath>(
    nodes.map(async (node) => {
      return {
        ...node,
        params: {
          slug: node.slug.split("/"),
        },
      }
    })
  )
}

export async function getMdxPaths(
  sourceName: string
): Promise<Pick<MdxPath, "params">[]> {
  const paths = await getMdxPathsRaw(sourceName)
  return paths.map(({ params }) => ({ params }))
}
