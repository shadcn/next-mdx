import { Layout } from "@/components/layout"
import { PostTeaser } from "@/components/post-teaser"
import { getAllNodes, getMdxPaths, getNode } from "next-mdx"
import { Category, Post } from "types"

export interface CategoryPageProps {
  category: Category
  posts?: Post[]
}

export default function CategoryPage({ category, posts }: CategoryPageProps) {
  return (
    <Layout>
      <div variant="container" py="10|12">
        <h1 variant="heading.h1">{category.frontMatter.name}</h1>
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
    paths: await getMdxPaths("category"),
    fallback: false,
  }
}

export async function getStaticProps(context) {
  const category = await getNode<Category>("category", context)

  if (!category) {
    return {
      notFound: true,
    }
  }

  const posts = await getAllNodes<Post>("post")

  return {
    props: {
      category,
      posts: posts.filter((post) =>
        post.relationships.category.some(({ slug }) => slug === category.slug)
      ),
    },
  }
}
