import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useJiraFilter } from '@/http/jira/get-jira-filter-id';
import { FileClock } from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';
import { useState } from 'react';
import { logosCliente, statuses } from '../../../data';
import { JiraIssueModal } from '../../../iniciativas/_components/modal-row-actions/data-Issue-modal';
import { DateIcon } from './date-icon';

function calculateDateStatus(endDate: string) {
	const end = new Date(endDate);
	const now = new Date();

	if (Number.isNaN(end.getTime())) {
		return {
			color: 'text-red-400',
			text: 'a definir',
			bgColorClass: 'bg-red-100',
		};
	}

	const remainingDays = Math.ceil(
		(end.getTime() - now.getTime()) / (1000 * 3600 * 24),
	);

	let color = 'text-blue-500';
	let bgColorClass = 'bg-white';
	let text = `${remainingDays} dias restantes`;

	if (remainingDays > 0) {
		color = 'text-blue-500';
		text = `${remainingDays} dias restantes`;
		bgColorClass = 'bg-blue-50';
	} else if (remainingDays === 0) {
		color = 'text-yellow-800';
		bgColorClass = 'bg-yellow-100';
		text = 'Último dia';
	} else {
		color = 'text-red-800';
		bgColorClass = 'bg-red-50';
		text = 'Data expirada';
	}

	return { color, bgColorClass, text };
}

function getLogoByCliente(cliente: string) {
	const normalizedCliente = cliente.trim().toLowerCase();
	const logoData = logosCliente.find(
		(logoItem) => logoItem.cliente.trim().toLowerCase() === normalizedCliente,
	);
	return logoData ? logoData.logo : '';
}

function getStatusDetails(status: string) {
	const statusDetail = statuses.find((s) => s.label === status);
	if (statusDetail) {
		return {
			icon: <statusDetail.icon size={16} color={statusDetail.color} />,
			color: statusDetail.color,
		};
	}
	return {
		icon: <FileClock size={16} color="#9E9E9E" />,
		color: '#9E9E9E',
	};
}

interface InitiativeItemProps {
	cliente: string;
	fallback: string;
	summary: string;
	status: string;
	endDate: string;
	initiativeId: string;
}

interface JiraData {
	iniciativas: {
		cliente: string;
		descricao: string;
		estadoAtual: string;
		estadoInicial: string;
		ultimasAtividades: string;
		proximasAtividades: string;
		status: string;
		riscoOuIssue: string;
		summary: string;
		produto: string;
		priority: string;
		dataLimite: string;
	}[];
}

type ParamsData = {
	filterId: string;
	filterName: string;
};

export function InitiativeItem({
	cliente,
	fallback,
	summary,
	status,
	endDate,
	initiativeId,
}: InitiativeItemProps) {
	const router = useRouter();
	const params = useParams() as ParamsData;
	const { filterId } = params;
	const { data: jiraData } = useJiraFilter(filterId);

	const [modalOpen, setModalOpen] = useState(false);
	const [modalData, setModalData] = useState<any>(null);

	const openModal = (initiative: any) => {
		setModalData(initiative);
		setModalOpen(true);
	};

	const closeModal = () => setModalOpen(false);

	const { color, bgColorClass, text } = calculateDateStatus(endDate);
	const logo = getLogoByCliente(cliente);
	const { icon: statusIcon, color: statusColor } = getStatusDetails(status);

	// Encontra a iniciativa específica com base no initiativeId
	const selectedInitiative = jiraData?.iniciativas.find(
		(initiative) => initiative.id === initiativeId,
	);

	return (
		<>
			<div
				onClick={() => openModal(selectedInitiative)}
				onKeyUp={() => openModal(selectedInitiative)}
				className="flex cursor-pointer items-center justify-between rounded-md border-b border-muted p-2 transition-colors duration-200 hover:bg-muted"
			>
				<div className="flex items-center">
					<Avatar className="flex h-9 w-9 items-center justify-center space-y-0 border">
						<AvatarImage src={logo} alt="Avatar" className="h-6 w-6" />
						<AvatarFallback>{fallback}</AvatarFallback>
					</Avatar>
					<div className="ml-4 space-y-1">
						<div className="text-xs font-medium leading-none sm:max-w-[200px] md:max-w-[400px] lg:max-w-[350px] truncate">
							{summary}
						</div>
						<div
							className="flex items-center gap-2"
							style={{ color: statusColor }}
						>
							{statusIcon}
							<span className="text-xs">{status}</span>
						</div>
					</div>
				</div>
				<DateIcon
					endDate={endDate}
					remainingDays={text}
					color={color}
					bgColorClass={bgColorClass}
				/>
			</div>

			{/* Modal Dinâmico */}
			{modalData && (
				<JiraIssueModal
					isOpen={modalOpen}
					onClose={closeModal}
					title={'Detalhes gerais'}
					description={modalData.descricao}
					cliente={modalData.cliente}
					descricao={modalData.descricao}
					estadoAtual={modalData.estadoAtual}
					estadoInicial={modalData.estadoInicial}
					ultimasAtividades={modalData.ultimasAtividades}
					proximasAtividades={modalData.proximasAtividades}
					status={modalData.status}
					riscoOuIssue={modalData.riscoOuIssue}
					summary={modalData.summary}
					produto={modalData.produto}
					priority={modalData.priority}
					dataLimite={modalData.dataLimite}
				/>
			)}
		</>
	);
}
