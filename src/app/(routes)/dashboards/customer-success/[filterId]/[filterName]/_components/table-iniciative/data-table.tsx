// 'use client';
// import { motion } from 'framer-motion';
// import * as React from 'react';

// import {
// 	type ColumnDef,
// 	type ColumnFiltersState,
// 	type SortingState,
// 	type VisibilityState,
// 	flexRender,
// 	getCoreRowModel,
// 	getFacetedRowModel,
// 	getFacetedUniqueValues,
// 	getFilteredRowModel,
// 	getPaginationRowModel,
// 	getSortedRowModel,
// 	useReactTable,
// } from '@tanstack/react-table';

// import {
// 	Table,
// 	TableBody,
// 	TableCell,
// 	TableHead,
// 	TableHeader,
// 	TableRow,
// } from '@/components/ui/table';

// import { DataTablePagination } from './data-table-pagination';
// import { DataTableToolbar } from './data-table-toolbar';
// import { Card } from '@/components/ui/card';

// interface DataTableProps<TData, TValue> {
// 	columns: ColumnDef<TData, TValue>[];
// 	data: TData[];
// }

// const rowVariants = {
// 	hidden: { opacity: 0, y: 20 },
// 	visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
// };

// export function DataTable<TData, TValue>({
// 	columns,
// 	data,
// }: DataTableProps<TData, TValue>) {
// 	const [rowSelection, setRowSelection] = React.useState({});
// 	const [columnVisibility, setColumnVisibility] =
// 		React.useState<VisibilityState>({
// 			cliente: true,
// 			summary: true,
// 			responsável: false,
// 			status: true,
// 			priority: false,
// 			'data limite': false,
// 		});

// 	const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
// 		[],
// 	);
// 	const [sorting, setSorting] = React.useState<SortingState>([]);

// 	const table = useReactTable({
// 		data,
// 		columns,
// 		state: {
// 			sorting,
// 			columnVisibility,
// 			rowSelection,
// 			columnFilters,
// 		},
// 		initialState: {
// 			columnVisibility: {
// 				cliente: true,
// 				summary: true,
// 				status: false,
// 				priority: false,
// 				responsável: false,
// 				'data limite': false,
// 			},
// 			pagination: {
// 				pageSize: 6,
// 				pageIndex: 0,
// 			},
// 		},
// 		enableRowSelection: true,
// 		onRowSelectionChange: setRowSelection,
// 		onSortingChange: setSorting,
// 		onColumnFiltersChange: setColumnFilters,
// 		onColumnVisibilityChange: setColumnVisibility,
// 		getCoreRowModel: getCoreRowModel(),
// 		getFilteredRowModel: getFilteredRowModel(),
// 		getPaginationRowModel: getPaginationRowModel(),
// 		getSortedRowModel: getSortedRowModel(),
// 		getFacetedRowModel: getFacetedRowModel(),
// 		getFacetedUniqueValues: getFacetedUniqueValues(),
// 	});

// 	return (
// 		<Card className="flex flex-col gap-2 rounded-lg border  bg-slate-100 py-2">
// 			  <DataTableToolbar table={table} />
// 			<div className=" border-y ">
// 				<Table className="table-auto w-full bg-white">
// 					<TableHeader className="bg-slate-50">
// 						{table.getHeaderGroups().map((headerGroup) => (
// 							<TableRow key={headerGroup.id}>
// 								{headerGroup.headers.map((header) => {
// 									return (
// 										<TableHead key={header.id} colSpan={header.colSpan}>
// 											{header.isPlaceholder
// 												? null
// 												: flexRender(
// 														header.column.columnDef.header,
// 														header.getContext(),
// 													)}
// 										</TableHead>
// 									);
// 								})}
// 							</TableRow>
// 						))}
// 					</TableHeader>
// 					<TableBody>
// 						{table.getRowModel().rows?.length ? (
// 							table.getRowModel().rows.map((row) => (
// 								<motion.tr
// 									key={row.id}
// 									variants={rowVariants}
// 									initial="hidden"
// 									animate="visible"
// 									className="border-b transition-colors hover:bg-muted/50"
// 								>
// 									{row.getVisibleCells().map((cell) => (
// 										<TableCell key={cell.id} className="p-2 align-middle">
// 											{flexRender(
// 												cell.column.columnDef.cell,
// 												cell.getContext(),
// 											)}
// 										</TableCell>
// 									))}
// 								</motion.tr>
// 							))
// 						) : (
// 							<TableRow>
// 								<TableCell
// 									colSpan={columns.length}
// 									className="h-24 text-center"
// 								>
// 									Sem resultado.
// 								</TableCell>
// 							</TableRow>
// 						)}
// 					</TableBody>
// 				</Table>
// 			</div>
// 			<DataTablePagination table={table} />
// 		</Card>
// 	);
// }

