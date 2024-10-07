import type { GetJiraCommentsResponse } from '@/http/jira/get-jira-comments-issue-id';
import axios from 'axios';
import { type NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

// Função para buscar os comentários da issue no Jira
async function getJiraComments(
	issueId: string,
): Promise<GetJiraCommentsResponse> {
	const baseUrl = `https://${process.env.DOMAIN}.atlassian.net`;

	const config = {
		method: 'get',
		url: `${baseUrl}/rest/api/3/issue/${issueId}/comment`,
		headers: {
			'Content-Type': 'application/json',
		},
		auth: {
			username: process.env.ATLASSIAN_USERNAME,
			password: process.env.ATLASSIAN_API_KEY,
		},
	};

	try {
		const response = await axios.request<GetJiraCommentsResponse>(config);
		return response.data;
	} catch (error) {
		console.error('Erro ao buscar comentários:', error);
		throw new Error('Issue não encontrada ou inválida.');
	}
}

// Definição do handler da API no Next.js
export async function GET(
	req: NextRequest,
	{ params }: { params: { issueId: string } },
) {
	const schema = z.object({
		issueId: z.string().min(1),
	});

	try {
		const { issueId } = schema.parse(params);
		const commentsResponse = await getJiraComments(issueId);
		return NextResponse.json(commentsResponse, { status: 200 });
	} catch (error) {
		return NextResponse.json(
			{ message: 'Erro ao buscar comentários ou issue inválida.' },
			{ status: 404 },
		);
	}
}
