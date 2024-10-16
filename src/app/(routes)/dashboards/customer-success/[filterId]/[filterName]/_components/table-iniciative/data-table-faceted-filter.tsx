import { CheckIcon, PlusCircledIcon } from '@radix-ui/react-icons';
import type { Column } from '@tanstack/react-table';
import type * as React from 'react';

import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

import { Button } from '@/components/ui/button';
import {
	Command,
	CommandEmpty,
	CommandGroup,
	CommandInput,
	CommandItem,
	CommandList,
	CommandSeparator,
} from '@/components/ui/command';
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from '@/components/ui/popover';
import { Separator } from '@/components/ui/separator';

interface DataTableFacetedFilterProps<TData, TValue> {
	column?: Column<TData, TValue>;
	title?: string;
	options: {
		label: string;
		value: string;
		icon?: React.ComponentType<{
			className?: string;
			style?: React.CSSProperties;
		}>;
		color?: string;
	}[];
}

export function DataTableFacetedFilter<TData, TValue>({
	column,
	title,
	options,
}: DataTableFacetedFilterProps<TData, TValue>) {
	const facets = column?.getFacetedUniqueValues();
	const selectedValues = new Set(column?.getFilterValue() as string[]);

	// Função auxiliar para calcular somas agrupadas
	const calculateGroupedSums = () => {
		const groupedSums: Record<string, number> = {};

		if (facets) {
			facets.forEach((count, status) => {
				const key = status.startsWith('Impedimento')
					? 'Impedimento'
					: status.startsWith('Tarefas')
						? 'Backlog'
						: status;
				groupedSums[key] = (groupedSums[key] || 0) + count; // Agrupa ou mantém o status original
			});
		}
		return groupedSums;
	};

	const groupedSums = calculateGroupedSums();

	return (
		<Popover>
			<PopoverTrigger asChild>
				<Button variant="outline" size="sm" className="h-8 border-dashed ">
					<PlusCircledIcon className="mr-2 h-4 w-4 text-muted-foreground" />
					<span className="text-muted-foreground">{title}</span>
					{selectedValues?.size > 0 && (
						<>
							<Separator orientation="vertical" className="mx-2 h-4" />
							<Badge
								variant="secondary"
								className="rounded-sm px-1 font-normal lg:hidden"
							>
								{selectedValues.size}
							</Badge>
							<div className="hidden space-x-1 lg:flex">
								{selectedValues.size > 2 ? (
									<Badge
										variant="secondary"
										className="rounded-sm px-1 font-normal"
									>
										{selectedValues.size} selected
									</Badge>
								) : (
									options
										.filter((option) => selectedValues.has(option.value))
										.map((option) => (
											<Badge
												variant="secondary"
												key={option.value}
												className="rounded-sm px-1 font-normal"
											>
												{option.label}
											</Badge>
										))
								)}
							</div>
						</>
					)}
				</Button>
			</PopoverTrigger>
			<PopoverContent className="w-[250px] p-0" align="start">
				<Command>
					{/* <CommandInput placeholder={title} className="text-xs" /> */}
					<CommandList>
						<CommandEmpty>No results found.</CommandEmpty>
						<CommandGroup>
							{options.map((option) => {
								const isSelected = selectedValues.has(option.value);

								return (
									<CommandItem
										key={option.value}
										onSelect={() => {
											if (isSelected) {
												selectedValues.delete(option.value);
											} else {
												selectedValues.add(option.value);
											}
											const filterValues = Array.from(selectedValues);
											column?.setFilterValue(
												filterValues.length ? filterValues : undefined,
											);
										}}
									>
										<div
											className={cn(
												'mr-2 flex h-4 w-4 items-center justify-center rounded-sm border border-primary',
												isSelected
													? 'bg-primary text-primary-foreground'
													: 'opacity-50 [&_svg]:invisible',
											)}
										>
											<CheckIcon className={cn('h-4 w-4')} />
										</div>
										{option.icon && (
											<option.icon
												className="mr-2 h-4 w-4 text-muted-foreground"
												style={{ color: option.color }}
											/>
										)}
										<span className="text-xs">{option.label}</span>
										{groupedSums[option.value] && (
											<span className="ml-auto flex h-4 w-4 items-center justify-center font-mono text-xs">
												{groupedSums[option.value]} {/* Exibe a soma */}
											</span>
										)}
									</CommandItem>
								);
							})}
						</CommandGroup>
						{selectedValues.size > 0 && (
							<>
								<CommandSeparator />
								<CommandGroup>
									<CommandItem
										onSelect={() => column?.setFilterValue(undefined)}
										className="justify-center text-center text-xs text-red-500"
									>
										Limpar filtros
									</CommandItem>
								</CommandGroup>
							</>
						)}
					</CommandList>
				</Command>
			</PopoverContent>
		</Popover>
	);
}
