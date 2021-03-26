import Link from "next/link"
import { Post } from "types"

export interface PostsProps {
  posts: Post[]
}

export function Posts({ posts }: PostsProps) {
  return (
    <div>
      {posts.map((post) => (
        <div key={post.slug}>
          <h2>{post.frontMatter.title}</h2>
          {post.frontMatter.excerpt && <p>{post.frontMatter.excerpt}</p>}
          <Link href={post.url}>Learn more</Link>
          <hr />
        </div>
      ))}
    </div>
  )
}
