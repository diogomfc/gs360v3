'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useJiraFilters } from '@/http/jira/get-jira-filter';
import { LayoutGrid, Search, X } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import CardDashboards from './_components/card-dashboards';

//import { selectedFilterAtom } from '@/hooks/atoms';
//import { useSetAtom } from 'jotai';
import PageHeader from '../_components/page-header';

export default function PageDashboards() {
	const { data, isLoading, error } = useJiraFilters();
	const [searchTerm, setSearchTerm] = useState(''); // Estado para o termo de busca
	const router = useRouter(); // Inicializando o useRouter
	//const setSelectedFilter = useSetAtom(selectedFilterAtom); // Hook do Jotai para setar o estado

	// Função para redirecionamento quando clicar em acessar
	const handleAccess = (filterId: string, filterName: string) => {
		//setSelectedFilter({ filterId, filterName }); // Armazena os valores no estado global
		router.push(
			`/dashboards/customer-success/${filterId}/${filterName}/visao-geral`,
		);
	};

	// Função que filtra os filtros baseados no termo de busca
	const filteredData = data?.filters.filter((filter) =>
		filter.name.toLowerCase().includes(searchTerm.toLowerCase()),
	);

	return (
		<>
			<PageHeader
				title="Dashboards"
				icon={<LayoutGrid className="h-5 w-5" />}
			/>

			<main className="flex-1 h-[calc(100vh-61px)] relative overflow-auto bg-slate-50">
				<div className="absolute inset-0 bg-hero-pattern bg-repeat opacity-90" />

				<div className="relative z-10 p-8">
					{/* Campo de busca */}

					<div className=" flex items-center justify-center">
						<div className="flex gap-4 mb-8 justify-center relative w-full max-w-md bg-slate-50">
							{/* Ícone de busca */}
							<span className="absolute inset-y-0 left-0 flex items-center pl-3">
								<Search className="text-gray-400 h-5 w-5" />
							</span>

							{/* Campo de Input */}
							<Input
								type="text"
								placeholder="Buscar por nome..."
								value={searchTerm}
								onChange={(e) => setSearchTerm(e.target.value)}
								className="pl-10 pr-10 w-full" // Ajuste para dar espaço para os ícones
							/>

							{/* Botão de limpar, aparece apenas quando há texto */}
							{searchTerm && (
								<Button
									variant="link"
									className="absolute inset-y-0 right-0 flex items-center pr-3"
									onClick={() => setSearchTerm('')}
								>
									<X className="text-red-500 h-4 w-4 hover:text-red-900" />
								</Button>
							)}
						</div>
					</div>

					{/* Exibe mensagem de carregamento */}
					{isLoading && <p>Carregando filtros...</p>}

					{/* Trata erros de carregamento */}
					{error && <p>Erro ao carregar filtros: {String(error)}</p>}

					{/* Contêiner flex para os cards */}
					<div className="flex flex-wrap gap-8 justify-center">
						{/* Renderiza os filtros se houver dados */}
						{filteredData?.map((filter) => (
							<CardDashboards
								key={filter.id}
								title={filter.name}
								description={filter.description || 'Sem descrição'}
								authorName="Rafael Testa"
								authorImage="https://media.licdn.com/dms/image/v2/D4D03AQEGe6UMAhvbNA/profile-displayphoto-shrink_200_200/profile-displayphoto-shrink_200_200/0/1702347657397?e=1732752000&v=beta&t=r8R3IXFXULGac8fQemBIq8agPFBJ33fxVc8sty6zhfY"
								userCount={5}
								onAccess={() => handleAccess(filter.id, filter.name)}
							/>
						))}
					</div>

					{/* Caso não haja filtros disponíveis após busca */}
					{!isLoading && !error && filteredData?.length === 0 && (
						<p>Nenhum filtro encontrado para {searchTerm}.</p>
					)}
				</div>
			</main>
		</>
	);
}
