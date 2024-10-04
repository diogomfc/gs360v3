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
	Calendar,
	CalendarIcon,
	ClipboardList,
	ClipboardPlus,
	Dot,
	FileClock,
	Flame,
	GitCommitHorizontal,
	TrendingUp,
} from 'lucide-react';

import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
} from '@/components/ui/accordion';
import { useDataLimite } from '@/hooks/use-data-limite';
import { usePriority } from '@/hooks/use-prioridade';
import { logosCliente, priorities, statuses } from '../../../data';
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
	status: string;
	produto: string;
	priority: string;
	dataLimite: string;
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
	produto,
	priority,
	dataLimite,
}: JiraIssueModalProps) {
	const logo = getLogoByCliente(cliente); // Obtém o logo do cliente
	const { icon: statusIcon, color: statusColor } = getStatusDetails(status); // Obtém os detalhes do status

	function shortenProgramName(name: string) {
		return name.replace(/ - Monitors$/, '').replace(/Eccox /, '');
	}

	// Use o hook usePriority para obter os dados da prioridade
	const { priority: priorityData } = usePriority({
		priorityValue: priority,
		priorities, // Passe a lista de prioridades
	});

	if (!priorityData) {
		return null;
	}

	// Utiliza o hook useDataLimite para calcular a data limite
	const { formattedEndDate, daysLeftText, textColorClass, bgColorClass } =
		useDataLimite({
			dataLimite: dataLimite,
		});

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
									<div className="flex flex-col gap-1">
										<div className="flex items-center space-x-1 gap-1">
											<span className="text-sm font-medium">{cliente}</span>
											<Badge
												variant="secondary"
												className="bg-green-100 text-green-800 max-w-[150px] truncate "
											>
												70% Real
											</Badge>
										</div>

										<p className="text-xs text-muted-foreground">{summary}</p>
									</div>
								</div>
							</div>
							<div className="flex items-center justify-between space-x-4">
								<div className="flex items-center space-x-4">
									{produto ? (
										<Badge
											variant="secondary"
											className="max-w-[150px] truncate"
										>
											<span className="text-[10px]">
												{shortenProgramName(produto)}
											</span>
										</Badge>
									) : (
										<div className="text-muted-foreground text-[10px]">
											Sem Produto
										</div>
									)}

									<div
										className="flex items-center gap-2"
										style={{ color: statusColor }}
									>
										{statusIcon}
										<span className="text-xs">{status}</span>
									</div>

									{/* Status prioridade */}
									<div className="flex items-center justify-center">
										<div
											className="text-xs rounded-sm flex p-1 items-center justify-center gap-1 "
											style={{
												backgroundColor: `${priorityData.color}20`,
												color: priorityData.color,
											}}
										>
											{priorityData.icon ? (
												<priorityData.icon
													className="h-4 w-4 text-muted-foreground/60"
													style={{
														color: priorityData.color,
														fill: priorityData.color,
														fillOpacity: 0.1,
													}}
												/>
											) : (
												<Flame // Insira um ícone padrão aqui
													className="h-4 w-4 text-muted-foreground/60"
													style={{
														color: priorityData.color,
														fill: priorityData.color,
														fillOpacity: 0.1,
													}}
												/>
											)}
											<span className="mr-1"> {priorityData.label}</span>
										</div>
									</div>

									{/* Data limite */}
									<div
										className={`flex items-center p-1 justify-center rounded-sm border ${bgColorClass}`}
									>
										<div
											className={`flex w-16 items-center justify-center gap-1 rounded-t-sm ${bgColorClass}`}
										>
											<Calendar size={14} className={textColorClass} />
											<span
												className={`text-xs font-semibold ${textColorClass}`}
											>
												{formattedEndDate}
											</span>
										</div>

										<Dot className={`${textColorClass} h-2 w-2 mr-1`} />

										{/* Texto com dias restantes */}
										<span className={`text-xs font-light ${textColorClass}`}>
											{daysLeftText}
										</span>
									</div>

									{/* <div className="flex items-center space-x-2">
										<CalendarIcon className="h-4 w-4 text-muted-foreground" />
										<span className="text-xs text-muted-foreground">
											30-09 - 60 dias
										</span>
									</div> */}
								</div>
							</div>
						</div>
					</Card>

					<Accordion type="multiple" className="w-full  col-span-6  ">
						<Card className="flex  items-center col-span-6 gap-4 p-4 rounded-xl">
							<AccordionItem value="item-1" className="w-full border-none">
								<AccordionTrigger className="text-left">
									<div>
										<div className="font-semibold">Escopo E Status Geral</div>
									</div>
								</AccordionTrigger>
								<AccordionContent>
									<Card className="col-span-2">
										<CardHeader className="bg-[#f0f6ff] py-4 rounded-t-xl">
											<CardTitle className="text-sm font-medium flex items-center">
												<TrendingUp className="h-4 w-4 inline mr-2" />
												Alcance
											</CardTitle>
										</CardHeader>
										<CardContent className="text-xs pt-2">
											{descricao}
										</CardContent>
									</Card>
									<Card className="col-span-2">
										<CardHeader className="bg-[#f0f6ff] py-4 rounded-t-xl">
											<CardTitle className="text-xs font-medium flex items-center">
												<GitCommitHorizontal className="h-4 w-4 inline mr-2" />
												Estado Inicial
											</CardTitle>
										</CardHeader>
										<CardContent className="text-xs pt-2">
											{estadoInicial}
										</CardContent>
									</Card>
									<Card className="col-span-2">
										<CardHeader className="bg-[#f0f6ff] py-4 rounded-t-xl">
											<CardTitle className="text-xs font-medium flex items-center">
												<ActivityIcon className="h-4 w-4 inline mr-2" />
												Estado Atual
											</CardTitle>
										</CardHeader>
										<CardContent className="text-xs pt-2">
											{estadoAtual}
										</CardContent>
									</Card>
									<Card className="col-span-3">
										<CardHeader className="bg-[#f0f6ff] py-4 rounded-t-xl">
											<CardTitle className="text-xs font-medium flex items-center">
												<ClipboardList className="h-4 w-4 inline mr-2" />
												Últimas Atividades
											</CardTitle>
										</CardHeader>
										<CardContent className="text-xs pt-2">
											{ultimasAtividades}
										</CardContent>
									</Card>
									<Card className="col-span-3">
										<CardHeader className="bg-[#f0f6ff] py-4  rounded-t-xl">
											<CardTitle className="text-xs font-medium flex items-center">
												<ClipboardPlus className="h-4 w-4 inline mr-2" />
												Próximas Atividades
											</CardTitle>
										</CardHeader>
										<CardContent className="text-xs pt-2">
											{proximasAtividades}
										</CardContent>
									</Card>
								</AccordionContent>
							</AccordionItem>
						</Card>
						<AccordionItem value="item-2">
							<AccordionTrigger className="text-left">
								<div>
									<div className="font-semibold">(R) Risco / (I) Issue</div>
									<div className="text-sm text-muted-foreground">
										Última atualização
									</div>
								</div>
							</AccordionTrigger>
							<AccordionContent>
								Content for (R) Risco / (I) Issue goes here.
							</AccordionContent>
						</AccordionItem>
						<AccordionItem value="item-3">
							<AccordionTrigger className="text-left">
								<div>
									<div className="font-semibold">Macro do Plano</div>
									<div className="text-sm text-muted-foreground">
										Última atualização
									</div>
								</div>
							</AccordionTrigger>
							<AccordionContent>
								Content for Macro do Plano goes here.
							</AccordionContent>
						</AccordionItem>
					</Accordion>
				</div>
			</DialogContent>
		</Dialog>
	);
}
