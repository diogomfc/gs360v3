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
import { Separator } from '@radix-ui/react-separator';
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
	riscoOuIssue: string;
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
	riscoOuIssue,
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
			<DialogContent className="max-w-4xl max-h-screen ">
				{/* Header fixo */}
				<DialogHeader className=" px-8 pt-4 sticky top-0 z-10">
					<DialogTitle className="text-base font-bold">{title}</DialogTitle>
					<header className="flex items-center gap-4">
						{/* Conteúdo do header */}
						<div className="w-[100px]">
							<RadialChartWithLogoCliente
								logoUrl={logo}
								evolucao={status === 'Concluído' ? 100 : 65}
								cliente={cliente}
							/>
						</div>
						<div className="flex flex-col gap-2">
							<div className="flex items-center justify-between space-x-4">
								<div className="flex items-center space-x-4">
									<div className="flex flex-col gap-1">
										<div className="flex items-center gap-1">
											<span className="text-sm font-medium">{cliente}</span>
											<Badge
												variant="secondary"
												className="bg-green-100 text-green-800 max-w-[150px] truncate"
											>
												{status === 'Concluído' ? '100%' : '65%'}
											</Badge>
										</div>
										<p className="text-xs text-muted-foreground">{summary}</p>
									</div>
								</div>
							</div>
							<div className="flex items-center gap-2">
								{/* Produtos */}
								{produto ? (
									<Badge
										variant="secondary"
										className="truncate rounded-sm py-1"
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
								{/* Status */}
								<div
									className="text-xs rounded-sm flex py-1 px-2 items-center justify-center gap-1 border"
									style={{
										color: statusColor,
										backgroundColor: `${statusColor}20`,
									}}
								>
									{statusIcon}
									<span className="text-xs">{status}</span>
								</div>
								{/* Status prioridade */}
								<div className="flex items-center justify-center">
									<div
										className="text-xs rounded-sm flex p-1 items-center justify-center gap-1 border"
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
											<Flame
												className="h-4 w-4 text-muted-foreground/60"
												style={{
													color: priorityData.color,
													fill: priorityData.color,
													fillOpacity: 0.1,
												}}
											/>
										)}
										<span className="mr-1">{priorityData.label}</span>
									</div>
								</div>
								{/* Data limite */}
								<div
									className={`flex items-center py-1 px-2 justify-center rounded-sm border ${bgColorClass}`}
								>
									<div
										className={`flex items-center justify-center gap-1 rounded-t-sm ${bgColorClass}`}
									>
										<Calendar size={14} className={textColorClass} />
										<span className={`text-xs font-semibold ${textColorClass}`}>
											{formattedEndDate}
										</span>
									</div>
									<Dot className={`${textColorClass} h-2 w-2 mr-1`} />
									<span className={`text-xs font-light ${textColorClass}`}>
										{daysLeftText}
									</span>
								</div>
							</div>
						</div>
					</header>
				</DialogHeader>
				{/* Conteúdo rolável */}
				<main className="overflow-y-auto px-8 max-h-[calc(100vh-220px)]">
					{/* Ajuste a altura conforme necessário */}
					<div className="col-span-6 gap-4 pb-4 ">
						<Accordion type="multiple" className="w-full gap-2 flex flex-col">
							{/*	Escopo e Status Geral */}
							<Card className="flex items-center col-span-6 gap-4 p-0 rounded-md">
								<AccordionItem
									value="item-1"
									className="w-full border-none px-4"
								>
									<AccordionTrigger className="text-left hover:no-underline hover:text-[#0862B1]">
										<span className="font-semibold text-[12px]">
											Escopo E Status Geral
										</span>
									</AccordionTrigger>
									<AccordionContent className="flex flex-col gap-2">
										{/* Cards de conteúdo */}
										<Card className="rounded-sm">
											<CardHeader className="bg-[#f0f6ff] py-4 rounded-t-sm">
												<CardTitle className="text-xs font-medium flex items-center">
													<TrendingUp className="h-4 w-4 inline mr-2" />
													Alcance
												</CardTitle>
											</CardHeader>
											<CardContent className="text-xs pt-4">
												{descricao}
											</CardContent>
										</Card>
										<Card className="rounded-sm">
											<CardHeader className="bg-[#f0f6ff] py-4 rounded-t-sm">
												<CardTitle className="text-xs font-medium flex items-center">
													<GitCommitHorizontal className="h-4 w-4 inline mr-2" />
													Estado Inicial
												</CardTitle>
											</CardHeader>
											<CardContent className="text-xs pt-2">
												{estadoInicial}
											</CardContent>
										</Card>
										<Card className="rounded-sm">
											<CardHeader className="bg-[#f0f6ff] py-4 rounded-t-sm">
												<CardTitle className="text-xs font-medium flex items-center">
													<ActivityIcon className="h-4 w-4 inline mr-2" />
													Estado Atual
												</CardTitle>
											</CardHeader>
											<CardContent className="text-xs pt-2">
												{estadoAtual}
											</CardContent>
										</Card>
										<Card className="rounded-sm">
											<CardHeader className="bg-[#f0f6ff] py-4 rounded-t-sm">
												<CardTitle className="text-xs font-medium flex items-center">
													<ClipboardList className="h-4 w-4 inline mr-2" />
													Últimas Atividades
												</CardTitle>
											</CardHeader>
											<CardContent className="text-xs pt-2">
												{ultimasAtividades}
											</CardContent>
										</Card>
										<Card className="rounded-sm">
											<CardHeader className="bg-[#f0f6ff] py-4  rounded-t-sm">
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
							{/*  Risco / Issue*/}
							<Card className="flex items-center col-span-6 gap-4 rounded-md p-0">
								<AccordionItem
									value="item-2"
									className="w-full border-none px-4"
								>
									<AccordionTrigger className="text-left hover:no-underline hover:text-[#0862B1]">
										<span className="font-semibold text-[12px]">
											Risco / Issue
										</span>
									</AccordionTrigger>
									<AccordionContent className="flex">
										<Card className="rounded-sm w-full">
											<CardContent className="flex items-center p-0">
												<span className="p-5 text-xs ">{riscoOuIssue}</span>
											</CardContent>
										</Card>
									</AccordionContent>
								</AccordionItem>
							</Card>
							{/*  Macro do plano */}
							<Card className="flex items-center col-span-6 gap-4 p-0 rounded-md">
								<AccordionItem
									value="item-3"
									className=" w-full border-none px-4"
								>
									<AccordionTrigger className="text-left hover:no-underline hover:text-[#0862B1]">
										<span className="font-semibold text-[12px]">
											Macro do Plano
										</span>
									</AccordionTrigger>

									<AccordionContent className="flex">
										<Card className="rounded-sm w-full">
											<CardContent className="flex items-center p-0">
												<span className="p-5 text-xs ">
													Macro do Plano não definido.
												</span>
											</CardContent>
										</Card>
									</AccordionContent>
								</AccordionItem>
							</Card>
						</Accordion>
					</div>
				</main>
			</DialogContent>
		</Dialog>
	);
}
