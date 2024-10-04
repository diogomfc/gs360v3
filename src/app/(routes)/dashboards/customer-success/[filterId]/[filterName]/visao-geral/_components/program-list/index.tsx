'use client';

import { Card, CardContent } from '@/components/ui/card';

import { productLogos } from '../../../data';
import { ProgramListItem } from './program-listItem';

interface ProgramListProps {
	produtoCounts: [string, number][];
}

export function ProgramList({ produtoCounts }: ProgramListProps) {
	return (
		<Card className="h-[300px] flex flex-col">
			<div className="rounded-t-lg bg-slate-100 px-5 py-4">
				<div className="flex justify-between">
					<div className="flex flex-row items-center justify-center">
						<h1 className="font-semibold">Produtos</h1>
					</div>
				</div>
			</div>
			<CardContent className="mb-3 flex-grow overflow-y-auto pt-3">
				<ul className="space-y-3">
					{produtoCounts.map(([programName, count]) => {
						const imageSrc =
							productLogos[programName] || '/assets/logo-produtos/QMG.png';
						return (
							<ProgramListItem
								key={programName}
								imageSrc={imageSrc}
								title={programName}
								count={count}
							/>
						);
					})}
				</ul>
			</CardContent>
		</Card>
	);
}
