import remoteHydrate from "next-mdx-remote/hydrate"
import { MdxRemote } from "next-mdx-remote/types"

export interface HydrateOptions {
  components?: MdxRemote.Components
  provider?: MdxRemote.Provider
}

// Wrap next-mdx-remote/hydrate for future expansion.
// @see https://github.com/hashicorp/next-mdx-remote/pull/39
export function useHydrate(
  content: { mdx: MdxRemote.Source },
  options?: HydrateOptions
): React.ReactNode {
  return remoteHydrate(content.mdx, options)
}
