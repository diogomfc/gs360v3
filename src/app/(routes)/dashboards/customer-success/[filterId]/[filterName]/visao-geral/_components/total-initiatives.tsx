'use client';

import { motion } from 'framer-motion';
import * as React from 'react';
import { Label, Pie, PieChart } from 'recharts';

import { Card, CardContent, CardHeader } from '@/components/ui/card';
import {
	ChartContainer,
	ChartTooltip,
	ChartTooltipContent,
} from '@/components/ui/chart';
import { statuses } from '../../../../../data';

// Definindo o chartConfig para o gráfico
const chartConfig = {
	iniciativa: {
		label: 'Iniciativa',
	},
	backlog: {
		label: 'Backlog',
		color: statuses.find((status) => status.value === 'Backlog')?.color,
	},
	impedimento: {
		label: 'Impedimento',
		color: statuses.find((status) => status.value === 'Impedimento Onboarding')
			?.color,
	},
	concluido: {
		label: 'Concluído',
		color: statuses.find((status) => status.value === 'Concluído')?.color,
	},
	andamento: {
		label: 'Em andamento',
		color: statuses.find((status) => status.value === 'Em andamento')?.color,
	},
};

export function TotalInitiatives({ jiraData }: any) {
	const chartData = React.useMemo(() => {
		return [
			{
				status: 'Backlog',
				iniciativa:
					(jiraData?.statusCounts?.Backlog || 0) +
					(jiraData?.statusCounts?.['Tarefas Onboarding'] || 0) +
					(jiraData?.statusCounts?.['Tarefas Ongoing'] || 0) +
					(jiraData?.statusCounts?.['Tarefas Suporte'] || 0),
				fill: 'var(--color-backlog)',
			},
			{
				status: 'Impedimento',
				iniciativa:
					(jiraData?.statusCounts?.['Impedimento Onboarding'] || 0) +
					(jiraData?.statusCounts?.['Impedimento Ongoing'] || 0) +
					(jiraData?.statusCounts?.['Impedimento Suporte'] || 0),
				fill: 'var(--color-impedimento)',
			},
			{
				status: 'Concluído',
				iniciativa: jiraData?.statusCounts?.Concluído || 0,
				fill: 'var(--color-concluido)',
			},
			{
				status: 'Em andamento',
				iniciativa: jiraData?.statusCounts?.['Em andamento'] || 0,
				fill: 'var(--color-andamento)',
			},
		];
	}, [jiraData]);

	const totalIniciativas = chartData.reduce(
		(acc, curr) => acc + curr.iniciativa,
		0,
	);

	return (
		<Card className="flex flex-col rounded-lg">
			<div className="rounded-t-lg bg-slate-100 px-5 py-4">
				<h1 className="flex flex-col items-center font-semibold text-sm">
					Total de Iniciativas
				</h1>
			</div>
			<CardContent className="flex-1 pb-0">
				<ChartContainer
					config={chartConfig}
					className="mx-auto aspect-square max-h-[250px]"
				>
					<PieChart>
						<ChartTooltip
							cursor={true}
							content={
								<ChartTooltipContent
									className="w-[200px]"
									indicator="line"
									hideLabel
								/>
							}
						/>
						<Pie
							data={chartData}
							dataKey="iniciativa"
							nameKey="status"
							innerRadius={50}
							strokeWidth={5}
						>
							<Label
								content={({ viewBox }) => {
									if (viewBox && 'cx' in viewBox && 'cy' in viewBox) {
										return (
											<text
												x={viewBox.cx}
												y={viewBox.cy}
												textAnchor="middle"
												dominantBaseline="middle"
											>
												<motion.tspan
													x={viewBox.cx}
													y={viewBox.cy}
													className="fill-foreground text-2xl font-bold text-gray-800"
													initial={{ opacity: 0, y: 20 }}
													animate={{ opacity: 1, y: 0 }}
													transition={{ duration: 0.5, delay: 0.5 }}
												>
													{totalIniciativas}
												</motion.tspan>
											</text>
										);
									}
								}}
							/>
						</Pie>
					</PieChart>
				</ChartContainer>
			</CardContent>
		</Card>
	);
}
