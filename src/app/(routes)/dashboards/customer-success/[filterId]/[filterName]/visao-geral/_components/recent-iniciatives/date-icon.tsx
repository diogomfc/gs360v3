import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Calendar } from 'lucide-react';

interface DateIconProps {
	endDate: string;
	remainingDays: string;
	color: string;
	bgColorClass: string;
}

export function DateIcon({
	endDate,
	remainingDays,
	color,
	bgColorClass,
}: DateIconProps) {
	// Converte a data para um formato legível
	const endDateISO = new Date(endDate);
	const formattedEndDate = Number.isNaN(endDateISO.getTime())
		? '-- --'
		: format(endDateISO, 'dd MMM', { locale: ptBR });

	return (
		<div
			className={`flex flex-col items-center justify-center rounded-sm border ${bgColorClass} p-1 w-full max-w-[120px]`}
		>
			{/* Icone do calendário com data sobreposta */}

			<div className="flex w-16 items-center justify-center gap-1 rounded-t-sm ">
				<Calendar size={14} className={`${color}`} />
				<span className={`text-xs font-semibold ${color}`}>
					{formattedEndDate}
				</span>
			</div>

			{/* Texto com dias restantes */}
			<span className={`text-xs font-light ${color}`}>{remainingDays}</span>
		</div>
	);
}
