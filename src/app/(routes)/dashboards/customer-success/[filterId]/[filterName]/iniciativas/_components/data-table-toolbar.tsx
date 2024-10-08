'use client';

import { Cross2Icon } from '@radix-ui/react-icons';
import type { Table } from '@tanstack/react-table';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

import { priorities, statuses } from '../../../../../data';
import { mapStatus } from './columns';
import { DataTableFacetedFilter } from './data-table-faceted-filter';
import { DataTableViewOptions } from './data-table-view-options';

interface DataTableToolbarProps<TData> {
	table: Table<TData>;
}

// Cria os status unificados
const unifiedStatuses = statuses.reduce(
	(acc, status) => {
		const unifiedValue = mapStatus(status.value);
		if (!acc.find((s) => s.value === unifiedValue)) {
			acc.push({
				value: unifiedValue,
				label: unifiedValue,
				icon: status.icon,
				color: status.color,
			});
		}
		return acc;
	},

	[] as { value: string; label: string; icon?: any; color?: string }[],
);

export function DataTableToolbar<TData>({
	table,
}: DataTableToolbarProps<TData>) {
	const isFiltered = table.getState().columnFilters.length > 0;

	return (
		<div className="flex items-center justify-between ">
			<div className="flex flex-1 items-center space-x-2">
				<Input
					placeholder="Filtrar iniciativas..."
					value={(table.getColumn('summary')?.getFilterValue() as string) ?? ''}
					onChange={(event) =>
						table.getColumn('summary')?.setFilterValue(event.target.value)
					}
					className="h-8 w-[150px] lg:w-[250px] placeholder:text-[13px]"
				/>
				{table.getColumn('status') && (
					<DataTableFacetedFilter
						column={table.getColumn('status')}
						title="Status"
						options={unifiedStatuses}
					/>
				)}
				{table.getColumn('priority') && (
					<DataTableFacetedFilter
						column={table.getColumn('priority')}
						title="Prioridade"
						options={priorities}
					/>
				)}
				{isFiltered && (
					<Button
						variant="ghost"
						onClick={() => table.resetColumnFilters()}
						className="h-8 px-2 lg:px-3"
					>
						<div className="flex items-center justify-center text-red-400">
							<span className="text-xs">Limpar</span>
							<Cross2Icon className="ml-2 h-3 w-3" />
						</div>
					</Button>
				)}
			</div>
			<DataTableViewOptions table={table} />
		</div>
	);
}
