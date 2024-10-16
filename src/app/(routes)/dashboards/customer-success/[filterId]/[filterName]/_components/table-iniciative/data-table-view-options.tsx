import { DropdownMenuTrigger } from '@radix-ui/react-dropdown-menu';
import type { Table } from '@tanstack/react-table';

import { Button } from '@/components/ui/button';
import {
	DropdownMenu,
	DropdownMenuCheckboxItem,
	DropdownMenuContent,
	DropdownMenuLabel,
	DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import { BetweenVerticalStart } from 'lucide-react';

interface DataTableViewOptionsProps<TData> {
	table: Table<TData>;
}

export function DataTableViewOptions<TData>({
	table,
}: DataTableViewOptionsProps<TData>) {
	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Button
					variant="outline"
					size="sm"
					className="ml-auto hidden h-8 lg:flex"
				>
					<BetweenVerticalStart className="mr-2 h-4 w-4 text-muted-foreground" />
					<span className="text-muted-foreground">Colunas</span>
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent align="end" className="w-[150px]">
				<DropdownMenuLabel className="text-xs font-medium">
					Adicionar colunas
				</DropdownMenuLabel>
				<DropdownMenuSeparator />
				{/* Itera pelas colunas, exceto "cliente" e "summary" que são sempre visíveis */}
				{table
					.getAllColumns()
					.filter(
						(column) =>
							typeof column.accessorFn !== 'undefined' &&
							column.getCanHide() &&
							!['cliente', 'summary'].includes(column.id), // Evita ocultar essas colunas
					)
					.map((column) => {
						const columnLabel = column.id === 'priority' ? 'Prioridade' : column.id;

						return (
							<DropdownMenuCheckboxItem
								key={column.id}
								className="capitalize text-xs text-muted-foreground"
								checked={column.getIsVisible()}
								onCheckedChange={(value) => column.toggleVisibility(!!value)}
							>
								{columnLabel}
							</DropdownMenuCheckboxItem>
						);
					})}
			</DropdownMenuContent>
		</DropdownMenu>
	);
}
