import { Skeleton } from '@/components/ui/skeleton';

export function SkeletonCardDashboards() {
	return (
		<div className="bg-white shadow-md rounded-lg p-4 w-[400px] space-y-4">
			{/* Header do Card */}
			<div className="flex items-center gap-4">
				<Skeleton className="h-10 w-10 rounded-full" />
				<div className="space-y-2">
					<Skeleton className="h-4 w-[300px]" />
					<Skeleton className="h-4 w-[250px]" />
				</div>
			</div>

			{/* Rodapé com detalhes do autor e botão */}
			<div className="flex items-center justify-between">
				<div className="flex items-center gap-2 p-1 rounded-full bg-[#F0F6FF]">
					<Skeleton className="h-6 w-6 rounded-full" />
					<Skeleton className="h-4 w-[100px]" />
				</div>
				<Skeleton className="h-8 w-[100px] rounded-full" />
			</div>
		</div>
	);
}
