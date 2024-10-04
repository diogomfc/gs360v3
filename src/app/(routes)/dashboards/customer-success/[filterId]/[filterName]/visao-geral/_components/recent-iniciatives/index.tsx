import { motion } from 'framer-motion';

import { Card, CardContent } from '@/components/ui/card';

import { Dot, LucideSquareArrowOutUpRight } from 'lucide-react';
import { InitiativeItem } from './iniciative-item';

// Animação para cada item
const itemVariants = {
	hidden: { opacity: 0, y: 20 },
	visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

interface Initiative {
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
}

export function RecentInitiatives({ initiatives }: RecentInitiativesProps) {
	// Função para ordenar iniciativas por endDate
	const sortedInitiatives = initiatives.slice().sort((a, b) => {
		const dateA = new Date(a.endDate);
		const dateB = new Date(b.endDate);
		return dateB.getTime() - dateA.getTime();
	});

	return (
		<Card className="col-span-4 flex min-h-[450px] max-h-[460px] flex-col">
			<div className="rounded-t-lg bg-slate-100 px-5 py-4">
				<div className="flex justify-between">
					<div className="flex flex-row items-center justify-center">
						<h1 className="font-semibold">Recentes Iniciativas</h1>
						<div className="flex items-center justify-center pt-[2px]">
							<Dot size={16} />
							<span className="text-xs text-muted-foreground">
								Total de {initiatives.length} iniciativas
							</span>
						</div>
					</div>

					<LucideSquareArrowOutUpRight
						size={14}
						className="text-muted-foreground"
					/>
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
