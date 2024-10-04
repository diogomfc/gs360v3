export class ApiClient {
	private baseUrl: string;

	constructor(baseUrl = '/api') {
		this.baseUrl = baseUrl;
	}

	// Função para realizar uma requisição GET com suporte a 'next'
	async get<T>(
		url: string,
		options?: RequestInit,
		nextOptions?: { tags: string[] },
	): Promise<T> {
		const response = await fetch(`${this.baseUrl}${url}`, {
			method: 'GET',
			...options,
			next: nextOptions, // Inclui as opções específicas do Next.js 14+
		});
		if (!response.ok) {
			throw new Error(`Erro: ${response.statusText}`);
		}
		return response.json();
	}

	// Função para realizar uma requisição POST
	async post<T>(url: string, body: any, options?: RequestInit): Promise<T> {
		const response = await fetch(`${this.baseUrl}${url}`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(body),
			...options,
		});
		if (!response.ok) {
			throw new Error(`Erro: ${response.statusText}`);
		}
		return response.json();
	}

	// Função para realizar uma requisição PUT
	async put<T>(url: string, body: any, options?: RequestInit): Promise<T> {
		const response = await fetch(`${this.baseUrl}${url}`, {
			method: 'PUT',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(body),
			...options,
		});
		if (!response.ok) {
			throw new Error(`Erro: ${response.statusText}`);
		}
		return response.json();
	}

	// Função para realizar uma requisição DELETE
	async delete<T>(url: string, options?: RequestInit): Promise<T> {
		const response = await fetch(`${this.baseUrl}${url}`, {
			method: 'DELETE',
			...options,
		});
		if (!response.ok) {
			throw new Error(`Erro: ${response.statusText}`);
		}
		return response.json();
	}
}

// Instância padrão da API para facilitar o uso
export const api = new ApiClient();
