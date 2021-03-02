export function Greet({ name }: { name: string }) {
  return name ? <p>Hello {name}!</p> : null
}