'use client';
import { motion } from 'framer-motion';
import * as React from 'react';

import {
	type ColumnDef,
	type ColumnFiltersState,
	type SortingState,
	type VisibilityState,
	flexRender,
	getCoreRowModel,
	getFacetedRowModel,
	getFacetedUniqueValues,
	getFilteredRowModel,
	getPaginationRowModel,
	getSortedRowModel,
	useReactTable,
} from '@tanstack/react-table';

import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from '@/components/ui/table';

import { DataTablePagination } from './data-table-pagination';
import { DataTableToolbar } from './data-table-toolbar';
import { Card } from '@/components/ui/card';

interface DataTableProps<TData, TValue> {
	columns: ColumnDef<TData, TValue>[];
	data: TData[];
	columnVisibility?: VisibilityState; // Adiciona prop opcional para columnVisibility
	pagination?: { pageSize: number; pageIndex: number }; // Adiciona prop opcional para paginação
}

const rowVariants = {
	hidden: { opacity: 0, y: 20 },
	visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

export function DataTable<TData, TValue>({
	columns,
	data,
	columnVisibility: initialColumnVisibility, // Recebendo a visibilidade inicial como prop
	pagination: initialPagination, // Recebendo a paginação inicial como prop
}: DataTableProps<TData, TValue>) {
	const [rowSelection, setRowSelection] = React.useState({});
	const [columnVisibility, setColumnVisibility] =
		React.useState<VisibilityState>(
			initialColumnVisibility || {
				cliente: true,
				summary: true,
				responsável: true,
				status: true,
				priority: true,
				'data limite': true,
			}
		);

	const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
		[],
	);
	const [sorting, setSorting] = React.useState<SortingState>([]);

	const table = useReactTable({
		data,
		columns,
		state: {
			sorting,
			columnVisibility,
			rowSelection,
			columnFilters,
		},
		initialState: {
			columnVisibility: initialColumnVisibility || {
				cliente: true,
				summary: true,
				status: true,
				priority: true,
				responsável: true,
				'data limite': true,
			},
			pagination: initialPagination || {
				pageSize: 6,
				pageIndex: 0,
			},
		},
		enableRowSelection: true,
		onRowSelectionChange: setRowSelection,
		onSortingChange: setSorting,
		onColumnFiltersChange: setColumnFilters,
		onColumnVisibilityChange: setColumnVisibility,
		getCoreRowModel: getCoreRowModel(),
		getFilteredRowModel: getFilteredRowModel(),
		getPaginationRowModel: getPaginationRowModel(),
		getSortedRowModel: getSortedRowModel(),
		getFacetedRowModel: getFacetedRowModel(),
		getFacetedUniqueValues: getFacetedUniqueValues(),
	});

	return (
		<Card className="flex flex-col gap-2 rounded-lg border bg-slate-100 py-2">
			<DataTableToolbar table={table} />
			<div className="border-y">
				<Table className="table-auto w-full bg-white">
					<TableHeader className="bg-slate-50">
						{table.getHeaderGroups().map((headerGroup) => (
							<TableRow key={headerGroup.id}>
								{headerGroup.headers.map((header) => {
									return (
										<TableHead key={header.id} colSpan={header.colSpan}>
											{header.isPlaceholder
												? null
												: flexRender(
														header.column.columnDef.header,
														header.getContext(),
													)}
										</TableHead>
									);
								})}
							</TableRow>
						))}
					</TableHeader>
					<TableBody>
						{table.getRowModel().rows?.length ? (
							table.getRowModel().rows.map((row) => (
								<motion.tr
									key={row.id}
									variants={rowVariants}
									initial="hidden"
									animate="visible"
									className="border-b transition-colors hover:bg-muted/50"
								>
									{row.getVisibleCells().map((cell) => (
										<TableCell key={cell.id} className="p-2 align-middle">
											{flexRender(
												cell.column.columnDef.cell,
												cell.getContext(),
											)}
										</TableCell>
									))}
								</motion.tr>
							))
						) : (
							<TableRow>
								<TableCell colSpan={columns.length} className="h-24 text-center">
									Sem resultado.
								</TableCell>
							</TableRow>
						)}
					</TableBody>
				</Table>
			</div>
			<DataTablePagination table={table} />
		</Card>
	);
}

