import { useState } from 'preact/hooks';

type Props = {
	initial?: number;
};

export default function CounterIsland({ initial = 0 }: Props) {
	const [count, setCount] = useState(initial);

	return (
		<div className="inline-flex items-center gap-2">
			<button
				type="button"
				className="inline-flex h-9 items-center justify-center rounded-md border border-input bg-background px-3 text-sm shadow-xs hover:bg-accent hover:text-accent-foreground"
				onClick={() => setCount((c) => c + 1)}
			>
				+1
			</button>
			<span className="text-sm">Count: {count}</span>
		</div>
	);
}
