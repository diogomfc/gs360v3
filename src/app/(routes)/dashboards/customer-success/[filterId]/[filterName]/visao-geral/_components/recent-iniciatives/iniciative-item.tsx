import { FileClock } from 'lucide-react';
import { useRouter } from 'next/navigation';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

import { logosCliente, statuses } from '../../../data';
import { DateIcon } from './date-icon';

// Função para calcular o progresso da iniciativa
function calculateDateStatus(endDate: string): {
	color: string;
	bgColorClass: string;
	text: string;
} {
	const end = new Date(endDate);
	const now = new Date();

	// Verifica se a data de término é inválida
	if (Number.isNaN(end.getTime())) {
		return {
			color: 'text-red-400',
			text: 'a definir',
			bgColorClass: 'bg-red-100',
		};
	}

	// Cálculo dos dias restantes
	const remainingDays = Math.ceil(
		(end.getTime() - now.getTime()) / (1000 * 3600 * 24),
	);

	let color = 'text-blue-500'; // Cor padrão para dias restantes
	let bgColorClass = 'bg-white'; // Cor de fundo padrão
	let text = `${remainingDays} dias restantes`; // Texto padrão

	// Define cores e textos com base nos dias restantes
	if (remainingDays > 0) {
		color = 'text-blue-500'; // Dentro do prazo
		text = `${remainingDays} dias restantes`;
		bgColorClass = 'bg-blue-50';
	} else if (remainingDays === 0) {
		color = 'text-yellow-800'; // Último dia
		bgColorClass = 'bg-yellow-100';
		text = 'Último dia';
	} else {
		color = 'text-red-800'; // Data expirada
		bgColorClass = 'bg-red-50';
		text = 'Data expirada';
	}

	return { color, bgColorClass, text };
}

// Função para obter o logo do cliente a partir dos dados centralizados
function getLogoByCliente(cliente: string) {
	const normalizedCliente = cliente.trim().toLowerCase();
	const logoData = logosCliente.find(
		(logoItem) => logoItem.cliente.trim().toLowerCase() === normalizedCliente,
	);
	return logoData ? logoData.logo : ''; // Retorna o logo se encontrado
}

// Função para obter os detalhes do status a partir do arquivo centralizado
function getStatusDetails(status: string) {
	const statusDetail = statuses.find((s) => s.label === status);
	if (statusDetail) {
		return {
			icon: <statusDetail.icon size={16} color={statusDetail.color} />,
			color: statusDetail.color,
		};
	}
	// Retorna um ícone padrão caso o status não seja encontrado
	return {
		icon: <FileClock size={16} color="#9E9E9E" />,
		color: '#9E9E9E',
	};
}

interface InitiativeItemProps {
	cliente: string;
	fallback: string;
	summary: string;
	status: string;
	endDate: string;
	initiativeId: string;
}

export function InitiativeItem({
	cliente,
	fallback,
	summary,
	status,
	endDate,
	initiativeId,
}: InitiativeItemProps) {
	const router = useRouter();

	const { color, bgColorClass, text } = calculateDateStatus(endDate);
	const logo = getLogoByCliente(cliente); // Obtém o logo do cliente
	const { icon: statusIcon, color: statusColor } = getStatusDetails(status); // Obtém os detalhes do status

	const handleClick = (): void => {
		router.push(`/initiatives/${initiativeId}`);
	};

	return (
		<div
			onClick={handleClick}
			onKeyUp={handleClick}
			className="flex cursor-pointer items-center justify-between rounded-md border-b border-muted p-2 transition-colors duration-200 hover:bg-muted"
		>
			<div className="flex items-center">
				<Avatar className="flex h-9 w-9 items-center justify-center space-y-0 border">
					<AvatarImage src={logo} alt="Avatar" className="h-6 w-6" />
					<AvatarFallback>{fallback}</AvatarFallback>
				</Avatar>
				<div className="ml-4 space-y-1">
					<div className="text-xs font-medium leading-none sm:max-w-[200px] md:max-w-[400px] lg:max-w-[350px] truncate">
						{summary}
					</div>
					<div
						className="flex items-center gap-2"
						style={{ color: statusColor }}
					>
						{statusIcon}
						<span className="text-xs">{status}</span>
					</div>
				</div>
			</div>
			<DateIcon
				endDate={endDate}
				remainingDays={text}
				color={color}
				bgColorClass={bgColorClass}
			/>
		</div>
	);
}
