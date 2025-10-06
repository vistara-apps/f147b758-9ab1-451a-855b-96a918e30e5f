'use client';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="min-h-screen bg-bg flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <div className="text-6xl mb-4">😅</div>
        <h2 className="text-2xl font-bold mb-4">Oops! Something went wrong</h2>
        <p className="text-text-muted mb-6">
          Don't worry, even the best memes fail sometimes
        </p>
        <button
          onClick={reset}
          className="btn-primary"
        >
          Try Again
        </button>
      </div>
    </div>
  );
}
