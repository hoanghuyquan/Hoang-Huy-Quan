export function Loading({ isLoading }: { isLoading: boolean }) {
  return isLoading ? (
    <div className='spinner-border' role='status'>
      <span className='sr-only'>Loading...</span>
    </div>
  ) : null
}
