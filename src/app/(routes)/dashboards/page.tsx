'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useJiraFilters } from '@/http/jira/get-jira-filter';
import { FilterX, LayoutGrid, Search, X } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import CardDashboards from './_components/card-dashboards';

import { motion } from 'framer-motion';

import { selectedFilterAtom } from '@/hooks/atoms';

import { useSetAtom } from 'jotai';
import Image from 'next/image';
import PageHeader from '../_components/page-header';
import { OwnerFilter } from './_components/owner-filter';
import { SkeletonCardDashboards } from './_components/skeleton-card-dashboards';
import { StatusFilter } from './_components/status-filter';
export default function PageDashboards() {
	const router = useRouter();
	const [isLoadingRoute, setIsLoadingRoute] = useState(false);
	const setSelectedFilter = useSetAtom(selectedFilterAtom);
	const { data, isLoading, error } = useJiraFilters();
	const [searchTerm, setSearchTerm] = useState('');
	const [selectedStatus, setSelectedStatus] = useState(new Set<string>());
	const [selectedOwnerIds, setSelectedOwnerIds] = useState(new Set<string>());

	const handleClearFilters = () => {
		setSearchTerm('');
		setSelectedStatus(new Set());
		setSelectedOwnerIds(new Set());
	};

	const handleAccess = (filterId: string, filterName: string) => {
		setIsLoadingRoute(true);
		setSelectedFilter({ filterId, filterName });
		router.push(
			`/dashboards/customer-success/${filterId}/${filterName}/visao-geral`,
		);
	};

	const filteredData = data?.filters.filter((filter) => {
		const matchesSearch = filter.name
			.toLowerCase()
			.includes(searchTerm.toLowerCase());
		const isLiberado = filter.owner.accountId === '628be005b1594d0069078b5f';
		const isBloqueado = !isLiberado;
		const statusMatches =
			selectedStatus.size === 0 ||
			(selectedStatus.has('liberados') && isLiberado) ||
			(selectedStatus.has('bloqueados') && isBloqueado);
		const ownerMatches =
			selectedOwnerIds.size === 0 ||
			selectedOwnerIds.has(filter.owner.accountId);

		return matchesSearch && statusMatches && ownerMatches;
	});

	const owners = Array.from(
		new Set(
			data?.filters.map((filter) => ({
				id: filter.owner.accountId,
				name: filter.owner.displayName,
				avatarUrl: filter.owner.avatarUrls['48x48'],
			})),
		),
	);

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
					<div className="flex items-center justify-center gap-4 mb-8">
						{/* Filtros e busca */}
						<div className="flex gap-4 justify-center relative w-full max-w-md bg-slate-50">
							<span className="absolute inset-y-0 left-0 flex items-center pl-3">
								<Search className="text-gray-400 h-5 w-5" />
							</span>
							<Input
								type="text"
								placeholder="Buscar por nome..."
								value={searchTerm}
								onChange={(e) => setSearchTerm(e.target.value)}
								className="pl-10 pr-10 w-full"
							/>
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

						<span className="text-sm text-muted-foreground">ou</span>
						<OwnerFilter
							owners={owners}
							selectedOwnerIds={selectedOwnerIds}
							setSelectedOwnerIds={setSelectedOwnerIds}
						/>
						<StatusFilter
							selectedStatus={selectedStatus}
							setSelectedStatus={setSelectedStatus}
						/>
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

					{/* Skeletons enquanto carrega */}
					{isLoading && (
						<div className="flex flex-wrap gap-8 justify-center">
							{Array.from({ length: 15 }, (_, index) => (
								<SkeletonCardDashboards key={`skeleton-${index + 1}`} />
							))}
						</div>
					)}

					{error && (
						<p className="text-sm text-muted-foreground">
							Erro ao carregar filtros: {String(error)}
						</p>
					)}

					<div className="flex flex-wrap gap-8 justify-center">
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

					{!isLoading && !error && filteredData?.length === 0 && (
						<p className="text-sm text-muted-foreground">
							Nenhum filtro encontrado para {searchTerm}.
						</p>
					)}

					{/* Loading Spinner */}
					{isLoadingRoute && (
						<motion.div
							className="fixed inset-0 z-50 flex items-center justify-center bg-white bg-opacity-75"
							initial={{ opacity: 0 }}
							animate={{ opacity: 1 }}
							exit={{ opacity: 0 }}
						>
							<motion.div
								className="flex flex-col items-center justify-center gap-4"
								animate={{ scale: [1, 1.2, 1], opacity: [1, 0.7, 1] }}
								transition={{
									repeat: Number.POSITIVE_INFINITY,
									duration: 1.5,
									ease: 'easeInOut',
								}}
							>
								<Image
									src="/assets/icons/icon-chart.svg"
									alt="Loading icon"
									width={100}
									height={100}
								/>
								<motion.p
									initial={{ opacity: 0 }}
									animate={{ opacity: 1 }}
									transition={{
										duration: 0.8,
										repeat: Number.POSITIVE_INFINITY,
										repeatDelay: 1,
									}}
								>
									Carregando...
								</motion.p>
							</motion.div>
						</motion.div>
					)}
				</div>
			</main>
		</>
	);
}
