import { Card, CardContent } from '@/components/ui/card';
import { motion } from 'framer-motion';
import { Dot, LucideSquareArrowOutUpRight } from 'lucide-react';
import { useParams } from 'next/navigation';
import { InitiativeItem } from './iniciative-item';

// Animação para cada item
const itemVariants = {
	hidden: { opacity: 0, y: 20 },
	visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

export interface Initiative {
	initiativeId: string;
	summary: string;
	status: string;
	endDate: string;
	color: string;
	cliente: string;
	fallback: string;
}

interface RecentInitiativesProps {
	initiatives: Initiative[];
	status?: string; // Adiciona a prop de status opcional
}

export function ListInitiatives({
	initiatives,
	status,
}: RecentInitiativesProps) {
	const params = useParams();
	const { filterId, filterName } = params;

	// Função para agrupar os status no caso de "Backlog"
	const groupStatus = (initiativeStatus: string) => {
		// Verifica se o status é um dos que devem ser agrupados como "Backlog"
		if (
			[
				'Tarefas Onboarding',
				'Tarefas Ongoing',
				'Tarefas Suporte',
				'Backlog',
			].includes(initiativeStatus)
		) {
			return 'Backlog';
		}
		// Verifica se o status é um dos que devem ser agrupados como "Impedimento"
		if (
			[
				'Impedimento Onboarding',
				'Impedimento Ongoing',
				'Impedimento Suporte',
			].includes(initiativeStatus)
		) {
			return 'Impedimento';
		}

		return initiativeStatus; // Retorna o status original se não for agrupado
	};

	// Agrupar os status antes de qualquer filtragem
	const groupedInitiatives = initiatives.map((initiative) => ({
		...initiative,
		status: groupStatus(initiative.status), // Aplica o agrupamento de status
	}));

	// Filtrar as iniciativas com base no status passado, se houver
	const filteredInitiatives = status
		? groupedInitiatives.filter((initiative) => initiative.status === status)
		: groupedInitiatives; // Se nenhum status for passado, retorna todas as iniciativas

	// Função para ordenar iniciativas por endDate
	const sortedInitiatives = filteredInitiatives.slice().sort((a, b) => {
		const dateA = new Date(a.endDate);
		const dateB = new Date(b.endDate);
		return dateB.getTime() - dateA.getTime();
	});

	return (
		<Card className="col-span-4 flex min-h-[550px] max-h-[460px] flex-col">
			<div className="rounded-t-lg bg-slate-100 px-5 py-4">
				<div className="flex justify-between">
					<div className="flex flex-row items-center justify-center">
						<h1 className="font-semibold">Recentes Iniciativas</h1>
						<div className="flex items-center justify-center pt-[2px]">
							<Dot size={16} />
							<span className="text-xs text-muted-foreground">
								Total de {filteredInitiatives.length} iniciativas
							</span>
						</div>
					</div>

					<a
						href={`/dashboards/customer-success/${filterId}/${filterName}/iniciativas`}
					>
						<LucideSquareArrowOutUpRight
							size={14}
							className="text-muted-foreground"
						/>
					</a>
				</div>
			</div>

			<CardContent className="mb-3 flex-grow overflow-y-auto pt-3">
				<motion.div
					initial="hidden"
					animate="visible"
					variants={{
						visible: {
							transition: { staggerChildren: 0.2 },
						},
					}}
				>
					{sortedInitiatives.map((initiative) => (
						<motion.div key={initiative.initiativeId} variants={itemVariants}>
							<InitiativeItem
								cliente={initiative.cliente}
								fallback={initiative.fallback}
								summary={initiative.summary}
								status={initiative.status}
								endDate={initiative.endDate}
								initiativeId={initiative.initiativeId}
							/>
						</motion.div>
					))}
				</motion.div>
			</CardContent>
		</Card>
	);
}
