type Props = {
  name: string;
};

export default function ServerOnlyHello({ name }: Props) {
  return (
    <div className="flex items-center justify-between gap-3">
      <p className="text-sm text-muted-foreground">
        <span className="font-medium text-foreground">Server-rendered:</span> Hello, {name}.
      </p>
      <span className="rounded-md bg-muted px-2 py-0.5 text-xs text-muted-foreground">
        no hydration
      </span>
    </div>
  );
}
