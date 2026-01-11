type Props = {
	name: string;
};

export default function ServerOnlyHello({ name }: Props) {
	return <p className="text-sm text-muted-foreground">Hello, {name} (rendered with Preact).</p>;
}
