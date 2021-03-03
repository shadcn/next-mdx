import { ButtonLink } from "@/components/button-link"

export const mdxComponents = {
  h2: (props) => <h2 style={{ color: "lightgreen" }} {...props} />,
  a: (props) => (
    <a color="primary" _hover={{ textDecoration: "underline" }} {...props} />
  ),
  hr: (props) => <hr {...props} />,
  p: (props) => <p variant="text.paragraph" {...props} />,
  ul: (props) => <ul variant="list.unordered" {...props} />,
  ol: (props) => <ol variant="list.ordered" {...props} />,
  strong: (props) => <strong fontWeight="semibold" {...props} />,
  inlineCode: (props) => <code color="primary" fontSize="xl" {...props} />,
  ButtonLink,
}
