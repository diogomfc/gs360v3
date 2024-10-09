//TODO: 01
// import axios from 'axios';

// import { type NextRequest, NextResponse } from 'next/server';
// import { z } from 'zod';

// // Interface JiraIssue para descrever as issues do Jira
// interface JiraIssue {
// 	id: string;
// 	key: string;
// 	fields: {
// 		summary: string;
// 		status: { name: string };
// 		priority: { name: string };
// 		assignee: { displayName: string } | null;
// 		reporter: { displayName: string } | null;
// 		labels: string[];
// 		resolution: { name: string } | null;
// 		created: string;
// 		updated: string;
// 		customfield_10157: { value: string } | null; // Cliente
// 		customfield_10158: { value: string } | null; // Produto
// 		description: any;
// 		customfield_10145: any; // Estado Inicial
// 		customfield_10146: any; // Estado Atual
// 		customfield_10147: any; // Últimas Atividades
// 		customfield_10148: any; // Próximas Atividades
// 		customfield_10015: string | null; // Data de início
// 		duedate: string | null; // Data limite
// 		resolutiondate: string | null; // Data de execução
// 		customfield_10151: { value: string } | null; // Risco
// 		customfield_10152: string | null; // Risco ou Issue
// 		customfield_10153: { value: string } | null; // Impacto
// 		customfield_10154: { value: string } | null; // Impacto Detalhado
// 		customfield_10155: string | null; // Ação
// 	};
// }

// // Função para buscar issues no Jira por filtro
// async function getIssuesByFilterId(filterId: string) {
// 	const baseUrl = `https://${process.env.DOMAIN}.atlassian.net`;

// 	const config = {
// 		method: 'get',
// 		url: `${baseUrl}/rest/api/3/search?jql=filter=${filterId}`,
// 		headers: { 'Content-Type': 'application/json' },
// 		auth: {
// 			username: process.env.ATLASSIAN_USERNAME,
// 			password: process.env.ATLASSIAN_API_KEY,
// 		},
// 	};
// 	try {
// 		const response = await axios.request(config as any);
// 		return response.data;
// 	} catch (error: any) {
// 		console.log('Erro ao buscar issues:');
// 		throw new Error('Filtro não encontrado ou inválido.');
// 	}
// }

// // Função para formatar as issues retornadas
// function formatIssues(issues: JiraIssue[]) {
// 	// Contagem de status das issues
// 	const statusCounts: Record<string, number> = {
// 		Backlog: 0,
// 		Concluído: 0,
// 		'Em andamento': 0,
// 		'Impedimento Onboarding': 0,
// 		'Impedimento Ongoing': 0,
// 		'Impedimento Suporte': 0,
// 		'Tarefas Onboarding': 0,
// 		'Tarefas Ongoing': 0,
// 		'Tarefas Suporte': 0,
// 	};
// 	// Contagem de produtos das issues
// 	const produtoCounts: Record<string, number> = {};

// 	// Lista de produtos
// 	const produtos: string[] = [];

// 	// Contagem de impactos das issues
// 	const impactoCounts = {
// 		alto: 0,
// 		médio: 0,
// 		baixo: 0,
// 	};
// 	// Contagem de prioridades das issues
// 	const prioridadeCounts: Record<string, number> = {
// 		'P1 - Critical': 0,
// 		'P2 - High': 0,
// 		'P3 - Medium': 0,
// 		'P4 - Low': 0,
// 		'P5 - Very Low': 0,
// 	};

// 	// Formatação das issues
// 	const formattedIssues = issues.map((issue) => {
// 		const produto = issue.fields.customfield_10158?.value || 'Desconhecido';
// 		// Contagem de produtos
// 		produtoCounts[produto] = (produtoCounts[produto] || 0) + 1;

// 		// Adiciona o produto à lista de produtos
// 		if (!produtos.includes(produto)) {
// 			produtos.push(produto);
// 		}

