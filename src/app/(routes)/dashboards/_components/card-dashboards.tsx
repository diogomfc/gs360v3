import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { Lock } from 'lucide-react'; // Importe o ícone de cadeado
import Image from 'next/image';

interface CardProps {
	title: string;
	description: string;
	authorName: string;
	authorImage: string;
	userCount: number;
	onAccess: () => void;
	disabled?: boolean;
}

export default function CardDashboards({
	title,
	description,
	authorName,
	authorImage,
	userCount,
	onAccess,
	disabled = false,
}: CardProps) {
	return (
		<motion.div
			className="bg-white shadow-md rounded-lg p-4 w-[400px] space-y-4"
			whileHover={
				!disabled
					? { scale: 1.05, boxShadow: '0px 10px 30px rgba(63, 160, 224, 0.3)' }
					: {}
			}
			transition={{ type: 'spring', stiffness: 200, damping: 10 }}
		>
			{/* Header do Card */}
			<div className="flex items-center gap-4">
				<Image
					src="/icon-card-dashboard-customer.svg"
					alt="Hexagonal Avatar"
					width={44}
					height={40}
				/>
				<div>
					<h1 className="text-base font-semibold truncate w-[300px]">
						{title}
					</h1>
					<p className="text-sm text-muted-foreground">{description}</p>
				</div>
			</div>

			{/* Rodapé com detalhes do autor e botão */}
			<div className="flex items-center justify-between">
				<div className="flex items-center gap-2 p-1 rounded-full bg-[#F0F6FF]">
					<Image
						src={authorImage}
						alt={`${authorName}'s avatar`}
						width={26}
						height={26}
						className="rounded-full"
					/>
					<div className="flex gap-5 mr-2">
						<p className="text-xs font-medium">{authorName}</p>
					</div>
				</div>

				{disabled ? (
					<Button
						variant="ghost"
						disabled
						className="bg-[#F0F6FF] text-[#3FA0E0] text-sm font-semibold border border-transparent px-4 py-1 rounded-full hover:bg-[#E3EBF6] transition"
					>
						<Lock className="w-4 h-4 mr-2" />
						Bloqueado
					</Button>
				) : (
					<Button
						variant="ghost"
						onClick={onAccess}
						className="bg-[#F0F6FF] text-[#3FA0E0] text-sm font-semibold border border-transparent px-4 py-1 rounded-full hover:bg-[#E3EBF6] hover:text-[#3FA0E0] hover:border-[#3FA0E0] transition"
					>
						Acessar
					</Button>
				)}
			</div>
		</motion.div>
	);
}
