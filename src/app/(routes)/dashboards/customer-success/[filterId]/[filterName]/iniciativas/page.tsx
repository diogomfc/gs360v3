'use client';

import Image from 'next/image';

import PageHeader from '@/app/(routes)/_components/page-header';
import { useJiraFilter } from '@/http/jira/get-jira-filter-id';
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
	if (isLoading) return <div>Loading...</div>;

	// Verificação de erro ao carregar os dados
	if (isError) return <div>Error loading data.</div>;

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