// 		// Contagem de impactos
// 		const impacto =
// 			issue.fields.customfield_10153?.value?.toLowerCase() || 'desconhecido';
// 		switch (impacto) {
// 			case 'alto':
// 			case 'médio':
// 			case 'baixo':
// 				impactoCounts[impacto]++;
// 				break;
// 			default:
// 				break;
// 		}

// 		// Contagem de prioridades
// 		let priority = issue.fields.priority?.name || 'Nenhuma';

// 		// Substitui diferentes tipos de hífen por um hífen comum
// 		priority = priority.replace(/–|—/g, '-');

// 		if (priority in prioridadeCounts) {
// 			prioridadeCounts[priority]++;
// 		} else {
// 			prioridadeCounts[priority] = 1;
// 		}

// 		// Contagem de status
// 		const status = issue.fields.status?.name || 'Desconhecido';
// 		if (status in statusCounts) {
// 			statusCounts[status]++;
// 		} else {
// 			statusCounts[status] = 1;
// 		}

// 		return {
// 			id: issue.id,
// 			key: issue.key,
// 			summary: issue.fields.summary,
// 			status,
// 			priority: issue.fields.priority?.name || 'Nenhuma',
// 			assignee: issue.fields.assignee?.displayName || 'Não atribuído',
// 			reporter: issue.fields.reporter?.displayName || 'Desconhecido',
// 			labels: issue.fields.labels || [],
// 			resolution: issue.fields.resolution?.name || 'Não resolvido',
// 			created: issue.fields.created.split('T')[0],
// 			updated: issue.fields.updated.split('T')[0],
// 			cliente: issue.fields.customfield_10157?.value || 'Desconhecido',
// 			produto,
// 			descricao: extractDescription(issue.fields.description),
// 			estadoInicial:
// 				issue.fields.customfield_10145?.content[0]?.content[0]?.text ||
// 				'Sem informações iniciais',
// 			estadoAtual:
// 				issue.fields.customfield_10146?.content[0]?.content[0]?.text ||
// 				'Sem informações atuais',
// 			ultimasAtividades:
// 				issue.fields.customfield_10147?.content[0]?.content[0]?.text ||
// 				'Sem últimas atividades',
// 			proximasAtividades:
// 				issue.fields.customfield_10148?.content[0]?.content[0]?.text ||
// 				'Sem próximas atividades',
// 			startDate: issue.fields.customfield_10015 || 'Sem data de início',
// 			dataLimite: issue.fields.duedate || 'Sem data limite',
// 			dataExecucao:
// 				issue.fields.resolutiondate?.split('T')[0] || 'Não executado',
// 			risco: issue.fields.customfield_10151?.value || 'Desconhecido',
// 			impacto,
// 			impactoDetalhado: issue.fields.customfield_10154?.value || 'Desconhecido',
// 			acao: issue.fields.customfield_10155 || 'Sem ação definida',
// 		};
// 	});

// 	return {
// 		total: issues.length,
// 		statusCounts,
// 		produtos,
// 		produtoCounts,
// 		impactoCounts,
// 		prioridadeCounts,
// 		iniciativas: formattedIssues,
// 	};
// }

// // Função auxiliar para extrair a descrição
// // function extractDescription(description: any): string {
// // 	if (typeof description === 'string') {
// // 		return description;
// // 	} else if (description?.content) {
// // 		return description.content
// // 			.map((paragraph: any) =>
// // 				paragraph.content.map((text: any) => text.text).join(' '),
// // 			)
// // 			.join(' ');
// // 	} else {
// // 		return 'Sem descrição';
// // 	}
// // }

// // Função auxiliar para extrair a descrição
// function extractDescription(description: any): string {
// 	if (typeof description === 'string') {
// 		return description;
// 	}
// 	if (description?.content) {
// 		return description.content
// 			.map((paragraph: any) =>
// 				paragraph.content.map((text: any) => text.text).join(' '),
// 			)
// 			.join(' ');
// 	}
// 	return 'Sem descrição';
// }

