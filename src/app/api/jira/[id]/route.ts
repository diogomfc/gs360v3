import axios from 'axios';

import { type NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

// Interface JiraIssue para descrever as issues do Jira
interface JiraIssue {
	id: string;
	key: string;
	fields: {
		summary: string;
		status: { name: string };
		priority: { name: string };
		assignee: { displayName: string } | null;
		reporter: { displayName: string } | null;
		labels: string[];
		resolution: { name: string } | null;
		created: string;
		updated: string;
		customfield_10157: { value: string } | null; // Cliente
		customfield_10158: { value: string } | null; // Produto
		description: any;
		customfield_10145: any; // Estado Inicial
		customfield_10146: any; // Estado Atual
		customfield_10147: any; // Últimas Atividades
		customfield_10148: any; // Próximas Atividades
		customfield_10015: string | null; // Data de início
		duedate: string | null; // Data limite
		resolutiondate: string | null; // Data de execução
		customfield_10151: { value: string } | null; // Risco
		customfield_10152: string | null; // Risco ou Issue
		customfield_10153: { value: string } | null; // Impacto
		customfield_10154: { value: string } | null; // Impacto Detalhado
		customfield_10155: string | null; // Ação
	};
}

// Função para buscar issues no Jira por filtro
async function getIssuesByFilterId(filterId: string) {
	const baseUrl = `https://${process.env.DOMAIN}.atlassian.net`;

	const config = {
		method: 'get',
		url: `${baseUrl}/rest/api/3/search?jql=filter=${filterId}`,
		headers: { 'Content-Type': 'application/json' },
		auth: {
			username: process.env.ATLASSIAN_USERNAME,
			password: process.env.ATLASSIAN_API_KEY,
		},
	};
	try {
		const response = await axios.request(config as any);
		return response.data;
	} catch (error: any) {
		console.log('Erro ao buscar issues:');
		throw new Error('Filtro não encontrado ou inválido.');
	}
}

// Função para formatar as issues retornadas
function formatIssues(issues: JiraIssue[]) {
	// Contagem de status das issues
	const statusCounts: Record<string, number> = {
		Backlog: 0,
		Concluído: 0,
		'Em andamento': 0,
		'Impedimento Onboarding': 0,
		'Impedimento Ongoing': 0,
		'Impedimento Suporte': 0,
		'Tarefas Onboarding': 0,
		'Tarefas Ongoing': 0,
		'Tarefas Suporte': 0,
	};
	// Contagem de produtos das issues
	const produtoCounts: Record<string, number> = {};

	// Lista de produtos
	const produtos: string[] = [];

	// Contagem de impactos das issues
	const impactoCounts = {
		alto: 0,
		médio: 0,
		baixo: 0,
	};
	// Contagem de prioridades das issues
	const prioridadeCounts: Record<string, number> = {
		'P1 - Critical': 0,
		'P2 - High': 0,
		'P3 - Medium': 0,
		'P4 - Low': 0,
		'P5 - Very Low': 0,
	};

	// Formatação das issues
	const formattedIssues = issues.map((issue) => {
		const produto = issue.fields.customfield_10158?.value || 'Desconhecido';
		// Contagem de produtos
		produtoCounts[produto] = (produtoCounts[produto] || 0) + 1;

		// Adiciona o produto à lista de produtos
		if (!produtos.includes(produto)) {
			produtos.push(produto);
		}

		// Contagem de impactos
		const impacto =
			issue.fields.customfield_10153?.value?.toLowerCase() || 'desconhecido';
		switch (impacto) {
			case 'alto':
			case 'médio':
			case 'baixo':
				impactoCounts[impacto]++;
				break;
			default:
				break;
		}

		// Contagem de prioridades
		let priority = issue.fields.priority?.name || 'Nenhuma';

		// Substitui diferentes tipos de hífen por um hífen comum
		priority = priority.replace(/–|—/g, '-');

		if (priority in prioridadeCounts) {
			prioridadeCounts[priority]++;
		} else {
			prioridadeCounts[priority] = 1;
		}

		// Contagem de status
		const status = issue.fields.status?.name || 'Desconhecido';
		if (status in statusCounts) {
			statusCounts[status]++;
		} else {
			statusCounts[status] = 1;
		}

		return {
			id: issue.id,
			key: issue.key,
			summary: issue.fields.summary,
			status,
			priority: issue.fields.priority?.name || 'Nenhuma',
			assignee: issue.fields.assignee?.displayName || 'Não atribuído',
			reporter: issue.fields.reporter?.displayName || 'Desconhecido',
			labels: issue.fields.labels || [],
			resolution: issue.fields.resolution?.name || 'Não resolvido',
			created: issue.fields.created.split('T')[0],
			updated: issue.fields.updated.split('T')[0],
			cliente: issue.fields.customfield_10157?.value || 'Desconhecido',
			produto,
			descricao: extractDescription(issue.fields.description),
			estadoInicial:
				issue.fields.customfield_10145?.content[0]?.content[0]?.text ||
				'Sem informações iniciais',
			estadoAtual:
				issue.fields.customfield_10146?.content[0]?.content[0]?.text ||
				'Sem informações atuais',
			ultimasAtividades:
				issue.fields.customfield_10147?.content[0]?.content[0]?.text ||
				'Sem últimas atividades',
			proximasAtividades:
				issue.fields.customfield_10148?.content[0]?.content[0]?.text ||
				'Sem próximas atividades',
			startDate: issue.fields.customfield_10015 || 'Sem data de início',
			dataLimite: issue.fields.duedate || 'Sem data limite',
			dataExecucao:
				issue.fields.resolutiondate?.split('T')[0] || 'Não executado',
			risco: issue.fields.customfield_10151?.value || 'Desconhecido',
			riscoOuIssue: issue.fields.customfield_10152 || 'Sem risco ou issue',
			impacto,
			impactoDetalhado: issue.fields.customfield_10154?.value || 'Desconhecido',
			acao: issue.fields.customfield_10155 || 'Sem ação definida',
		};
	});

	return {
		total: issues.length,
		statusCounts,
		produtos,
		produtoCounts,
		impactoCounts,
		prioridadeCounts,
		iniciativas: formattedIssues,
	};
}

// Função auxiliar para extrair a descrição
// function extractDescription(description: any): string {
// 	if (typeof description === 'string') {
// 		return description;
// 	} else if (description?.content) {
// 		return description.content
// 			.map((paragraph: any) =>
// 				paragraph.content.map((text: any) => text.text).join(' '),
// 			)
// 			.join(' ');
// 	} else {
// 		return 'Sem descrição';
// 	}
// }

// Função auxiliar para extrair a descrição
function extractDescription(description: any): string {
	if (typeof description === 'string') {
		return description;
	}
	if (description?.content) {
		return description.content
			.map((paragraph: any) =>
				paragraph.content.map((text: any) => text.text).join(' '),
			)
			.join(' ');
	}
	return 'Sem descrição';
}

// Handler da API Next.js
export async function GET(
	req: NextRequest,
	{ params }: { params: { id: string } },
) {
	const schema = z.object({
		id: z.string().min(1),
	});

	try {
		const { id } = schema.parse(params);
		const issuesResponse = await getIssuesByFilterId(id);
		const formattedData = formatIssues(issuesResponse.issues);
		return NextResponse.json(formattedData, { status: 200 });
	} catch (error) {
		console.error(error);
		return NextResponse.json(
			{ message: 'Filtro não encontrado ou inválido.' },
			{ status: 404 },
		);
	}
}
