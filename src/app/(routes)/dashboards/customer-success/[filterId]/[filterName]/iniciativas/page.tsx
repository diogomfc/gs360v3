'use client';

import Image from 'next/image';

import PageHeader from '@/app/(routes)/_components/page-header';
import { useJiraFilter } from '@/http/jira/get-jira-filter-id';
import { motion } from 'framer-motion';
import { columns } from './_components/columns';
import { DataTable } from './_components/data-table';

interface JiraFilterDetailsProps {
	params: { filterId: string; filterName: string };
}

export default function TaskPage({ params }: JiraFilterDetailsProps) {
	const { filterName, filterId } = params;

	// Chamada do hook para obter os dados do Jira
	const { data: jiraData, isLoading, isError } = useJiraFilter(filterId);

	// Verificação de estado de carregamento
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

	// Verificação de erro ao carregar os dados
	if (isError)
		return (
			<p className="text-sm text-muted-foreground">
				Error loading data: {String(isError)}
			</p>
		);

	// Extraindo as iniciativas dos dados
	const tasks = jiraData?.iniciativas ?? [];
	console.log('tasks', tasks);

	return (
		<>
			<PageHeader
				title={`${decodeURIComponent(filterName)} - Iniciativas` || 'Dashboard'}
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
				<div className="hidden h-full flex-1 flex-col space-y-8 p-8 md:flex">
					<DataTable data={tasks} columns={columns} />
				</div>
			</main>
		</>
	);
}