// // Handler da API Next.js
// export async function GET(
// 	req: NextRequest,
// 	{ params }: { params: { id: string } },
// ) {
// 	const schema = z.object({
// 		id: z.string().min(1),
// 	});

// 	try {
// 		const { id } = schema.parse(params);
// 		const issuesResponse = await getIssuesByFilterId(id);
// 		const formattedData = formatIssues(issuesResponse.issues);
// 		return NextResponse.json(formattedData, { status: 200 });
// 	} catch (error) {
// 		console.error(error);
// 		return NextResponse.json(
// 			{ message: 'Filtro não encontrado ou inválido.' },
// 			{ status: 404 },
// 		);
// 	}
// }

//TODO: 02
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
		assignee: {
			accountId: string;
			displayName: string;
			emailAddress: string;
			avatarUrls: {
				'48x48': string;
			};
		} | null;
		reporter: {
			accountId: string;
			displayName: string;
			emailAddress: string;
			avatarUrls: {
				'48x48': string;
			};
		} | null;
		customfield_10156:
			| {
					accountId: string;
					displayName: string;
					emailAddress: string;
					avatarUrls: {
						'48x48': string;
					};
			  }[]
			| null;
		labels: string[];
		resolution: { name: string } | null;
		created: string;
		updated: string;
		customfield_10157: { value: string } | null; // Cliente
		customfield_10158: { value: string } | null; // Produto
		description: any;
		customfield_10145: any; // Estado Inicial
		customfield_10142: any; // Estado Inicial2
		customfield_10128: any; // Estado Inicial3
		customfield_10120: any; // Estado Inicial4
		customfield_10146: any; // Estado Atual1
		customfield_10143: any; // Estado Atual2
		customfield_10129: any; // Estado Atual3
		customfield_10121: any; // Estado Atual4
		customfield_10147: any; // Últimas Atividades
		customfield_10140: any; // Ultimas Atividades2
		customfield_10148: any; // Próximas Atividades
		customfield_10141: any; // Próximas Atividades2
		customfield_10131: any; // Próximas Atividades3
		customfield_10123: any; // Próximas Atividades4
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
		const response = await axios.request(config);
		return response.data;
	} catch (error: any) {
		console.log('Erro ao buscar issues:');
		throw new Error('Filtro não encontrado ou inválido.');
	}
}

// Função para extrair texto de um conteúdo complexo
function extractTextFromContent(content: any): string {
	if (!content || !content.content) return '';

	const texts: string[] = [];

	// Função recursiva para extrair textos
	const extractTexts = (items: any[]) => {
		for (const item of items) {
			if (item.content) {
				// Se o item tem conteúdo, chame a função recursiva
				extractTexts(item.content);
			} else if (item.text) {
				// Se o item é texto, adicione-o à lista de textos
				texts.push(item.text);
			}
		}
	};

	extractTexts(content.content);

	// Se houver mais de um texto, use bolinha ou hífen
	if (texts.length > 1) {
		return texts.map((text) => `- ${text}`).join('\n'); // Usando bolinha
	}

	// Retornar o único texto ou uma string vazia, caso não haja textos
	return texts[0] || '';
}

// Função para extrair texto de múltiplos campos de estado
function extractEstado(fields: any, ...customFieldKeys: string[]) {
	let combinedText = '';

	for (const key of customFieldKeys) {
		const fieldContent = fields[key];
		if (fieldContent) {
			combinedText += `${extractTextFromContent(fieldContent)}\n`;
		}
	}

	return combinedText.trim() || 'Sem informações';
}

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

