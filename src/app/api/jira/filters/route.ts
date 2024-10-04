import axios from 'axios';
import { NextResponse } from 'next/server';

// Função para buscar filtros no Jira
async function getFilters() {
	const baseUrl = `https://${process.env.DOMAIN}.atlassian.net`;

	const config = {
		method: 'get',
		url: `${baseUrl}/rest/api/3/filter/search?expand=description`,
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
		throw new Error(`Erro ao buscar filtros: ${error.message}`);
	}
}

// Endpoint para listar filtros
export async function GET() {
	try {
		const filtersResponse = await getFilters();
		const filters = filtersResponse.values.map((filter: any) => ({
			id: filter.id,
			name: filter.name,
			description: filter.description || 'Sem descrição',
		}));
		return NextResponse.json({ filters });
	} catch (error: any) {
		console.error(error);
		return NextResponse.json({ error: error.message }, { status: 500 });
	}
}
