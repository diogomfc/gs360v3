import { useMemo } from 'react';

// Define a estrutura do tipo de prioridade (ajuste conforme necessário)
interface Priority {
	value: string;
	label: string;
	color: string;
	icon?: React.ElementType; 
}

interface UsePriorityProps {
	priorityValue: string;
	priorities: Priority[];
}

export const usePriority = ({
	priorityValue,
	priorities,
}: UsePriorityProps) => {
	const { priority } = useMemo(() => {
		// Busca a prioridade correspondente ao valor
		const foundPriority =
			priorities.find((priority) => priority.value === priorityValue) ||
			priorities.find((priority) => priority.value === 'P4 - Low');

		return {
			priority: foundPriority,
		};
	}, [priorityValue, priorities]);

	return {
		priority,
	};
};
