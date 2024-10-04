import {
	Tooltip,
	TooltipContent,
	TooltipTrigger,
} from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import { cloneElement, useState } from 'react';

export function NavbarLink({
	isSidebarOpen,
	icon,
	label,
	isSelected,
	href,
	iconColor, // Nova propriedade para a cor do ícone
}: {
	isSidebarOpen?: boolean;
	icon?: React.ReactNode;
	label: React.ReactNode;
	isSelected?: boolean;
	href: string;
	iconColor?: string; // Tipo para a nova propriedade
}) {
	// Estado para controlar o hover
	const [isHovered, setIsHovered] = useState(false);

	// Define a cor do ícone com base no estado de seleção e hover
	const iconProps = {
		stroke: isSelected ? iconColor : isHovered ? '#0862B1' : '#3A3A3A',
	}; // Cor do ícone quando selecionado ou em hover

	if (isSidebarOpen) {
		return (
			<Link
				href={href}
				className={cn(
					'flex items-center gap-3 rounded-lg p-3 transition-colors hover:text-[#0862B1]',
					isSelected ? 'bg-muted text-[#0862B1]' : 'text-muted-foreground',
				)}
				onMouseEnter={() => setIsHovered(true)} // Define hover como verdadeiro
				onMouseLeave={() => setIsHovered(false)} // Define hover como falso
			>
				{cloneElement(icon as React.ReactElement, iconProps)}
				{label}
			</Link>
		);
	}

	return (
		<Tooltip>
			<TooltipTrigger asChild>
				<Link
					href={href}
					className={cn(
						'flex h-9 w-9 items-center justify-center rounded-lg transition-colors hover:text-[#0862B1]',
						isSelected ? 'bg-muted text-[#0862B1]' : 'text-muted-foreground',
					)}
					onMouseEnter={() => setIsHovered(true)} // Define hover como verdadeiro
					onMouseLeave={() => setIsHovered(false)} // Define hover como falso
				>
					{cloneElement(icon as React.ReactElement, iconProps)}{' '}
					<div className="sr-only">{label}</div>
				</Link>
			</TooltipTrigger>
			<TooltipContent side="right" className="bg-muted text-[#0862B1] ">
				{label}
			</TooltipContent>
		</Tooltip>
	);
}
