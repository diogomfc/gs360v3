import { Button } from '@/components/ui/button';
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

import type { JiraIssue } from '@/http/jira/get-jira-filter-id';
import { DotsHorizontalIcon } from '@radix-ui/react-icons';
import type { Row } from '@tanstack/react-table';
import { FileText } from 'lucide-react';
import { useState } from 'react';
import { DashboardModal } from '../../_components/modal-row-actions/dashboard-modal';

interface DataTableRowActionsProps<TData> {
	row: Row<TData>;
}

export function DataTableRowActions<TData>({
	row,
}: DataTableRowActionsProps<TData>) {
	const jiraIssue = row.original as JiraIssue;

	// Estados para controlar abertura da modal e conteúdo dinâmico
	const [modalOpen, setModalOpen] = useState(false);
	const [modalTitle, setModalTitle] = useState('');
	const [modalDescription, setModalDescription] = useState('');



	const openModal = (title: string, description: string) => {
		setModalTitle(title);
		setModalDescription(description);
		setModalOpen(true);
	};

	const closeModal = () => setModalOpen(false);

	return (
		<>
			<DropdownMenu>
				<DropdownMenuTrigger asChild>
					<Button variant="ghost" className="flex h-8 w-8 p-0 hover:bg-muted">
						<DotsHorizontalIcon className="h-4 w-4" />
						<span className="sr-only">Menu actions</span>
					</Button>
				</DropdownMenuTrigger>
				<DropdownMenuContent align="end" className="w-[160px]">
					<DropdownMenuItem
						className="cursor-pointer"
						onSelect={() => openModal('Detalhes gerais', jiraIssue.descricao)}
					>
						<div className="flex hover:text-[#0862B1]">
							<FileText className="w-4 h-4 mr-2" />
							<span className="text-xs">Detalhes geral</span>
						</div>
					</DropdownMenuItem>
				</DropdownMenuContent>
			</DropdownMenu>

			{/* Modal Dinâmico */}

			<DashboardModal
				isOpen={modalOpen}
				onClose={closeModal}
				title={modalTitle}
				description={modalDescription}
				cliente={jiraIssue.cliente}
				responsavel={jiraIssue.responsavel}
				reporter={jiraIssue.reporter}
				descricao={jiraIssue.descricao}
				estadoAtual={jiraIssue.estadoAtual}
				estadoInicial={jiraIssue.estadoInicial}
				ultimasAtividades={jiraIssue.ultimasAtividades}
				proximasAtividades={jiraIssue.proximasAtividades}
				status={jiraIssue.status}
				impacto={jiraIssue.impacto}
				risco={jiraIssue.risco}
				riscoOuIssue={jiraIssue.riscoOuIssue}
				acao={jiraIssue.acao}
				summary={jiraIssue.summary}
				produto={jiraIssue.produto}
				priority={jiraIssue.priority}
				dataLimite={jiraIssue.dataLimite}
				startDate={jiraIssue.startDate}
				keyIssue={jiraIssue.key}
			/>
		</>
	);
}
