import { useState } from 'preact/hooks';

type Props = {
  initial?: number;
};

export default function CounterIsland({ initial = 0 }: Props) {
  const [count, setCount] = useState(initial);

  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-center justify-between gap-3 sm:justify-start">
        <div className="flex items-center gap-2">
          <button
            type="button"
            className="inline-flex h-9 w-9 cursor-pointer select-none items-center justify-center rounded-md border border-primary/30 bg-primary text-sm font-semibold text-primary-foreground shadow-sm transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background active:translate-y-px"
            onClick={() => setCount((c) => c + 1)}
            aria-label="Increment"
            title="Increment"
          >
            +1
          </button>
          <button
            type="button"
            className="inline-flex h-9 w-9 cursor-pointer select-none items-center justify-center rounded-md border border-border bg-background text-sm font-semibold text-foreground shadow-sm transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background active:translate-y-px"
            onClick={() => setCount(initial)}
            aria-label="Reset"
            title="Reset"
          >
            ↺
          </button>
        </div>

        <div className="min-w-0">
          <div className="text-sm font-medium text-foreground">Counter</div>
          <div className="text-sm text-muted-foreground">
            Count: <span className="font-semibold text-foreground">{count}</span>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-end gap-2">
        <span className="rounded-md bg-muted px-2 py-0.5 text-xs text-muted-foreground">
          hydrates on visible
        </span>
      </div>
    </div>
  );
}
