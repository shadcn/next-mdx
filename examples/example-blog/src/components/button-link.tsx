import * as React from "react"

export interface ButtonLinkProps {
  href: string
  variant: string
  children: React.ReactNode
}

export function ButtonLink({
  href,
  variant = "primary",
  children,
}: ButtonLinkProps) {
  return (
    <a href={href} variant={`button.${variant}`}>
      {children}
    </a>
  )
}
