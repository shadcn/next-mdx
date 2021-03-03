import Link from "next/link"
import { Icon } from "reflexjs"
import { Post } from "types"
import { PostMeta } from "@/components/post-meta"

export interface PostTeaserProps {
  post: Post
}

export function PostTeaser({ post, ...props }: PostTeaserProps) {
  return (
    <article {...props}>
      <hr my="12" />
      <PostMeta post={post} fontSize="sm" />
      <h2 variant="heading.h2" my="4">
        <Link href={post.url} passHref>
          <a
            color="heading"
            textDecoration="none"
            _hover={{
              color: "primary",
            }}
          >
            {post.frontMatter.title}
          </a>
        </Link>
      </h2>
      {post.frontMatter.excerpt ? (
        <p variant="text.paragraph" mt="0">
          {post.frontMatter.excerpt}
        </p>
      ) : null}
      <Link href={post.url} passHref>
        <a
          display="inline-flex"
          lineHeight="none"
          alignItems="center"
          fontSize="sm"
          color="text"
          textDecoration="none"
          _hover={{
            color: "primary",
          }}
        >
          Read more <Icon name="arrow" size="4" ml="2" />
        </a>
      </Link>
    </article>
  )
}
