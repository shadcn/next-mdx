import Link from "next/link"

interface LayoutProps {
  children?: React.ReactNode
}

export function Layout({ children }: LayoutProps) {
  return (
    <div
      style={{
        maxWidth: 800,
        margin: "0 auto",
      }}
    >
      <header
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr 1fr 1fr",
        }}
      >
        <Link href="/">
          <a>Home</a>
        </Link>
        <Link href="/about">
          <a>About</a>
        </Link>
        <Link href="/categories/travel">
          <a>Travel</a>
        </Link>
        <Link href="/categories/writing">
          <a>Writing</a>
        </Link>
      </header>
      <main>{children}</main>
    </div>
  )
}
