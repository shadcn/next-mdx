import Link from "next/link"

export interface PagerProps {
  pageNumber?: number
  totalPages: number
}

export function Pager({ pageNumber, totalPages }: PagerProps) {
  return (
    <ul>
      {pageNumber && (
        <li>
          <Link href={pageNumber === 1 ? `/` : `/${pageNumber - 1}`}>
            Previous
          </Link>
        </li>
      )}
      {pageNumber !== totalPages && (
        <li>
          <Link href={`/${(pageNumber || 0) + 1}`}>Next</Link>
        </li>
      )}
    </ul>
  )
}
