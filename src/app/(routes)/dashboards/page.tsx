'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useJiraFilters } from '@/http/jira/get-jira-filter';
import { FilterX, LayoutGrid, Search, X } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import CardDashboards from './_components/card-dashboards';

import { selectedFilterAtom } from '@/hooks/atoms';
import { set } from 'date-fns';
import { useSetAtom } from 'jotai';
import PageHeader from '../_components/page-header';
import { OwnerFilter } from './_components/owner-filter';
import { StatusFilter } from './_components/status-filter';

export default function PageDashboards() {
	const router = useRouter(); // Inicializando o useRouter
	const setSelectedFilter = useSetAtom(selectedFilterAtom); // Hook do Jotai para setar o estado
	const { data, isLoading, error } = useJiraFilters();
	const [searchTerm, setSearchTerm] = useState(''); // Estado para o termo de busca
	const [selectedStatus, setSelectedStatus] = useState(new Set<string>()); // Estado para o filtro de status
	const [selectedOwnerIds, setSelectedOwnerIds] = useState(new Set<string>()); // Estado para os donos selecionados

	// Função para limpar todos os filtros
	const handleClearFilters = () => {
		setSearchTerm(''); // Limpa o termo de busca
		setSelectedStatus(new Set()); // Limpa o filtro de status
		setSelectedOwnerIds(new Set()); // Limpa o filtro de donos
	};

	// Função para redirecionamento quando clicar em acessar
	const handleAccess = (filterId: string, filterName: string) => {
		setSelectedFilter({ filterId, filterName }); // Armazena os valores no estado global
		router.push(
			`/dashboards/customer-success/${filterId}/${filterName}/visao-geral`,
		);
	};

	// Função para filtrar dados com base nos status e donos
	const filteredData = data?.filters.filter((filter) => {
		const matchesSearch = filter.name
			.toLowerCase()
			.includes(searchTerm.toLowerCase());

		const isLiberado = filter.owner.accountId === '628be005b1594d0069078b5f'; // Lógica para determinar se é liberado
		const isBloqueado = !isLiberado;

		// Verifica se o status do filtro deve ser incluído com base nas seleções
		const statusMatches =
			selectedStatus.size === 0 ||
			(selectedStatus.has('liberados') && isLiberado) ||
			(selectedStatus.has('bloqueados') && isBloqueado);

		// Verifica se o dono do filtro deve ser incluído com base nas seleções
		const ownerMatches =
			selectedOwnerIds.size === 0 ||
			selectedOwnerIds.has(filter.owner.accountId);

		return matchesSearch && statusMatches && ownerMatches;
	});

	// Coletando os donos únicos para passar para o filtro
	const owners = Array.from(
		new Set(
			data?.filters.map((filter) => ({
				id: filter.owner.accountId,
				name: filter.owner.displayName,
				avatarUrl: filter.owner.avatarUrls['48x48'],
			})),
		),
	);

	// Calcular o número de filtros selecionados
	const selectedFilterCount = selectedStatus.size + selectedOwnerIds.size;

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
					<div className="flex items-center justify-center gap-4 mb-8 ">
						<div className="flex gap-4 justify-center relative w-full max-w-md bg-slate-50">
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
								className="pl-10 pr-10 w-full"
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
						{/* Componente de filtro de donos */}
						<span className="text-sm text-muted-foreground">ou</span>
						<OwnerFilter
							owners={owners}
							selectedOwnerIds={selectedOwnerIds} // Passa os donos selecionados
							setSelectedOwnerIds={setSelectedOwnerIds} // Atualiza os donos selecionados
						/>

						{/* Filtro de Status */}
						<StatusFilter
							selectedStatus={selectedStatus}
							setSelectedStatus={setSelectedStatus}
						/>

						{/* Botão para limpar todos os filtros */}
						<Button
							variant="ghost"
							size="sm"
							className="flex items-center gap-2"
							onClick={handleClearFilters}
						>
							<FilterX className="h-5 w-5" />
							{selectedFilterCount > 0 && (
								<span className="text-sm text-gray-600">
									{selectedFilterCount}
								</span>
							)}
						</Button>
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
								authorName={filter.owner.displayName}
								authorImage={filter.owner.avatarUrls['48x48']}
								userCount={5}
								onAccess={() => handleAccess(filter.id, filter.name)}
								disabled={filter.owner.accountId !== '628be005b1594d0069078b5f'}
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
