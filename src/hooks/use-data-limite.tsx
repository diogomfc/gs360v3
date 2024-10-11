import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { useMemo } from 'react';

interface UseDataLimiteProps {
	dataLimite: string;
}

export const useDataLimite = ({ dataLimite }: UseDataLimiteProps) => {
	const {
		formattedEndDate,
		daysLeft,
		daysLeftText,
		textColorClass,
		bgColorClass,
	} = useMemo(() => {
		const currentDate = new Date();

		// Converte a data para um formato legível
		const endDateISO = new Date(dataLimite + 'T00:00:00');
		const formattedEndDate = Number.isNaN(endDateISO.getTime())
			? '-- --'
			: format(endDateISO, 'dd MMM', { locale: ptBR });

		// Cálculo da diferença em dias entre a data atual e a data limite
		const timeDiff = endDateISO.getTime() - currentDate.getTime();
		const daysLeft = Math.ceil(timeDiff / (1000 * 60 * 60 * 24)); // Converter de milissegundos para dias

		// Verifica se a data já passou ou se ainda há dias restantes
		const daysLeftText =
			daysLeft > 0
				? `${daysLeft} dias restantes`
				: daysLeft === 0
					? 'Último dia'
					: 'Data expirada';

		// Definição de classes baseadas nos dias restantes
		let textColorClass = 'text-blue-500';
		let bgColorClass = 'bg-white';

		if (daysLeft > 0) {
			bgColorClass = 'bg-blue-50'; // Dentro do prazo
		} else if (daysLeft === 0) {
			bgColorClass = 'bg-yellow-100'; // Último dia
			textColorClass = 'text-yellow-800'; // Para destacar o texto
		} else {
			bgColorClass = 'bg-red-50'; // Data expirada
			textColorClass = 'text-red-800'; // Para destacar o texto
		}

		return {
			formattedEndDate,
			daysLeft,
			daysLeftText,
			textColorClass,
			bgColorClass,
		};
	}, [dataLimite]);

	return {
		formattedEndDate,
		daysLeft,
		daysLeftText,
		textColorClass,
		bgColorClass,
	};
};
