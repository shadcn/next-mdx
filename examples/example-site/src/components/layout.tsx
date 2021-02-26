export function Layout({ children }) {
  return (
    <div
      style={{
        maxWidth: "800px",
        margin: "0 auto",
      }}
    >
      <main>{children}</main>
    </div>
  )
}
