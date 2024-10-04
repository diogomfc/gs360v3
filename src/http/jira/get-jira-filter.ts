import { useQuery } from '@tanstack/react-query';
import { api } from '../api-client';

// Definição da estrutura de um filtro do Jira
export interface JiraFilter {
	id: string;
	name: string;
	description: string | null;
}

// Definição da resposta da API que lista filtros do Jira
export interface ListJiraFiltersResponse {
	filters: JiraFilter[];
}

// Função para listar filtros do Jira
export async function listJiraFilters() {
	// Fazendo a requisição com a opção `next` para otimizar o cache de rota
	return api.get<ListJiraFiltersResponse>('/jira/filters', undefined, {
		tags: ['list-jira'], // Opções para o cache de rota
	});
}

// Hook para buscar os filtros do Jira com React Query
export function useJiraFilters() {
	return useQuery({
		queryKey: ['jira-filters'], // Chave única para identificar a query no cache
		queryFn: listJiraFilters, // Função que realiza a chamada API
	});
}
