import { Greet } from "./greet"

export function Alert({ children }) {
  return (
    <button
      style={{
        backgroundColor: "tomato",
        padding: "10px",
      }}
      onClick={() => alert(children)}
    >
      {children}
    </button>
  )
}

export const mdxComponents = {
  h2: (props) => <h2 style={{ color: "lightgreen" }} {...props} />,
  Alert,
  Greet,
}
