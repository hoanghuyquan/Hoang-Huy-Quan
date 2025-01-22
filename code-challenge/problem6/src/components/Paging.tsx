import { Nav, Pagination } from 'react-bootstrap'

export function Paging({
  currentPage = 1,
  onChangePage = () => null,
  totalPages = 1,
}: {
  currentPage?: number
  onChangePage?: (page: number) => void
  totalPages?: number
}) {
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1)

  const renderPaginationItems = () => {
    if (totalPages <= 6) {
      return pages.map((item) => (
        <Pagination.Item
          active={item === currentPage}
          key={`page-${item}`}
          onClick={() => onChangePage(item)}
        >
          {item}
        </Pagination.Item>
      ))
    }

    const items = []

    // First three pages
    for (let i = 1; i <= 3; i++) {
      items.push(
        <Pagination.Item
          active={i === currentPage}
          key={`page-${i}`}
          onClick={() => onChangePage(i)}
        >
          {i}
        </Pagination.Item>,
      )
    }

    // Ellipsis if there are pages between 3 and currentPage - 1
    if (currentPage > 5) {
      items.push(<Pagination.Ellipsis key='start-ellipsis' />)
    }

    // Middle pages if currentPage is not within the first three pages
    if (currentPage > 3 && currentPage < totalPages - 2) {
      items.push(
        <Pagination.Item
          active
          key={`page-${currentPage}`}
          onClick={() => onChangePage(currentPage)}
        >
          {currentPage}
        </Pagination.Item>,
      )
    }

    // Ellipsis if there are pages between currentPage + 1 and totalPages - 2
    if (currentPage < totalPages - 4) {
      items.push(<Pagination.Ellipsis key='end-ellipsis' />)
    }

    // Last three pages
    for (let i = totalPages - 2; i <= totalPages; i++) {
      items.push(
        <Pagination.Item
          active={i === currentPage}
          key={`page-${i}`}
          onClick={() => onChangePage(i)}
        >
          {i}
        </Pagination.Item>,
      )
    }

    return items
  }

  return (
    <Nav>
      <Pagination className='mb-2 mb-lg-0'>
        <Pagination.First onClick={() => onChangePage(1)} />
        <Pagination.Prev onClick={() => currentPage > 1 && onChangePage(currentPage - 1)} />
        {renderPaginationItems()}
        <Pagination.Next
          onClick={() => currentPage < totalPages && onChangePage(currentPage + 1)}
        />
        <Pagination.Last onClick={() => onChangePage(totalPages)} />
      </Pagination>
    </Nav>
  )
}
