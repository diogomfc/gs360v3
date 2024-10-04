import { useQuery } from '@tanstack/react-query';
import { api } from '../api-client';

// Definição da estrutura de resposta para as issues do Jira
export interface JiraIssue {
	id: string;
	key: string;
	summary: string;
	status: string;
	priority: string;
	assignee: string;
	reporter: string;
	labels: string[];
	resolution: string;
	created: string;
	updated: string;
	cliente: string;
	produto: string;
	descricao: string;
	estadoInicial: string;
	estadoAtual: string;
	ultimasAtividades: string;
	proximasAtividades: string;
	startDate: string;
	dataLimite: string;
	dataExecucao: string;
	risco: string;
	impacto: string;
	impactoDetalhado: string;
	acao: string;
}

// Definição da resposta da API que busca filtros do Jira
export interface GetJiraFilterResponse {
	total: number;
	statusCounts: {
		Backlog: number;
		Concluído: number;
		'Em andamento': number;
		'Impedimento Onboarding': number; // Impedimento
		'Impedimento Ongoing': number; // Impedimento
		'Impedimento Suporte': number; // Impedimento
		'Tarefas Onboarding': number; // Backlog
		'Tarefas Ongoing': number; // Backlog
		'Tarefas Suporte': number; // Backlog
	};
	produtoCounts: Record<string, number>;
	produtos: string[];
	impactoCounts: {
		alto: number;
		médio: number;
		baixo: number;
	};
	prioridadeCounts: {
		'P1 - Critical': number;
		'P2 - High': number;
		'P3 - Medium': number;
		'P4 - Low': number;
		'P5 - Very Low': number;
	};
	iniciativas: JiraIssue[];
}

// Função para buscar filtros do Jira pelo ID
export async function getJiraFilterById(id: string) {
	// Fazendo uma requisição GET com as opções 'next'
	return api.get<GetJiraFilterResponse>(`/jira/${id}`, undefined, {
		tags: ['get-jira-id'], // Incluindo as opções 'next'
	});
}

// Hook do react-query para buscar o filtro do Jira
export function useJiraFilter(id: string) {
	return useQuery({
		queryKey: ['get-jira-id', id],
		queryFn: () => getJiraFilterById(id),
		enabled: !!id,
	});
}
