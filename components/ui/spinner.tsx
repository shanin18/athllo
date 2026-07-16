export function Spinner({ className = "" }: { className?: string }) {
  return (
    <div className={`flex min-h-[40vh] w-full items-center justify-center ${className}`}>
      <div className="h-8 w-8 animate-spin rounded-full border-2 border-line border-t-brand" />
    </div>
  );
}
