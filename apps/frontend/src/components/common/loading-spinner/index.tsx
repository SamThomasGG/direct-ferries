export function LoadingSpinner() {
  return (
    <output
      className="flex justify-center items-center py-12"
      aria-label="Loading search results"
    >
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      <span className="sr-only">Loading...</span>
    </output>
  );
}
