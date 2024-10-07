import { useQuery } from '@tanstack/react-query';
import { api } from '../api-client';

// Definição da estrutura de um comentário
export interface JiraComment {
	id: string;
	body: {
		type: string;
		content: {
			type: string;
			content: {
				type: string;
				text: string;
			}[];
		}[];
	};
	author: {
		accountId: string;
		displayName: string;
		emailAddress: string;
		avatarUrls: {
			'48x48': string;
			'24x24': string;
			'16x16': string;
			'32x32': string;
		};
	};
	created: string;
	updated: string;
}

// Definição da resposta da API de comentários
export interface GetJiraCommentsResponse {
	startAt: number;
	maxResults: number;
	total: number;
	comments: JiraComment[];
}

// Função para buscar comentários de uma issue pelo ID
export async function getJiraCommentsByIssueId(issueId: string) {
	// Fazendo uma requisição GET para obter os comentários
	return api.get<GetJiraCommentsResponse>(`/issues/${issueId}/comments`);
}

// Hook do react-query para buscar os comentários de uma issue
export function useJiraComments(issueId: string) {
	return useQuery({
		queryKey: ['get-jira-comments', issueId],
		queryFn: () => getJiraCommentsByIssueId(issueId),
		enabled: !!issueId, // Executa a query apenas se o issueId estiver disponível
	});
}
