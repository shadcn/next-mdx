import { Layout } from "../simple-blog/src/components/layout"
import { PostTeaser } from "../simple-blog/src/components/post-teaser"
import { getAllMdxNodes, getMdxNode, getMdxPaths } from "next-mdx"
import { Author, Post } from "../simple-blog/types"

export interface AuthorPageProps {
  author: Author
  posts?: Post[]
}

export default function AuthorPage({ author, posts }: AuthorPageProps) {
  return (
    <Layout>
      <div variant="container" py="10|12">
        <h1 variant="heading.h1">Posts by {author.frontMatter.name}</h1>
        {author.frontMatter.bio && (
          <p variant="text.lead">{author.frontMatter.bio}</p>
        )}
        {posts?.length ? (
          posts.map((post) => <PostTeaser key={post.slug} post={post} />)
        ) : (
          <p my="10">No posts found.</p>
        )}
      </div>
    </Layout>
  )
}

export async function getStaticPaths() {
  return {
    paths: await getMdxPaths("authors"),
    fallback: false,
  }
}

export async function getStaticProps(context) {
  const author = await getMdxNode<Author>("authors", context)

  if (!author) {
    return {
      notFound: true,
    }
  }

  const posts = await getAllMdxNodes<Post>("post")

  return {
    props: {
      author,
      posts: posts.filter((post) =>
        post.relationships.author.some(({ slug }) => slug === author.slug)
      ),
    },
  }
}
