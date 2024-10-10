'use client';

import {
	Card,
	CardContent,
	CardFooter,
	CardHeader,
} from '@/components/ui/card';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useJiraFilter } from '@/http/jira/get-jira-filter-id';

import PageHeader from '@/app/(routes)/_components/page-header';
import { Button } from '@/components/ui/button';
import {
	DropdownMenuCheckboxItem,
	DropdownMenuContent,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { DropdownMenu } from '@radix-ui/react-dropdown-menu';
import { StopwatchIcon } from '@radix-ui/react-icons';
import {
	CircleHelp,
	File,
	ListFilter,
	OctagonPause,
	RocketIcon,
	Search,
} from 'lucide-react';
import Image from 'next/image';
import { OverviewYear } from '../visao-geral/_components/overviwer/overview-year';
import { ProgramList } from '../visao-geral/_components/program-list';
import { ListInitiatives } from './_components/list-iniciatives';
import { PieChartInitiatives } from './_components/pie-chart-initiatives';
import { StatusCard } from './_components/status-card';

interface JiraFilterDetailsProps {
	params: { filterId: string; filterName: string };
}

export default function VisaoGeral02({ params }: JiraFilterDetailsProps) {
	const { filterId, filterName } = params;
	const { data: jiraData, isLoading, isError } = useJiraFilter(filterId);

	if (isLoading) return <div>Loading...</div>;
	if (isError) return <div>Error loading data...</div>;

	const produtoCounts = Object.entries(jiraData?.produtoCounts || {});

	return (
		<>
			<PageHeader
				title={`${decodeURIComponent(filterName)} - Visão Geral` || 'Dashboard'}
				icon={
					<Image
						src="/icon-dashboard-filter.svg"
						alt="Dashboard"
						width={20}
						height={20}
					/>
				}
			/>
			<div className="relative flex-1 h-[calc(100vh-61px)] overflow-auto bg-muted/40">
				<div className="flex flex-col sm:gap-4 sm:py-4 ">
					<main className="grid flex-1 items-start gap-4   p-4 sm:px-6 sm:py-0 md:gap-5 lg:grid-cols-3 xl:grid-cols-3">
						<div className="grid grid-cols-1 gap-5">
							{/* Card de Iniciativas */}
							<Card className="overflow-hidden">
								<CardHeader className="flex flex-col bg-muted/50 p-0">
									<PieChartInitiatives jiraData={jiraData} />
								</CardHeader>
								<CardContent className="p-6 flex flex-col gap-4">
									<div className="grid gap-3">
										<div className="font-semibold">Visão geral do status</div>
										<StatusCard
											icon={<CircleHelp size={24} color="#327dd2" />}
											label="Backlog"
											count={
												(jiraData?.statusCounts?.Backlog || 0) +
												(jiraData?.statusCounts?.['Tarefas Onboarding'] || 0) +
												(jiraData?.statusCounts?.['Tarefas Ongoing'] || 0) +
												(jiraData?.statusCounts?.['Tarefas Suporte'] || 0)
											}
											color="#005CE8"
										/>
										<StatusCard
											icon={<OctagonPause size={24} color="#a6b5c7" />}
											label="Impedimento"
											count={
												(jiraData?.statusCounts?.['Impedimento Onboarding'] ||
													0) +
												(jiraData?.statusCounts?.['Impedimento Ongoing'] || 0) +
												(jiraData?.statusCounts?.['Impedimento Suporte'] || 0)
											}
											color="#a6b5c7"
										/>
										<StatusCard
											icon={<RocketIcon size={24} color="#2A9D90" />}
											label="Concluído"
											count={jiraData?.statusCounts?.Concluído || 0}
											color="#2A9D90"
										/>
										<StatusCard
											icon={
												<StopwatchIcon
													height={24}
													width={24}
													strokeWidth={2}
													color="#E8C468"
												/>
											}
											label="Em andamento"
											count={jiraData?.statusCounts?.['Em andamento'] || 0}
											color="#E8C468"
										/>
									</div>
								</CardContent>
								<CardFooter className="flex flex-row items-center border-t bg-muted/50 px-6 py-3">
									<div className="text-xs text-muted-foreground">
										Atualizado{' '}
										<time dateTime={new Date().toISOString()}>
											{new Date().toLocaleString('pt-BR', {
												dateStyle: 'long',
												timeStyle: 'short',
											})}
										</time>
									</div>
								</CardFooter>
							</Card>

							{/* Card de Programas */}
							<Card>
								<ProgramList produtoCounts={produtoCounts} />
							</Card>
						</div>

						<div className="grid auto-rows-max items-start gap-4 md:gap-5 lg:col-span-2">
							<div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-5">
								<div className="col-span-1 lg:col-span-2">
									<Tabs defaultValue="todos">
										<div className="flex items-center">
											<TabsList>
												<TabsTrigger value="todos" className="text-xs">
													Todos
												</TabsTrigger>
												<TabsTrigger value="backlog" className="text-xs">
													Backlog
												</TabsTrigger>
												<TabsTrigger value="impedimento" className="text-xs">
													Impedimento
												</TabsTrigger>
												<TabsTrigger value="concluido" className="text-xs">
													Concluído
												</TabsTrigger>
												<TabsTrigger value="andamento" className="text-xs">
													Em andamento
												</TabsTrigger>
											</TabsList>
											<div className="relative ml-auto flex-1 md:grow-0">
												<Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
												<Input
													type="search"
													placeholder="Buscar por cliente..."
													className="w-full rounded-lg bg-background pl-8 md:w-[200px] lg:w-[336px] text-xs"
												/>
											</div>
											<div className="ml-auto flex items-center gap-2">
												<DropdownMenu>
													<DropdownMenuTrigger asChild>
														<Button
															variant="outline"
															size="sm"
															className="h-7 gap-1 text-sm"
														>
															<ListFilter className="h-3.5 w-3.5" />
															<span className="sr-only sm:not-sr-only">
																Filter
															</span>
														</Button>
													</DropdownMenuTrigger>
													<DropdownMenuContent align="end">
														<DropdownMenuLabel>Filter by</DropdownMenuLabel>
														<DropdownMenuSeparator />
														<DropdownMenuCheckboxItem checked>
															Fulfilled
														</DropdownMenuCheckboxItem>
														<DropdownMenuCheckboxItem>
															Declined
														</DropdownMenuCheckboxItem>
														<DropdownMenuCheckboxItem>
															Refunded
														</DropdownMenuCheckboxItem>
													</DropdownMenuContent>
												</DropdownMenu>
												<Button
													size="sm"
													variant="outline"
													className="h-7 gap-1 text-sm"
												>
													<File className="h-3.5 w-3.5" />
													<span className="sr-only sm:not-sr-only">Export</span>
												</Button>
											</div>
										</div>
										<TabsContent value="todos">
											{/* <Card x-chunk="dashboard-05-chunk-3">
												<CardHeader className="px-7">
													<CardTitle className="font-semibold">
														Iniciativas
													</CardTitle>
													<CardDescription className="text-xs text-muted-foreground">
														Total de 50 iniciativas
													</CardDescription>
												</CardHeader>
												<CardContent>
													<Table>
														<TableHeader>
															<TableRow>
																<TableHead>Customer</TableHead>
																<TableHead className="hidden sm:table-cell">
																	Type
																</TableHead>
																<TableHead className="hidden sm:table-cell">
																	Status
																</TableHead>
																<TableHead className="hidden md:table-cell">
																	Date
																</TableHead>
																<TableHead className="text-right">
																	Amount
																</TableHead>
															</TableRow>
														</TableHeader>
														<TableBody>
															<TableRow className="bg-accent">
																<TableCell>
																	<div className="font-medium">
																		Liam Johnson
																	</div>
																	<div className="hidden text-sm text-muted-foreground md:inline">
																		liam@example.com
																	</div>
																</TableCell>
																<TableCell className="hidden sm:table-cell">
																	Sale
																</TableCell>
																<TableCell className="hidden sm:table-cell">
																	<Badge
																		className="text-xs"
																		variant="secondary"
																	>
																		Fulfilled
																	</Badge>
																</TableCell>
																<TableCell className="hidden md:table-cell">
																	2023-06-23
																</TableCell>
																<TableCell className="text-right">
																	$250.00
																</TableCell>
															</TableRow>
															<TableRow>
																<TableCell>
																	<div className="font-medium">
																		Olivia Smith
																	</div>
																	<div className="hidden text-sm text-muted-foreground md:inline">
																		olivia@example.com
																	</div>
																</TableCell>
																<TableCell className="hidden sm:table-cell">
																	Refund
																</TableCell>
																<TableCell className="hidden sm:table-cell">
																	<Badge className="text-xs" variant="outline">
																		Declined
																	</Badge>
																</TableCell>
																<TableCell className="hidden md:table-cell">
																	2023-06-24
																</TableCell>
																<TableCell className="text-right">
																	$150.00
																</TableCell>
															</TableRow>
															<TableRow>
																<TableCell>
																	<div className="font-medium">
																		Noah Williams
																	</div>
																	<div className="hidden text-sm text-muted-foreground md:inline">
																		noah@example.com
																	</div>
																</TableCell>
																<TableCell className="hidden sm:table-cell">
																	Subscription
																</TableCell>
																<TableCell className="hidden sm:table-cell">
																	<Badge
																		className="text-xs"
																		variant="secondary"
																	>
																		Fulfilled
																	</Badge>
																</TableCell>
																<TableCell className="hidden md:table-cell">
																	2023-06-25
																</TableCell>
																<TableCell className="text-right">
																	$350.00
																</TableCell>
															</TableRow>
															<TableRow>
																<TableCell>
																	<div className="font-medium">Emma Brown</div>
																	<div className="hidden text-sm text-muted-foreground md:inline">
																		emma@example.com
																	</div>
																</TableCell>
																<TableCell className="hidden sm:table-cell">
																	Sale
																</TableCell>
																<TableCell className="hidden sm:table-cell">
																	<Badge
																		className="text-xs"
																		variant="secondary"
																	>
																		Fulfilled
																	</Badge>
																</TableCell>
																<TableCell className="hidden md:table-cell">
																	2023-06-26
																</TableCell>
																<TableCell className="text-right">
																	$450.00
																</TableCell>
															</TableRow>
															<TableRow>
																<TableCell>
																	<div className="font-medium">
																		Liam Johnson
																	</div>
																	<div className="hidden text-sm text-muted-foreground md:inline">
																		liam@example.com
																	</div>
																</TableCell>
																<TableCell className="hidden sm:table-cell">
																	Sale
																</TableCell>
																<TableCell className="hidden sm:table-cell">
																	<Badge
																		className="text-xs"
																		variant="secondary"
																	>
																		Fulfilled
																	</Badge>
																</TableCell>
																<TableCell className="hidden md:table-cell">
																	2023-06-23
																</TableCell>
																<TableCell className="text-right">
																	$250.00
																</TableCell>
															</TableRow>
															<TableRow>
																<TableCell>
																	<div className="font-medium">
																		Liam Johnson
																	</div>
																	<div className="hidden text-sm text-muted-foreground md:inline">
																		liam@example.com
																	</div>
																</TableCell>
																<TableCell className="hidden sm:table-cell">
																	Sale
																</TableCell>
																<TableCell className="hidden sm:table-cell">
																	<Badge
																		className="text-xs"
																		variant="secondary"
																	>
																		Fulfilled
																	</Badge>
																</TableCell>
																<TableCell className="hidden md:table-cell">
																	2023-06-23
																</TableCell>
																<TableCell className="text-right">
																	$250.00
																</TableCell>
															</TableRow>
															<TableRow>
																<TableCell>
																	<div className="font-medium">
																		Olivia Smith
																	</div>
																	<div className="hidden text-sm text-muted-foreground md:inline">
																		olivia@example.com
																	</div>
																</TableCell>
																<TableCell className="hidden sm:table-cell">
																	Refund
																</TableCell>
																<TableCell className="hidden sm:table-cell">
																	<Badge className="text-xs" variant="outline">
																		Declined
																	</Badge>
																</TableCell>
																<TableCell className="hidden md:table-cell">
																	2023-06-24
																</TableCell>
																<TableCell className="text-right">
																	$150.00
																</TableCell>
															</TableRow>
														</TableBody>
													</Table>

												</CardContent>
											</Card> */}
											<ListInitiatives
												initiatives={
													jiraData?.iniciativas.map((issue) => ({
														initiativeId: issue.id,
														summary: issue.summary,
														status: issue.status,
														cliente: issue.cliente,
														fallback: issue.cliente[0],
														endDate: issue.dataLimite,
														color: 'gray',
													})) || []
												}
											/>
										</TabsContent>
										<TabsContent value="backlog">
											<ListInitiatives
												initiatives={
													jiraData?.iniciativas.map((issue) => ({
														initiativeId: issue.id,
														summary: issue.summary,
														status: issue.status,
														cliente: issue.cliente,
														fallback: issue.cliente[0],
														endDate: issue.dataLimite,
														color: 'gray',
													})) || []
												}
												status="Backlog"
											/>
										</TabsContent>
										<TabsContent value="impedimento">
											<ListInitiatives
												initiatives={
													jiraData?.iniciativas.map((issue) => ({
														initiativeId: issue.id,
														summary: issue.summary,
														status: issue.status,
														cliente: issue.cliente,
														fallback: issue.cliente[0],
														endDate: issue.dataLimite,
														color: 'gray',
													})) || []
												}
												status="Impedimento"
											/>
										</TabsContent>
										<TabsContent value="concluido">
											<ListInitiatives
												initiatives={
													jiraData?.iniciativas.map((issue) => ({
														initiativeId: issue.id,
														summary: issue.summary,
														status: issue.status,
														cliente: issue.cliente,
														fallback: issue.cliente[0],
														endDate: issue.dataLimite,
														color: 'gray',
													})) || []
												}
												status="Concluído"
											/>
										</TabsContent>
										<TabsContent value="andamento">
											<ListInitiatives
												initiatives={
													jiraData?.iniciativas.map((issue) => ({
														initiativeId: issue.id,
														summary: issue.summary,
														status: issue.status,
														cliente: issue.cliente,
														fallback: issue.cliente[0],
														endDate: issue.dataLimite,
														color: 'gray',
													})) || []
												}
												status="Em andamento"
											/>
										</TabsContent>
									</Tabs>
								</div>
								{/* Gráficos lado a lado, cada um ocupando uma coluna */}
								<Card>
									<OverviewYear jiraData={jiraData} />
								</Card>
								<Card>
									<OverviewYear jiraData={jiraData} />
								</Card>
							</div>
						</div>
					</main>
				</div>
			</div>
		</>
	);
}
