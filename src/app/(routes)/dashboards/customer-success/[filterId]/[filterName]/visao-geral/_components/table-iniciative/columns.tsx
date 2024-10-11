'use client';

import type { ColumnDef } from '@tanstack/react-table';

import { Badge } from '@/components/ui/badge';

import type { JiraIssue } from '@/http/jira/get-jira-filter-id';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

import { DataTableColumnHeader } from './data-table-column-header';

import { useDataLimite } from '@/hooks/use-data-limite';
import { usePriority } from '@/hooks/use-prioridade';

import {
	logosCliente,
	priorities,
	statuses,
} from '@/app/(routes)/dashboards/data';
import { Calendar } from 'lucide-react';
import { DataTableRowActions } from './data-table-row-actions';

export const mapStatus = (status: string) => {
	if (status.startsWith('Impedimento')) {
		return 'Impedimento';
	}
	if (status.startsWith('Tarefas')) {
		return 'Backlog';
	}
	return status;
};

export const columns: ColumnDef<JiraIssue>[] = [
	// {
	// 	id: 'select',
	// 	header: ({ table }) => (
	// 		<Checkbox
	// 			checked={
	// 				table.getIsAllPageRowsSelected() ||
	// 				(table.getIsSomePageRowsSelected() && 'indeterminate')
	// 			}
	// 			onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
	// 			aria-label="Select all"
	// 			className="translate-y-[2px] "
	// 		/>
	// 	),
	// 	cell: ({ row }) => (
	// 		<Checkbox
	// 			checked={row.getIsSelected()}
	// 			onCheckedChange={(value) => row.toggleSelected(!!value)}
	// 			aria-label="Select row"
	// 			className="translate-y-[2px]"
	// 		/>
	// 	),
	// 	enableSorting: false,
	// 	enableHiding: false,
	// },

	//coluna 'key' do jira
	// {
	// 	accessorKey: 'key',
	// 	header: ({ column }) => (
	// 		<DataTableColumnHeader
	// 			className="text-xs"
	// 			column={column}
	// 			title="Id-Jira"
	// 		/>
	// 	),
	// 	cell: ({ row }) => (
	// 		<div className="w-[40px] text-[11px]">{row.getValue('key')}</div>
	// 	), // Aqui, você deve usar 'id' em vez de 'key'
	// 	enableSorting: false,
	// 	enableHiding: false,
	// },

	// coluna logo do cliente
	{
		accessorKey: 'cliente',
		header: ({ column }) => (
			<DataTableColumnHeader column={column} title="Cliente" />
		),
		cell: ({ row }) => {
			const AvatarCliente = logosCliente.find(
				(avatarCliente) => avatarCliente.cliente === row.getValue('cliente'),
			);

			if (!AvatarCliente) {
				return null;
			}

			return (
				<div className="flex items-center">
					<div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
						{AvatarCliente.logo && (
							<Avatar className="flex h-6 w-6 items-center justify-center space-y-0 border">
								<AvatarImage
									src={AvatarCliente.logo}
									alt="Avatar"
									className="h-4 w-4"
								/>
								<AvatarFallback>
									{AvatarCliente.cliente.charAt(0).toUpperCase()}
								</AvatarFallback>
							</Avatar>
						)}
					</div>
					<span className="ml-2 text-xs font-medium  max-w-[150px] truncate ">
						{row.getValue('cliente')}
					</span>
				</div>
			);
		},
	},
	// coluna 'summary - produto' do jira
	{
		accessorKey: 'summary',
		header: ({ column }) => (
			<DataTableColumnHeader column={column} title="Iniciativa" />
		),
		cell: ({ row }) => {
			const produto = row.original.produto;
			const iniciativa = row.original.summary;

			// Função para encurtar o nome do programa
			function shortenProgramName(name: string) {
				return name.replace(/ - Monitors$/, '').replace(/Eccox /, '');
			}

			return (
				<div className="flex items-center space-x-2">
					{/* Verifica se produto não está vazio antes de renderizar o Badge */}
					{produto ? (
						<Badge variant="secondary" className="">
							<span className="text-[10px]">{shortenProgramName(produto)}</span>
						</Badge>
					) : (
						<div className="text-muted-foreground text-[10px]">Sem Produto</div>
					)}
					<span className=" text-xs">{iniciativa}</span>
				</div>
			);
		},
	},

	//coluna 'reporter' do jira - Responsável
	{
		accessorKey: 'responsável',
		header: ({ column }) => (
			<DataTableColumnHeader column={column} title="Responsável" />
		),
		cell: ({ row }) => {
			const reporter = row.original.reporter.displayName;

			const nomes = reporter.split(' ');
			const primeiroNome = nomes[0];
			const ultimoNome = nomes[nomes.length - 1];
			const nomeFormatado = `${primeiroNome} ${ultimoNome}`;
			const AvatarResponsavel = row.original.reporter.avatarUrls;

			return (
				<div className="flex items-center">
					<Avatar className="flex h-6 w-6 items-center justify-center space-y-0 border">
						<AvatarImage
							src={AvatarResponsavel}
							alt="Avatar"
							className="h-6 w-6"
						/>
						<AvatarFallback className="text-xs text-muted-foreground">
							{reporter.charAt(0).toUpperCase()}
						</AvatarFallback>
					</Avatar>
					<span className="ml-2 text-[12px] text-xs max-w-[100px] truncate">
						{nomeFormatado}
					</span>
				</div>
			);
		},
	},

	// coluna 'status' do jira
	{
		accessorKey: 'status',
		header: ({ column }) => (
			<DataTableColumnHeader column={column} title="Status" />
		),
		cell: ({ row }) => {
			// Encontrar o status unificado
			const unifiedStatusValue = mapStatus(row.getValue('status'));
			const status = statuses.find(
				(status) => status.value === unifiedStatusValue,
			);

			if (!status) {
				return null;
			}

			return (
				<div className="flex w-[120px]  items-center">
					{status.icon && (
						<status.icon
							className="mr-2 h-4 w-4"
							style={{
								color: status.color,
							}}
						/>
					)}

					<div className="text-xs rounded-sm px-1">
						<span
							className="font-normal text-xs "
							// style={{
							// 	color: status.color,
							// }}
						>
							{status.label}
						</span>
					</div>
				</div>
			);
		},

		filterFn: (row, id, value) => {
			// Aplicar a unificação dos status ao valor da célula
			const unifiedStatusValue = mapStatus(row.getValue(id));
			// Verificar se o valor do status unificado está dentro dos valores filtrados
			return value.some(
				(filterValue: string) => mapStatus(filterValue) === unifiedStatusValue,
			);
		},
	},

	// coluna 'priority' do jira
	{
		accessorKey: 'priority',
		header: ({ column }) => (
			<DataTableColumnHeader column={column} title="Prioridade" />
		),
		cell: ({ row }) => {
			// Utiliza o hook usePriority para calcular a prioridade
			const { priority } = usePriority({
				priorityValue: row.getValue('priority'),
				priorities: priorities,
			});

			if (!priority) {
				return null;
			}

			return (
				<div className="flex items-center text-xs">
					{priority.icon && (
						<priority.icon
							className="mr-2 h-4 w-4 text-muted-foreground/60 "
							style={{
								color: priority.color,
								fill: priority.color,
								fillOpacity: 0.1,
							}}
						/>
					)}
					<div
						className="text-xs rounded-sm px-1 "
						style={{
							backgroundColor: `${priority.color}20`,
							color: priority.color,
						}}
					>
						<span className=" font-semibold text-xs">{priority.label}</span>
					</div>
				</div>
			);
		},
		filterFn: (row, id, value) => {
			return value.includes(row.getValue(id));
		},
	},

	// coluna 'dataLimite' do jira
	{
		accessorKey: 'data limite',
		header: ({ column }) => (
			<DataTableColumnHeader column={column} title="Data Limite" />
		),
		cell: ({ row }) => {
			// Utiliza o hook useDataLimite para calcular a data limite
			const { formattedEndDate, daysLeftText, textColorClass, bgColorClass } =
				useDataLimite({
					dataLimite: row.original.dataLimite,
				});

			return (
				<div
					className={`flex flex-col items-center justify-center rounded-sm border ${bgColorClass}`}
				>
					{/* Icone do calendário com data sobreposta */}
					<div
						className={`flex w-16 items-center justify-center gap-1 rounded-t-sm ${bgColorClass}`}
					>
						<Calendar size={14} className={textColorClass} />
						<span className={`text-xs font-semibold ${textColorClass}`}>
							{formattedEndDate}
						</span>
					</div>

					{/* Texto com dias restantes */}
					<span className={`text-xs font-light ${textColorClass}`}>
						{daysLeftText}
					</span>
				</div>
			);
		},
	},

	{
		id: 'actions',
		cell: ({ row }) => <DataTableRowActions row={row} />,
	},
];
