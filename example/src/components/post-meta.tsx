import Link from "next/link"
import { formatDate } from "src/utils/format-date"
import { Post } from "types"

export interface PostMetaProps {
  post: Post
}

export function PostMeta({ post, ...props }: PostMetaProps) {
  return (
    <div
      display="flex"
      flexDirection="column|row"
      fontFamily="sans"
      color="gray"
      mt="4"
      {...props}
    >
      {post.relationships.author.length ? (
        <span display="inline-block" mr="2">
          Posted by{" "}
          {post.relationships.author.map((author, index) => (
            <strong fontWeight="semibold" key={author.slug}>
              {index !== 0 && " and "}{" "}
              <Link href={author.url}>{author.frontMatter.name}</Link>
            </strong>
          ))}
        </span>
      ) : null}
      <span display="inline-block" mr="4">
        in{" "}
        {post.relationships.category.map((category, index) => (
          <span fontWeight="semibold" key={category.slug}>
            {index !== 0 && " and "}{" "}
            <Link href={category.url}>{category.frontMatter.name}</Link>
          </span>
        ))}
      </span>
      <span mt="2|0">
        <span>{formatDate(post.frontMatter.date)}</span>
      </span>
    </div>
  )
}
