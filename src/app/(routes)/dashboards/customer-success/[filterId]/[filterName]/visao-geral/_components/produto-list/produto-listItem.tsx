'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { motion } from 'framer-motion';

interface ProdutoListItemProps {
	imageSrc: string;
	title: string;
	count: number;
}

// Função para encurtar o nome do Produtoa
function shortenProdutoName(name: string) {
	return name.replace(/ - Monitors$/, '').replace(/Eccox /, '');
}

export function ProdutoListItem({
	imageSrc,
	title,
	count,
}: ProdutoListItemProps) {
	return (
		<motion.li
			initial={{ opacity: 0, x: -20 }}
			animate={{ opacity: 1, x: 0 }}
			transition={{ duration: 0.5 }}
			className="flex items-center justify-between"
		>
			<div className="flex items-center gap-2">
				<div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#005CE8]/10">
					{/* <Image src={imageSrc} alt={`${title} logo`} className="h-6 w-6" /> */}
					<Avatar className="flex h-6 w-6 items-center justify-center space-y-0 border">
						<AvatarImage
							src={imageSrc}
							alt={`${title} logo`}
							className="h-4 w-4"
						/>
						<AvatarFallback>{title.slice(0, 2)}</AvatarFallback>
					</Avatar>
				</div>
				<span className="text-xs font-medium text-muted-foreground">
					{shortenProdutoName(title)}
				</span>
			</div>
			<div className="mx-8 flex-grow border-b border-dotted border-muted-foreground/20" />
			<span className="text-sm font-bold text-[#19284D]">{count}</span>
		</motion.li>
	);
}
