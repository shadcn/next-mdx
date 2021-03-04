import { Layout } from "@/components/layout"
import { getAllMdxNodes, getMdxNode, getMdxPaths } from "next-mdx"
import Link from "next/link"
import { Category, Post } from "types"

export interface CategoryPageProps {
  category: Category
  posts?: Post[]
}

export default function CategoryPage({ category, posts }: CategoryPageProps) {
  return (
    <Layout>
      <div>
        <h1>{category.frontMatter.name}</h1>
        {posts.length ? (
          <ul>
            {posts.map((post) => (
              <li key={post.slug}>
                <Link href={post.url} passHref>
                  <a>{post.frontMatter.title}</a>
                </Link>
              </li>
            ))}
          </ul>
        ) : (
          <p>No posts found.</p>
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
  const category = await getMdxNode<Category>("category", context)

  if (!category) {
    return {
      notFound: true,
    }
  }

  const posts = await getAllMdxNodes<Post>("post")

  return {
    props: {
      category,
      posts: posts.filter((post) =>
        post.relationships.category.some(({ slug }) => slug === category.slug)
      ),
    },
  }
}
