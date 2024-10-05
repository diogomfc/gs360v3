import { Button } from '@/components/ui/button';
import {
	Command,
	CommandEmpty,
	CommandGroup,
	CommandInput,
	CommandItem,
	CommandList,
} from '@/components/ui/command';
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from '@/components/ui/popover';
import { CheckIcon } from '@radix-ui/react-icons';
import type * as React from 'react';

interface OwnerFilterProps {
	owners: {
		id: string;
		name: string;
		avatarUrl: string;
	}[];
	selectedOwnerIds: Set<string>;
	setSelectedOwnerIds: (ids: Set<string>) => void;
}

export function OwnerFilter({
	owners,
	selectedOwnerIds,
	setSelectedOwnerIds,
}: OwnerFilterProps) {
	// Agrupando os donos por nome
	const groupedOwners = owners.reduce(
		(acc, owner) => {
			if (!acc[owner.name]) {
				acc[owner.name] = {
					id: owner.id,
					avatarUrl: owner.avatarUrl,
				};
			}
			return acc;
		},
		{} as Record<string, { id: string; avatarUrl: string }>,
	);

	const uniqueOwners = Object.entries(groupedOwners).map(
		([name, { id, avatarUrl }]) => ({
			name,
			id,
			avatarUrl,
		}),
	);

	return (
		<Popover>
			<PopoverTrigger asChild>
				<Button variant="outline" size="sm" className="h-8 border-dashed">
					Selecionar Donos
				</Button>
			</PopoverTrigger>
			<PopoverContent className="w-[250px] p-0" align="start">
				<Command>
					<CommandInput placeholder="Buscar dono..." />
					<CommandList>
						<CommandEmpty>No results found.</CommandEmpty>
						<CommandGroup>
							{uniqueOwners.map((owner) => {
								const isSelected = selectedOwnerIds.has(owner.id);
								return (
									<CommandItem
										key={owner.id}
										onSelect={() => {
											if (isSelected) {
												selectedOwnerIds.delete(owner.id);
											} else {
												selectedOwnerIds.add(owner.id);
											}
											setSelectedOwnerIds(new Set(selectedOwnerIds)); // Atualiza o estado com o novo conjunto
										}}
									>
										<div className="flex items-center">
											<img
												src={owner.avatarUrl}
												alt={owner.name}
												className="h-6 w-6 rounded-full mr-2"
											/>
											<span>{owner.name}</span>
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
