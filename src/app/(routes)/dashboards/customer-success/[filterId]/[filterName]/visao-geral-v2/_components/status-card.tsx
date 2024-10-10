export function StatusCard({
	icon,
	label,
	count,
	color,
}: { icon: React.ReactNode; label: string; count: number; color: string }) {
	return (
		<div className="flex items-center justify-between">
			<div className="flex items-center gap-2">
				<div
					className={`flex h-8 w-8 items-center justify-center rounded-full bg-${color}/10`}
				>
					{icon}
				</div>
				<span className="text-sm font-medium">{label}</span>
			</div>
			<div className="mx-8 flex-grow border-b border-dotted border-muted-foreground/20" />
			<span className="text-sm font-bold text-[#19284D]">{count}</span>
		</div>
	);
}
