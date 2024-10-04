import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
} from '@/components/ui/dialog';
import {
	ActivityIcon,
	CalendarIcon,
	ClipboardList,
	ClipboardPlus,
	FileClock,
	GitCommitHorizontal,
	TrendingUp,
} from 'lucide-react';

import { logosCliente, statuses } from '../../../data';
import { RadialChartWithLogoCliente } from './radial-chart-with-logo-cliente';

interface JiraIssueModalProps {
	onClose: () => void;
	isOpen: boolean;
	title: string;
	summary: string;
	description: string;
	cliente: string;
	descricao: string;
	estadoAtual: string;
	estadoInicial: string;
	ultimasAtividades: string;
	proximasAtividades: string;
	//endDate: string;
	status: string;
}

// Função para obter o logo do cliente a partir dos dados centralizados
function getLogoByCliente(cliente: string) {
	const normalizedCliente = cliente.trim().toLowerCase();
	const logoData = logosCliente.find(
		(logoItem) => logoItem.cliente.trim().toLowerCase() === normalizedCliente,
	);
	return logoData ? logoData.logo : ''; // Retorna o logo se encontrado
}

// Função para obter os detalhes do status a partir do arquivo centralizado
function getStatusDetails(status: string) {
	const statusDetail = statuses.find((s) => s.label === status);
	if (statusDetail) {
		return {
			icon: <statusDetail.icon size={16} color={statusDetail.color} />,
			color: statusDetail.color,
		};
	}
	// Retorna um ícone padrão caso o status não seja encontrado
	return {
		icon: <FileClock size={16} color="#9E9E9E" />,
		color: '#9E9E9E',
	};
}

export function JiraIssueModal({
	isOpen,
	onClose,
	title,
	cliente,
	descricao,
	estadoAtual,
	estadoInicial,
	ultimasAtividades,
	proximasAtividades,
	status,
	summary,
}: JiraIssueModalProps) {
	const logo = getLogoByCliente(cliente); // Obtém o logo do cliente
	const { icon: statusIcon, color: statusColor } = getStatusDetails(status); // Obtém os detalhes do status

	return (
		<Dialog open={isOpen} onOpenChange={onClose}>
			<DialogContent className="max-w-4xl ">
				<DialogHeader>
					<DialogTitle className="text-base font-bold">{title}</DialogTitle>
				</DialogHeader>
				<div className="grid grid-cols-6 gap-4 py-4">
					<Card className="flex items-center col-span-6 gap-4 p-4 rounded-xl">
						<div className="w-[100px]">
							<RadialChartWithLogoCliente
								logoUrl={logo}
								evolucao={90}
								cliente={cliente}
							/>
						</div>

						<div className="flex flex-col gap-2">
							<div className="flex items-center justify-between space-x-4">
								<div className="flex items-center space-x-4">
									<div>
										<p className="text-sm font-medium">{cliente}</p>
										<p className="text-xs text-muted-foreground">{summary}</p>
									</div>
								</div>
							</div>
							<div className="flex items-center justify-between space-x-4">
								<div className="flex items-center space-x-4">
									<Badge variant="secondary">QC</Badge>
									<div className="flex items-center space-x-1">
										<Badge
											variant="secondary"
											className="bg-green-100 text-green-800 max-w-[150px] truncate "
										>
											70% Real
										</Badge>
										<Badge
											variant="secondary"
											className="bg-green-100 text-green-800 max-w-[150px] truncate"
										>
											100% Planejado
										</Badge>
									</div>

									<div
										className="flex items-center gap-2"
										style={{ color: statusColor }}
									>
										{statusIcon}
										<span className="text-xs">{status}</span>
									</div>

									<Badge
										variant="destructive"
										className="max-w-[150px] truncate flex items-center justify-center"
									>
										Alto Risco
									</Badge>

									<div className="flex items-center space-x-2">
										<CalendarIcon className="h-4 w-4 text-muted-foreground" />
										<span className="text-xs text-muted-foreground">
											30-09 - 60 dias
										</span>
									</div>
								</div>
							</div>
						</div>
					</Card>

					<Card className="col-span-2">
						<CardHeader>
							<CardTitle className="text-sm font-medium flex items-center">
								<TrendingUp className="h-4 w-4 inline mr-2" />
								Alcance
							</CardTitle>
						</CardHeader>
						<CardContent className="text-xs">{descricao}</CardContent>
					</Card>
					<Card className="col-span-2">
						<CardHeader>
							<CardTitle className="text-sm font-medium flex items-center">
								<GitCommitHorizontal className="h-4 w-4 inline mr-2" />
								Estado Inicial
							</CardTitle>
						</CardHeader>
						<CardContent className="text-xs">{estadoInicial}</CardContent>
					</Card>
					<Card className="col-span-2">
						<CardHeader className="bg-[#f0f6ff] py-4">
							<CardTitle className="text-xs font-medium flex items-center">
								<ActivityIcon className="h-4 w-4 inline mr-2" />
								Estado Atual
							</CardTitle>
						</CardHeader>
						<CardContent className="text-xs pt-2">{estadoAtual}</CardContent>
					</Card>
					<Card className="col-span-3">
						<CardHeader>
							<CardTitle className="text-xs font-medium flex items-center">
								<ClipboardList className="h-4 w-4 inline mr-2" />
								Últimas Atividades
							</CardTitle>
						</CardHeader>
						<CardContent className="text-xs">{ultimasAtividades}</CardContent>
					</Card>
					<Card className="col-span-3">
						<CardHeader>
							<CardTitle className="text-xs font-medium flex items-center">
								<ClipboardPlus className="h-4 w-4 inline mr-2" />
								Próximas Atividades
							</CardTitle>
						</CardHeader>
						<CardContent className="text-xs">{proximasAtividades}</CardContent>
					</Card>
				</div>
			</DialogContent>
		</Dialog>
	);
}
