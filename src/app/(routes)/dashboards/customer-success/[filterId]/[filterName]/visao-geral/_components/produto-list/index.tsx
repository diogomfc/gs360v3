'use client';

import { Card, CardContent } from '@/components/ui/card';

import { productLogos } from '../../../../../../data';
import { ProdutoListItem } from './produto-listItem';

interface ProdutoListProps {
	counts: [string, number][];
}

export function ProdutoList({ counts }: ProdutoListProps) {
	return (
		<Card className="h-[300px] flex flex-col rounded-lg">
			<div className="rounded-t-lg bg-slate-100 px-5 py-4 text-sm">
				<div className="flex justify-between">
					<div className="flex flex-row items-center justify-center">
						<h1 className="font-semibold">Produtos</h1>
					</div>
				</div>
			</div>
			<CardContent className="mb-3 flex-grow overflow-y-auto pt-3">
				<ul className="space-y-3">
					{counts.map(([produtoName, count]) => {
						const imageSrc =
							productLogos[produtoName] || '/assets/logo-produtos/QMG.png';
						return (
							<ProdutoListItem
								key={produtoName}
								imageSrc={imageSrc}
								title={produtoName}
								count={count}
							/>
						);
					})}
				</ul>
			</CardContent>
		</Card>
	);
}
