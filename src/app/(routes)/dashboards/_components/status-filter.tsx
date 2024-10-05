import { Button } from '@/components/ui/button';
import {
	Command,
	CommandGroup,
	CommandItem,
	CommandList,
} from '@/components/ui/command';
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from '@/components/ui/popover';
import { CheckIcon } from '@radix-ui/react-icons';
import { Lock, LockOpen } from 'lucide-react';
import type * as React from 'react';

interface StatusFilterProps {
	selectedStatus: Set<string>;
	setSelectedStatus: (statuses: Set<string>) => void;
}

export function StatusFilter({
	selectedStatus,
	setSelectedStatus,
}: StatusFilterProps) {
	const statuses = [
		{
			id: 'liberados',
			label: 'Liberados',
			icon: <LockOpen className="h-4 w-4 mr-2" />,
		},
		{
			id: 'bloqueados',
			label: 'Bloqueados',
			icon: <Lock className="h-4 w-4 mr-2" />,
		},
	];

	return (
		<Popover>
			<PopoverTrigger asChild>
				<Button variant="outline" size="sm" className="h-8 border-dashed">
					Selecionar Status
				</Button>
			</PopoverTrigger>
			<PopoverContent className="w-[250px] p-0" align="start">
				<Command>
					<CommandList>
						<CommandGroup>
							{statuses.map((status) => {
								const isSelected = selectedStatus.has(status.id);
								return (
									<CommandItem
										key={status.id}
										onSelect={() => {
											const updatedStatus = new Set(selectedStatus);
											if (isSelected) {
												// Remove o status se já estiver selecionado
												updatedStatus.delete(status.id);
											} else {
												// Adiciona o status se não estiver selecionado
												updatedStatus.add(status.id);
											}
											setSelectedStatus(updatedStatus);
										}}
									>
										<div className="flex items-center">
											{status.icon}
											<span>{status.label}</span>
											{isSelected && (
												<CheckIcon className="ml-auto h-4 w-4 text-green-500" />
											)}
										</div>
									</CommandItem>
								);
							})}
						</CommandGroup>
					</CommandList>
				</Command>
			</PopoverContent>
		</Popover>
	);
}
