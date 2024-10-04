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
import {
	FileBox,
	FileChartLine,
	FileCheck2,
	FileDiff,
	FileText,
} from 'lucide-react';
import { useState } from 'react';
import { JiraIssueModal } from './modal-row-actions/data-Issue-modal';

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
					<DropdownMenuItem
						className="cursor-pointer"
						onSelect={() => openModal('Status Geral', jiraIssue.status)}
					>
						<div className="flex hover:text-[#0862B1]">
							<FileChartLine className="w-4 h-4 mr-2" />
							<span className="text-xs">Status</span>
						</div>
					</DropdownMenuItem>
					<DropdownMenuItem
						className="cursor-pointer"
						onSelect={() => openModal('Escopo', jiraIssue.produto)}
					>
						<div className="flex hover:text-[#0862B1]">
							<FileBox className="w-4 h-4 mr-2" />
							<span className="text-xs">Escopo</span>
						</div>
					</DropdownMenuItem>
					<DropdownMenuItem
						className="cursor-pointer"
						onSelect={() => openModal('Risco / Issue', jiraIssue.risco)}
					>
						<div className="flex hover:text-[#0862B1]">
							<FileDiff className="w-4 h-4 mr-2" />
							<span className="text-xs">Risco / Issue</span>
						</div>
					</DropdownMenuItem>
					<DropdownMenuItem
						className="cursor-pointer"
						onSelect={() => openModal('Macro do Plano', jiraIssue.acao)}
					>
						<div className="flex hover:text-[#0862B1]">
							<FileCheck2 className="w-4 h-4 mr-2" />
							<span className="text-xs">Macro do Plano</span>
						</div>
					</DropdownMenuItem>
				</DropdownMenuContent>
			</DropdownMenu>

			{/* Modal Dinâmico */}
			<JiraIssueModal
				isOpen={modalOpen}
				onClose={closeModal}
				title={modalTitle}
				description={modalDescription}
				cliente={jiraIssue.cliente}
				descricao={jiraIssue.descricao}
				estadoAtual={jiraIssue.estadoAtual}
				estadoInicial={jiraIssue.estadoInicial}
				ultimasAtividades={jiraIssue.ultimasAtividades}
				proximasAtividades={jiraIssue.proximasAtividades}
				// endDate={jiraIssue.estadoInicial}
				status={jiraIssue.status}
				summary={jiraIssue.summary}
			/>
		</>
	);
}