// Função para formatar as issues retornadas
function formatIssues(issues: JiraIssue[]) {
	const statusCounts: Record<string, number> = {};
	const produtoCounts: Record<string, number> = {};
	const impactoCounts = { alto: 0, médio: 0, baixo: 0 };
	const prioridadeCounts: Record<string, number> = {};

	const formattedIssues = issues.map((issue) => {
		const produto = issue.fields.customfield_10158?.value || 'Desconhecido';

		// Contagem de produtos
		produtoCounts[produto] = (produtoCounts[produto] || 0) + 1;

		// Contagem de prioridades
		const priority =
			issue.fields.priority?.name?.replace(/–|—/g, '-') || 'Nenhuma';
		prioridadeCounts[priority] = (prioridadeCounts[priority] || 0) + 1;

		// Contagem de status
		const status = issue.fields.status?.name || '--';
		statusCounts[status] = (statusCounts[status] || 0) + 1;

		// Contagem de impacto
		const impacto =
			issue.fields.customfield_10153?.value?.toLowerCase() || '--';
		if (impacto in impactoCounts) {
			impactoCounts[impacto as keyof typeof impactoCounts]++;
		}

		// Extração de dados de múltiplos campos para os estados
		const estadoInicial = extractEstado(
			issue.fields,
			'customfield_10145',
			'customfield_10128',
			'customfield_10120',
			'customfield_10142',
		);

		const estadoAtual = extractEstado(
			issue.fields,
			'customfield_10146',
			'customfield_10143',
			'customfield_10129',
			'customfield_10121',
		);

		const ultimasAtividades = extractEstado(
			issue.fields,
			'customfield_10147',
			'customfield_10140',
		);

		const proximasAtividades = extractEstado(
			issue.fields,
			'customfield_10141',
			'customfield_10131',
			'customfield_10123',
			'customfield_10148',
		);

		return {
			id: issue.id,
			key: issue.key,
			summary: issue.fields.summary,
			status,
			priority,
			assignee: {
				accountId: issue.fields.assignee?.accountId,
				displayName: issue.fields.assignee?.displayName,
				emailAddress: issue.fields.assignee?.emailAddress,
				avatarUrls: issue.fields.assignee?.avatarUrls['48x48'] || {},
			},
			reporter: {
				accountId: issue.fields.reporter?.accountId,
				displayName: issue.fields.reporter?.displayName,
				emailAddress: issue.fields.reporter?.emailAddress,
				avatarUrls: issue.fields.reporter?.avatarUrls['48x48'] || {},
			},
			responsavel: {
				accountId: issue.fields.customfield_10156?.[0]?.accountId,
				displayName: issue.fields.customfield_10156?.[0]?.displayName,
				emailAddress: issue.fields.customfield_10156?.[0]?.emailAddress,
				avatarUrls:
					issue.fields.customfield_10156?.[0]?.avatarUrls['48x48'] || {},
			},
			labels: issue.fields.labels || [],
			resolution: issue.fields.resolution?.name || 'Não resolvido',
			created: issue.fields.created.split('T')[0],
			updated: issue.fields.updated.split('T')[0],
			cliente: issue.fields.customfield_10157?.value || 'Desconhecido',
			produto,
			descricao: extractTextFromContent(issue.fields.description),
			estadoInicial,
			estadoAtual,
			ultimasAtividades,
			proximasAtividades,
			startDate: issue.fields.customfield_10015 || 'Sem data de início',
			dataLimite: issue.fields.duedate || 'Sem data limite',
			dataExecucao:
				issue.fields.resolutiondate?.split('T')[0] || 'Não executado',
			risco: issue.fields.customfield_10151?.value || '--',
			riscoOuIssue: issue.fields.customfield_10152 || 'Sem risco ou issue',
			impacto,
			impactoDetalhado: issue.fields.customfield_10154?.value || 'Desconhecido',
			acao: issue.fields.customfield_10155 || 'Sem ação definida',
		};
	});

	return {
		total: issues.length,
		statusCounts,
		produtoCounts,
		impactoCounts,
		prioridadeCounts,
		iniciativas: formattedIssues,
	};
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
