import remoteHydrate from "next-mdx-remote/hydrate"
import { MdxRemote } from "next-mdx-remote/types"

export interface HydrateOptions {
  components?: MdxRemote.Components
  provider?: MdxRemote.Provider
}

// Wrap next-mdx-remote/hydrate for future expansion.
export function hydrate(
  content: { mdx: MdxRemote.Source },
  options?: HydrateOptions
): React.ReactNode {
  return remoteHydrate(content.mdx, options)
}
