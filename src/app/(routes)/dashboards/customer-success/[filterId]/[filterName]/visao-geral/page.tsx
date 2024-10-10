'use client';

import PageHeader from '@/app/(routes)/_components/page-header';
import { useJiraFilter } from '@/http/jira/get-jira-filter-id';
import { StopwatchIcon } from '@radix-ui/react-icons';
import { CircleHelp, OctagonPause, Rocket } from 'lucide-react';
import Image from 'next/image';
import { CardStatus } from './_components/card-status';
import { OverviewYear } from './_components/overviwer/overview-year';
import { ProgramList } from './_components/program-list';
import { RecentInitiatives } from './_components/recent-iniciatives';
import { TotalInitiatives } from './_components/total-initiatives';

import { motion } from 'framer-motion';
import { columns } from './_components/table-iniciative/columns';
import { DataTable } from './_components/table-iniciative/data-table';

interface JiraFilterDetailsProps {
	params: { filterId: string; filterName: string };
}

export default function JiraFilterDetails({ params }: JiraFilterDetailsProps) {
	const { filterId, filterName } = params;

	const { data: jiraData, isLoading, isError } = useJiraFilter(filterId);
	const tasks = jiraData?.iniciativas ?? [];

	if (isLoading)
		return (
			<motion.div
				className="fixed inset-0 z-50 flex items-center justify-center bg-white bg-opacity-75"
				initial={{ opacity: 0 }}
				animate={{ opacity: 1 }}
				exit={{ opacity: 0 }}
			>
				<motion.div
					className="flex flex-col items-center justify-center gap-4"
					animate={{ scale: [1, 1.2, 1], opacity: [1, 0.7, 1] }}
					transition={{
						repeat: Number.POSITIVE_INFINITY,
						duration: 1.5,
						ease: 'easeInOut',
					}}
				>
					<Image
						src="/assets/icons/icon-chart.svg"
						alt="Loading icon"
						width={100}
						height={100}
					/>
					<motion.p
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						transition={{
							duration: 0.8,
							repeat: Number.POSITIVE_INFINITY,
							repeatDelay: 1,
						}}
					>
						Carregando...
					</motion.p>
				</motion.div>
			</motion.div>
		);

	if (isError)
		return (
			<p className="text-sm text-muted-foreground">
				Erro ao carregar filtros: {String(isError)}
			</p>
		);

	// Extrai os 'Produto Counts' dos dados recebidos
	const produtoCounts = Object.entries(jiraData?.produtoCounts || {});

	return (
		<>
			<PageHeader
				title={`${decodeURIComponent(filterName)} - Visão Geral` || 'Dashboard'}
				icon={
					<Image
						src="/icon-dashboard-filter.svg"
						alt="Dashboard"
						width={20}
						height={20}
					/>
				}
			/>

			<main className="flex-1 h-[calc(100vh-61px)] relative overflow-auto bg-slate-50">
				<div className="space-y-4 p-8">
					{/* Cards Topo */}
					<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
						{/* Card total de iniciativas */}
						<TotalInitiatives jiraData={jiraData} />

						{/* Card total de programas em lista com ícone */}
						<ProgramList produtoCounts={produtoCounts} />

						{/* Grupo 1: Cards de Desenvolvimento e Validação */}
						<div className="grid w-full grid-rows-2 gap-4">
							<CardStatus
								icon={<CircleHelp size={24} color="#327dd2" />}
								color="rgba(79, 150, 249, 0.2)"
								title="Backlog"
								count={
									(jiraData?.statusCounts?.Backlog || 0) +
									(jiraData?.statusCounts?.['Tarefas Onboarding'] || 0) +
									(jiraData?.statusCounts?.['Tarefas Ongoing'] || 0) +
									(jiraData?.statusCounts?.['Tarefas Suporte'] || 0)
								}
							/>

							<CardStatus
								icon={<OctagonPause size={24} color="#a6b5c7" />}
								color="rgba(118, 115, 114, 0.2)"
								title="Impedimento"
								count={
									(jiraData?.statusCounts?.['Impedimento Onboarding'] || 0) +
									(jiraData?.statusCounts?.['Impedimento Ongoing'] || 0) +
									(jiraData?.statusCounts?.['Impedimento Suporte'] || 0)
								}
							/>
						</div>

						{/* Grupo 2: Cards de Concluído e Em andamento */}
						<div className="grid w-full grid-rows-2 gap-4">
							<CardStatus
								icon={
									<StopwatchIcon
										height={24}
										width={24}
										strokeWidth={2}
										color="#E8C468"
									/>
								}
								color="rgba(226, 186, 86, 0.2)"
								title="Em andamento"
								count={jiraData?.statusCounts?.['Em andamento'] || 0}
							/>

							<CardStatus
								icon={<Rocket size={24} color="#2A9D90" />}
								color="rgba(38, 141, 125, 0.2)"
								title="Concluído"
								count={jiraData?.statusCounts?.Concluído || 0}
							/>
						</div>
					</div>

					{/* Cards Main */}
					<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
						<div className="grid gap-4 w-full">
							<OverviewYear jiraData={jiraData} />
						</div>

						{/* Card Visão geral ocupando 2 colunas */}
						<div className="col-span-3 grid gap-4 w-full">
							<DataTable data={tasks} columns={columns} />
						</div>
					</div>
				</div>
			</main>
		</>
	);
}
