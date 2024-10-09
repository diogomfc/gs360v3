import {
	logosCliente,
	priorities,
	statuses,
} from '@/app/(routes)/dashboards/data';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from '@/components/ui/dialog';
import { Progress } from '@/components/ui/progress';
import {
	ResizableHandle,
	ResizablePanel,
	ResizablePanelGroup,
} from '@/components/ui/resizable';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import {
	Tooltip,
	TooltipContent,
	TooltipTrigger,
} from '@/components/ui/tooltip';
import { useDataLimite } from '@/hooks/use-data-limite';
import { usePriority } from '@/hooks/use-prioridade';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import {
	ActivityIcon,
	Calendar,
	CalendarCheck,
	CalendarDays,
	CheckCircle2,
	ChevronsRight,
	CircleCheckBig,
	Dot,
	FileClock,
	Flame,
	GitCommitHorizontal,
	Lightbulb,
	MessageSquareWarning,
	Siren,
	TrendingUp,
	TriangleAlert,
	XCircle,
} from 'lucide-react';
import JiraComments from './atividades-issue';
import { RadialChartWithLogoCliente } from './radial-chart-with-logo-cliente';

interface DashboardModalProps {
	isOpen: boolean;
	onClose(): void;
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
	acao: string;
	risco: string;
	impacto: string;
	produto: string;
	priority: string;
	startDate: string;
	dataLimite: string;
	keyIssue: string;
	responsavel: {
		accountId?: string;
		displayName: string;
		emailAddress?: string;
		avatarUrls?: string;
	};
	reporter: {
		accountId?: string;
		displayName: string;
		emailAddress?: string;
		avatarUrls?: string;
	};
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

// Função para formatar texto com quebras de linha
const FormattedText = ({ text }: { text: string }) => {
	return (
		<div>
			{text.split('\n').map((item) => {
				return <p key={item}>{item}</p>;
			})}
		</div>
	);
};

// Função para formatar texto com quebras de linha e icon de calendário para próximas atividades
const FormattedTextWithCalendar = ({ text }: { text: string }) => {
	return (
		<div className="flex flex-col gap-2">
			{text.split('\n').map((item) => {
				return (
					<p key={item} className="flex items-start">
						<CalendarDays className="w-4 h-4 mr-1" style={{ flexShrink: 0 }} />
						{item}
					</p>
				);
			})}
		</div>
	);
};

const FormattedTextWithCheck = ({ text }: { text: string }) => {
	return (
		<div className="flex flex-col gap-2">
			{text.split('\n').map((item) => {
				return (
					<p key={item} className="flex items-start">
						<CircleCheckBig
							className="w-4 h-4 mr-1 text-green-800"
							style={{ flexShrink: 0 }}
						/>
						{item}
					</p>
				);
			})}
		</div>
	);
};

export default function DashboardModal({
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
	risco,
	acao,
	impacto,
	summary,
	produto,
	priority,
	startDate,
	dataLimite,
	keyIssue,
	responsavel,
	reporter,
}: DashboardModalProps) {
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

	const FormattedDate = ({
		startDate,
	}: { startDate: Date | null | undefined }) => {
		// Verifica se a data é inválida
		if (!startDate || Number.isNaN(startDate.getTime())) {
			return '-- --'; // Retorna '-- --' se não houver data válida
		}

		const formattedDate = format(startDate, 'dd MMM', { locale: ptBR });
		return formattedDate;
	};

	// return (
	// 	<Dialog open={isOpen} onOpenChange={onClose}>
	// 		<DialogContent className="max-w-7xl ">
	// 			<DialogHeader>
	// 				<DialogTitle className="text-base font-bold">{title}</DialogTitle>
	// 			</DialogHeader>
	// 			<div className="grid grid-cols-3 gap-4">
	// 				{/* Escopo e status Geral */}
	// 				<Card className="col-span-2">
	// 					<CardHeader className="pb-4">
	// 						<CardTitle className="text-sm font-bold flex justify-between items-center">
	// 							<div>Escopo E Status Geral</div>
	// 							<div className="flex gap-2">
	// 								{/* Status */}
	// 								<div
	// 									title={`Status: ${status}`}
	// 									className="text-xs rounded-sm flex py-1 px-2 items-center justify-center gap-1 border cursor-help"
	// 									style={{
	// 										color: statusColor,
	// 										backgroundColor: `${statusColor}20`,
	// 									}}
	// 								>
	// 									{statusIcon}
	// 									<span className="text-xs">{status}</span>
	// 								</div>
	// 								{/* Status prioridade */}
	// 								<div
	// 									title={`Prioridade: ${priorityData.label}`}
	// 									className="flex items-center justify-center cursor-help"
	// 								>
	// 									<div
	// 										className="text-xs rounded-sm flex p-1 items-center justify-center gap-1 border"
	// 										style={{
	// 											backgroundColor: `${priorityData.color}20`,
	// 											color: priorityData.color,
	// 										}}
	// 									>
	// 										{priorityData.icon ? (
	// 											<priorityData.icon
	// 												className="h-4 w-4 text-muted-foreground/60"
	// 												style={{
	// 													color: priorityData.color,
	// 													fill: priorityData.color,
	// 													fillOpacity: 0.1,
	// 												}}
	// 											/>
	// 										) : (
	// 											<Flame
	// 												className="h-4 w-4 text-muted-foreground/60"
	// 												style={{
	// 													color: priorityData.color,
	// 													fill: priorityData.color,
	// 													fillOpacity: 0.1,
	// 												}}
	// 											/>
	// 										)}
	// 										<span className="mr-1">{priorityData.label}</span>
	// 									</div>
	// 								</div>
	// 								{/* Risco */}
	// 								<div
	// 									title={`Risco: ${risco}`}
	// 									className={` border rounded-sm bg-${risco === 'Sim' ? 'red' : 'green'}-100 text-${risco === 'Sim' ? 'red' : 'green'}-800 cursor-help flex items-center justify-center `}
	// 								>
	// 									<div className="text-xs  flex p-1 items-center justify-center gap-1 ">
	// 										<Siren className="h-4 w-4" />
	// 										<span className="mr-1">{risco}</span>
	// 									</div>
	// 								</div>

	// 								{/* Impacto */}
	// 								<div
	// 									title={`Impacto: ${impacto}`}
	// 									className={` border rounded-sm bg-${impacto === 'alto' ? 'red' : 'yellow'}-100 text-${impacto === 'alto' ? 'red' : 'yellow'}-800 cursor-help flex items-center justify-center `}
	// 								>
	// 									<div className="text-xs  flex p-1 items-center justify-center gap-1 ">
	// 										<TriangleAlert className="h-4 w-4" />
	// 										<span className="mr-1">{impacto}</span>
	// 									</div>
	// 								</div>
	// 							</div>

	// 							{/* Responsável */}
	// 							<div className="flex items-center">
	// 								<Avatar className="flex h-6 w-6 items-center justify-center space-y-0 border">
	// 									<AvatarImage
	// 										src={responsavel?.avatarUrls}
	// 										alt="Avatar"
	// 										className="h-6 w-6"
	// 									/>
	// 									<AvatarFallback className="text-xs text-muted-foreground">
	// 										{responsavel?.displayName.charAt(0).toUpperCase()}
	// 									</AvatarFallback>
	// 								</Avatar>
	// 								<div className="flex flex-col">
	// 									<span className="ml-2 text-[12px] text-xs ">
	// 										{responsavel?.displayName}
	// 									</span>
	// 									<span className="ml-2 text-[12px] text-xs  text-muted-foreground">
	// 										{responsavel?.emailAddress}
	// 									</span>
	// 								</div>
	// 							</div>
	// 						</CardTitle>
	// 					</CardHeader>
	// 					<CardContent>
	// 						<ScrollArea className="h-[200px] ">
	// 							{/* alcance */}
	// 							<div className="border border-b-gray-100 p-2 mb-2 rounded-sm">
	// 								<div className="text-sm font-semibold flex items-center mb-2">
	// 									<TrendingUp className="h-4 w-4 inline mr-2" />
	// 									Alcance
	// 								</div>

	// 								<p className="text-xs text-muted-foreground ">
	// 									{<FormattedText text={descricao} /> || 'Não informado'}
	// 								</p>
	// 							</div>

	// 							{/* Estado Inicial*/}
	// 							<div className="border border-b-gray-100 p-2 mb-2 rounded-sm">
	// 								<div className="text-sm font-semibold flex items-center mb-2">
	// 									<GitCommitHorizontal className="h-4 w-4 inline mr-2" />
	// 									Estado Inicial
	// 								</div>

	// 								<p className="text-xs text-muted-foreground ">
	// 									{<FormattedText text={estadoInicial} /> || 'Não informado'}
	// 								</p>
	// 							</div>

	// 							{/* Estado Atual */}
	// 							<div className="border border-b-gray-100 p-2 mb-2 rounded-sm">
	// 								<div className="text-sm font-semibold flex items-center mb-2">
	// 									<ActivityIcon className="h-4 w-4 inline mr-2" />
	// 									Estado Atual
	// 								</div>

	// 								<p className="text-xs text-muted-foreground ">
	// 									{<FormattedText text={estadoAtual} /> || 'Não informado'}
	// 								</p>
	// 							</div>

	// 							{/* (R) Risco / (I) Issue */}
	// 							<div className="border border-b-gray-100 p-2 mb-2 rounded-sm">
	// 								<div className="text-sm font-semibold flex items-center mb-2">
	// 									<MessageSquareWarning className="h-4 w-4 inline mr-2" />
	// 									(R) Risco / (I) Issue
	// 								</div>

	// 								<p className="text-xs text-muted-foreground ">
	// 									{<FormattedText text={riscoOuIssue} /> || 'Não informado'}
	// 								</p>
	// 							</div>

	// 							{/* Ação */}
	// 							<div className="border border-b-gray-100 p-2 mb-2 rounded-sm">
	// 								<div className="text-sm font-semibold flex items-center mb-2">
	// 									<Lightbulb className="h-4 w-4 inline mr-2" />
	// 									Ação
	// 								</div>

	// 								<p className="text-xs text-muted-foreground ">
	// 									{<FormattedText text={acao} /> || 'Não informado'}
	// 								</p>
	// 							</div>
	// 						</ScrollArea>
	// 					</CardContent>
	// 				</Card>

	// 				{/* Evolução */}
	// <Card className="col-span-1 row-span-2 ">
	// 	<div className="flex items-center my-4 mx-2">
	// 		<div className="flex items-center justify-center mb-4">
	// 			<div className="w-24 h-24">
	// 				<RadialChartWithLogoCliente
	// 					logoUrl={logo}
	// 					evolucao={status === 'Concluído' ? 100 : 65}
	// 					cliente={cliente}
	// 				/>
	// 			</div>
	// 		</div>

	// 		<div className="flex flex-col gap-2">
	// 			<div className="flex items-center justify-between space-x-4">
	// 				<div className="flex items-center space-x-4">
	// 					<div className="flex flex-col gap-1">
	// 						<div className="flex items-center gap-1">
	// 							{/* Produtos */}
	// 							{produto ? (
	// 								<Badge
	// 									variant="secondary"
	// 									className="truncate rounded-sm "
	// 								>
	// 									<span className="text-[10px]">
	// 										{shortenProgramName(produto)}
	// 									</span>
	// 								</Badge>
	// 							) : (
	// 								<div className="text-muted-foreground text-[10px]">
	// 									Sem Produto
	// 								</div>
	// 							)}
	// 							<span className="text-sm font-medium">{cliente}</span>
	// 						</div>
	// 						<p className="text-xs text-muted-foreground">{summary}</p>
	// 					</div>
	// 				</div>
	// 			</div>
	// 			<div className="flex items-center gap-2">
	// 				{/* startDate */}
	// 				<div className="flex items-center py-1 px-2 justify-center rounded-sm border">
	// 					<div className="flex items-center justify-center gap-1 rounded-t-sm">
	// 						<CalendarCheck size={14} />
	// 						<span className="text-xs font-semibold ">
	// 							{/* {startDate} */}
	// 							<FormattedDate startDate={new Date(startDate)} />
	// 						</span>
	// 					</div>
	// 				</div>

	// 				<ChevronsRight size={9} />

	// 				{/* Data limite */}
	// 				<div
	// 					className={`flex items-center py-1 px-2 justify-center rounded-sm border ${bgColorClass}`}
	// 				>
	// 					<div
	// 						className={`flex items-center justify-center gap-1 rounded-t-sm ${bgColorClass}`}
	// 					>
	// 						<Calendar size={14} className={textColorClass} />
	// 						<span
	// 							className={`text-xs font-semibold ${textColorClass}`}
	// 						>
	// 							{formattedEndDate}
	// 						</span>
	// 					</div>
	// 					<Dot className={`${textColorClass} h-2 w-2 mr-1`} />
	// 					<span className={`text-xs font-light ${textColorClass}`}>
	// 						{daysLeftText}
	// 					</span>
	// 				</div>
	// 			</div>
	// 		</div>
	// 	</div>
	// 	<div className="flex flex-col justify-between">
	// 		<div className="rounded-b-none border-b-0 rounded-t-2xl border-t">
	// 			<CardHeader className="pb-4">
	// 				<CardTitle className="text-sm font-bold flex justify-between items-center">
	// 					Ultimas Atividades
	// 				</CardTitle>
	// 			</CardHeader>
	// 			<CardContent className="text-xs">
	// 				<ScrollArea className="">
	// 					<FormattedTextWithCheck text={ultimasAtividades} />
	// 				</ScrollArea>
	// 			</CardContent>
	// 		</div>

	// 		<div className="rounded-b-none border-b-0 rounded-t-2xl border-t">
	// 			<CardHeader className="pb-4">
	// 				<CardTitle className="text-sm font-bold flex justify-between items-center">
	// 					Próximas Atividades
	// 				</CardTitle>
	// 			</CardHeader>
	// 			<CardContent className="text-xs">
	// 				<ScrollArea className="">
	// 					<FormattedTextWithCalendar text={proximasAtividades} />
	// 				</ScrollArea>
	// 			</CardContent>
	// 		</div>
	// 	</div>
	// </Card>

	// 				{/* Macro do Plano  */}
	// 				<Card className="col-span-2">
	// 					<CardHeader className="pb-4">
	// 						<CardTitle className="text-sm flex justify-between items-center">
	// 							<div className="flex gap-1">
	// 								<span className="font-bold">Macro do Plano</span>-
	// 								<span className="text-muted-foreground font-normal">
	// 									Acompanhe o progresso das atividades
	// 								</span>
	// 							</div>
	// 						</CardTitle>
	// 					</CardHeader>
	// 					<CardContent>
	// 						<ScrollArea className="h-[200px]">
	// 							<JiraComments issueId={keyIssue} />
	// 						</ScrollArea>
	// 					</CardContent>
	// 				</Card>
	// 			</div>
	// 		</DialogContent>
	// 	</Dialog>
	// );

	return (
		<Dialog open={isOpen} onOpenChange={onClose}>
			<DialogContent className="max-w-7xl ">
				<DialogHeader>
					<DialogTitle className="text-base font-bold">{title}</DialogTitle>
				</DialogHeader>
				<div className="grid grid-cols-3 gap-4">
					{/* Resizable Panel Group for "Escopo e Status Geral" and "Macro do Plano" */}
					<ResizablePanelGroup
						direction="vertical"
						className="col-span-2 max-h-full min-h-[600px] max-w-full rounded-2xl border"
					>
						<ResizablePanel defaultSize={200}>
							<Card>
								<CardHeader className="pb-4">
									<CardTitle className="text-sm font-bold flex justify-between items-center">
										<div>Escopo E Status Geral</div>
										{/* Status, prioridade, risco, impacto e responsável */}
										<div className="flex gap-2">
											{/* Status */}
											<div
												title={`Status: ${status}`}
												className="text-xs rounded-sm flex py-1 px-2 items-center justify-center gap-1 border cursor-help"
												style={{
													color: statusColor,
													backgroundColor: `${statusColor}20`,
												}}
											>
												{statusIcon}
												<span className="text-xs">{status}</span>
											</div>
											{/* Status prioridade */}
											<div
												title={`Prioridade: ${priorityData.label}`}
												className="flex items-center justify-center cursor-help"
											>
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
											{/* Risco */}
											<div
												title={`Risco: ${risco}`}
												className={` border rounded-sm bg-${risco === 'Sim' ? 'red' : 'green'}-100 text-${risco === 'Sim' ? 'red' : 'green'}-800 cursor-help flex items-center justify-center `}
											>
												<div className="text-xs  flex p-1 items-center justify-center gap-1 ">
													<Siren className="h-4 w-4" />
													<span className="mr-1">{risco}</span>
												</div>
											</div>

											{/* Impacto */}
											<div
												title={`Impacto: ${impacto}`}
												className={` border rounded-sm bg-${impacto === 'alto' ? 'red' : 'yellow'}-100 text-${impacto === 'alto' ? 'red' : 'yellow'}-800 cursor-help flex items-center justify-center `}
											>
												<div className="text-xs  flex p-1 items-center justify-center gap-1 ">
													<TriangleAlert className="h-4 w-4" />
													<span className="mr-1">{impacto}</span>
												</div>
											</div>
										</div>

										{/* Responsável */}
										<div className="flex items-center">
											<Avatar className="flex h-6 w-6 items-center justify-center space-y-0 border">
												<AvatarImage
													src={responsavel?.avatarUrls}
													alt="Avatar"
													className="h-6 w-6"
												/>
												<AvatarFallback className="text-xs text-muted-foreground">
													{responsavel?.displayName?.charAt(0).toUpperCase()}
												</AvatarFallback>
											</Avatar>
											<div className="flex flex-col">
												<span className="ml-2 text-[12px] text-xs ">
													{responsavel?.displayName || reporter?.displayName}
													{/* Exibe o assignee se não houver responsável */}
												</span>
												<span className="ml-2 text-[12px] text-xs  text-muted-foreground">
													{responsavel?.emailAddress ||
														reporter?.emailAddress ||
														'sem email'}
													{/* Exibe 'sem email' se não houver responsável */}
												</span>
											</div>
										</div>
									</CardTitle>
								</CardHeader>
								<CardContent>
									<ScrollArea className="h-[520px]">
										{/* Seus dados do escopo e status */}
										{/* alcance */}
										<div className="border border-b-gray-100 p-2 mb-2 rounded-sm">
											<div className="text-sm font-semibold flex items-center mb-2">
												<TrendingUp className="h-4 w-4 inline mr-2" />
												Alcance
											</div>

											<p className="text-xs text-muted-foreground ">
												{<FormattedText text={descricao} /> || 'Não informado'}
											</p>
										</div>

										{/* Estado Inicial*/}
										<div className="border border-b-gray-100 p-2 mb-2 rounded-sm">
											<div className="text-sm font-semibold flex items-center mb-2">
												<GitCommitHorizontal className="h-4 w-4 inline mr-2" />
												Estado Inicial
											</div>

											<p className="text-xs text-muted-foreground ">
												{<FormattedText text={estadoInicial} /> ||
													'Não informado'}
											</p>
										</div>

										{/* Estado Atual */}
										<div className="border border-b-gray-100 p-2 mb-2 rounded-sm">
											<div className="text-sm font-semibold flex items-center mb-2">
												<ActivityIcon className="h-4 w-4 inline mr-2" />
												Estado Atual
											</div>

											<p className="text-xs text-muted-foreground ">
												{<FormattedText text={estadoAtual} /> ||
													'Não informado'}
											</p>
										</div>

										{/* (R) Risco / (I) Issue */}
										<div className="border border-b-gray-100 p-2 mb-2 rounded-sm">
											<div className="text-sm font-semibold flex items-center mb-2">
												<MessageSquareWarning className="h-4 w-4 inline mr-2" />
												(R) Risco / (I) Issue
											</div>

											<p className="text-xs text-muted-foreground ">
												{<FormattedText text={riscoOuIssue} /> ||
													'Não informado'}
											</p>
										</div>

										{/* Ação */}
										<div className="border border-b-gray-100 p-2 mb-2 rounded-sm">
											<div className="text-sm font-semibold flex items-center mb-2">
												<Lightbulb className="h-4 w-4 inline mr-2" />
												Ação
											</div>

											<p className="text-xs text-muted-foreground ">
												{<FormattedText text={acao} /> || 'Não informado'}
											</p>
										</div>
									</ScrollArea>
								</CardContent>
							</Card>
						</ResizablePanel>

						<ResizableHandle withHandle className="" />

						<ResizablePanel
							defaultSize={200}
							className="shadow-lg shadow-black/25"
						>
							<Card className="">
								<CardHeader className="pb-4">
									<CardTitle className="text-sm font-bold flex justify-between items-center">
										<div className="flex gap-1">
											<span className="font-bold">Macro do Plano</span>
											<span className="text-muted-foreground font-normal">
												Acompanhe o progresso das atividades
											</span>
										</div>
									</CardTitle>
								</CardHeader>
								<CardContent>
									<ScrollArea className="h-[520px]">
										{/* Jira comments */}
										<JiraComments issueId={keyIssue} />
									</ScrollArea>
								</CardContent>
							</Card>
						</ResizablePanel>
					</ResizablePanelGroup>

					{/* Card fixo de Evolução */}
					<Card className="col-span-1 row-span-2 mb-4">
						<div className="flex items-center my-4 mx-2">
							<div className="flex items-center justify-center mb-4">
								<div className="w-24 h-24">
									<RadialChartWithLogoCliente
										logoUrl={logo}
										evolucao={status === 'Concluído' ? 100 : 65}
										cliente={cliente}
									/>
								</div>
							</div>

							<div className="flex flex-col gap-2">
								<div className="flex items-center justify-between space-x-4">
									<div className="flex items-center space-x-4">
										<div className="flex flex-col gap-1">
											<div className="flex items-center gap-1">
												{/* Produtos */}
												{produto ? (
													<Badge
														variant="secondary"
														className="truncate rounded-sm "
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
												<span className="text-sm font-medium">{cliente}</span>
											</div>
											<p className="text-xs text-muted-foreground">{summary}</p>
										</div>
									</div>
								</div>
								<div className="flex items-center gap-2">
									{/* startDate */}
									<div className="flex items-center py-1 px-2 justify-center rounded-sm border">
										<div className="flex items-center justify-center gap-1 rounded-t-sm">
											<CalendarCheck size={14} />
											<span className="text-xs font-semibold ">
												{/* {startDate} */}
												<FormattedDate startDate={new Date(startDate)} />
											</span>
										</div>
									</div>

									<ChevronsRight size={9} />

									{/* Data limite */}
									<div
										className={`flex items-center py-1 px-2 justify-center rounded-sm border ${bgColorClass}`}
									>
										<div
											className={`flex items-center justify-center gap-1 rounded-t-sm ${bgColorClass}`}
										>
											<Calendar size={14} className={textColorClass} />
											<span
												className={`text-xs font-semibold ${textColorClass}`}
											>
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
						</div>
						<div className="flex flex-col justify-between">
							<div className="rounded-b-none border-b-0 rounded-t-2xl border-t">
								<CardHeader className="pb-4">
									<CardTitle className="text-sm font-bold flex justify-between items-center">
										Ultimas Atividades
									</CardTitle>
								</CardHeader>
								<CardContent className="text-xs">
									<ScrollArea className="">
										<FormattedTextWithCheck text={ultimasAtividades} />
									</ScrollArea>
								</CardContent>
							</div>

							<div className="rounded-b-none border-b-0 rounded-t-2xl border-t">
								<CardHeader className="pb-4">
									<CardTitle className="text-sm font-bold flex justify-between items-center">
										Próximas Atividades
									</CardTitle>
								</CardHeader>
								<CardContent className="text-xs">
									<ScrollArea className="">
										<FormattedTextWithCalendar text={proximasAtividades} />
									</ScrollArea>
								</CardContent>
							</div>
						</div>
					</Card>
				</div>
			</DialogContent>
		</Dialog>
	);
}
