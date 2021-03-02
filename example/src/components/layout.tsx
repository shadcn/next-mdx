import Link from "next/link"

export function Layout({ children }) {
  return (
    <div
      style={{
        maxWidth: "800px",
        margin: "0 auto",
      }}
    >
      <nav
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr 1fr",
        }}
      >
        <Link href="/">
          <a>Home</a>
        </Link>
        <Link href="/blog">
          <a>Blog</a>
        </Link>
        <Link href="/about">
          <a>About</a>
        </Link>
      </nav>
      <main>{children}</main>
    </div>
  )
}
