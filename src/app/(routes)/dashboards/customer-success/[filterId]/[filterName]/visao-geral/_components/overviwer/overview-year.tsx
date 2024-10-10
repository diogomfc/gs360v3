'use client';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import {
	type ChartConfig,
	ChartContainer,
	ChartTooltip,
	ChartTooltipContent,
} from '@/components/ui/chart';
import type { GetJiraFilterResponse } from '@/http/jira/get-jira-filter-id';
import { StopwatchIcon } from '@radix-ui/react-icons';
import {
	CircleHelp,
	Dot,
	type LucideIcon,
	OctagonPause,
	Rocket,
} from 'lucide-react';
import { useMemo } from 'react';
import { Bar, BarChart, CartesianGrid, XAxis } from 'recharts';

const chartConfig = {
	inBacklog: {
		label: 'Backlog',
		color: '#327dd2',
		icon: CircleHelp,
	},
	impediments: { label: 'Impedimento', color: '#a6b5c7', icon: OctagonPause },
	completed: { label: 'Concluído', color: '#2A9D90', icon: Rocket },
	inProgress: { label: 'Em andamento', color: '#E8C468', icon: StopwatchIcon },
} satisfies ChartConfig;

const months = [
	'Janeiro',
	'Fevereiro',
	'Março',
	'Abril',
	'Maio',
	'Junho',
	'Julho',
	'Agosto',
	'Setembro',
	'Outubro',
	'Novembro',
	'Dezembro',
];

export function OverviewYear({
	jiraData,
}: { jiraData?: GetJiraFilterResponse }) {
	// Processar dados das iniciativas
	const chartData = useMemo(() => {
		// Se não houver jiraData ou iniciativas, retorne um array vazio
		if (!jiraData || !jiraData.iniciativas) {
			return months.map((month) => ({
				month,
				inBacklog: 0,
				impediments: 0,
				completed: 0,
				inProgress: 0,
			}));
		}

		// Inicializa o objeto para contar iniciativas por mês
		const dataByMonth = months.map((month) => ({
			month,
			inBacklog: 0,
			impediments: 0,
			completed: 0,
			inProgress: 0,
		}));

		for (const initiative of jiraData.iniciativas) {
			const createdMonth = new Date(initiative.created).getMonth();
			const updatedMonth = new Date(initiative.updated).getMonth();

			// Adiciona o status correto para o mês de criação/atualização
			if (initiative.status === 'Em andamento') {
				dataByMonth[createdMonth].inProgress += 1 || 0;
			} else if (initiative.status === 'Concluído') {
				dataByMonth[updatedMonth].completed += 1 || 0;
			} else if (
				initiative.status === 'Backlog' ||
				initiative.status === 'Tarefas Onboarding' ||
				initiative.status === 'Tarefas Ongoing' ||
				initiative.status === 'Tarefas Suporte'
			) {
				dataByMonth[createdMonth].inBacklog += 1 || 0;
			} else if (
				initiative.status === 'Impedimento' ||
				initiative.status === 'Impedimento Onboarding' ||
				initiative.status === 'Impedimento Ongoing' ||
				initiative.status === 'Impedimento Suporte'
			) {
				dataByMonth[updatedMonth].impediments += 1 || 0;
			}
		}

		// Filtrar os últimos 6 meses
		const currentMonthIndex = new Date().getMonth();
		const lastSixMonthsData = dataByMonth.slice(
			Math.max(0, currentMonthIndex - 5), // Garantir que sempre mostre 6 meses, mesmo se for o início do ano
			currentMonthIndex + 1,
		);

		return lastSixMonthsData;
	}, [jiraData]);

	// Obtém o índice do mês atual
	const currentMonthIndex = new Date().getMonth();

	return (
		<Card className="col-span-4 max-h-[460px] flex flex-col rounded-lg">
			<div className="flex flex-col rounded-t-lg bg-slate-100 px-5 py-4">
				<h1 className="font-semibold text-sm">Total de Iniciativas</h1>
				<span className="text-xs text-muted-foreground">últimos 6 Meses</span>
			</div>

			<CardContent className="mb-3 flex-grow overflow-hidden">
				{/* Adiciona overflow-hidden */}
				<ChartContainer config={chartConfig} className="h-full w-full">
					<BarChart accessibilityLayer data={chartData}>
						<CartesianGrid vertical={false} />
						<XAxis
							dataKey="month"
							tickLine={false}
							tickMargin={10}
							axisLine={false}
							tickFormatter={(value) => value.slice(0, 3)}
						/>
						<Bar
							dataKey="inBacklog"
							stackId="a"
							fill="var(--color-inBacklog)"
							radius={[0, 0, 0, 0]}
						/>
						<Bar
							dataKey="impediments"
							stackId="a"
							fill="var(--color-impediments)"
							radius={[0, 0, 0, 0]}
						/>

						<Bar
							dataKey="inProgress"
							stackId="a"
							fill="var(--color-inProgress)"
							radius={[0, 0, 0, 0]}
						/>
						<Bar
							dataKey="completed"
							stackId="a"
							fill="var(--color-completed)"
							radius={[0, 0, 0, 0]}
						/>

						<ChartTooltip
							content={
								<ChartTooltipContent
									indicator="line"
									className="w-[200px]"
									formatter={(value, name, item, index) => {
										const key = name as keyof typeof chartConfig;
										const Icon = chartConfig[key]?.icon as LucideIcon;

										// Renderizar todos os status
										return (
											<>
												<div className="flex w-[170px] pt-2">
													{Icon && (
														<div className="flex items-center">
															<Icon size={16} color={chartConfig[key]?.color} />
															<div className="ml-2 text-xs">
																{chartConfig[key]?.label || name}
															</div>
														</div>
													)}
													<div className="ml-auto flex items-baseline gap-0.5 font-mono font-medium tabular-nums text-foreground">
														{value !== undefined ? value : 0}
													</div>
												</div>
												{index === 3 && (
													<div className="mt-1.5 flex basis-full items-center border-t pt-1.5 text-xs font-medium text-foreground">
														Total
														<div className="ml-auto flex items-baseline gap-0.5 pr-2 font-mono font-medium tabular-nums text-foreground">
															{item.payload.inBacklog +
																item.payload.impediments +
																item.payload.completed +
																item.payload.inProgress}
														</div>
													</div>
												)}
											</>
										);
									}}
								/>
							}
							cursor={false}
							defaultIndex={currentMonthIndex}
						/>
					</BarChart>
				</ChartContainer>
			</CardContent>
		</Card>
	);
}
