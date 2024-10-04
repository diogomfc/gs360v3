'use client';

import { motion } from 'framer-motion';

import { Card } from '@/components/ui/card';

interface AnimatedCardProps {
	icon: JSX.Element;
	color: string;
	title: string;
	count: number;
}

export function CardStatus({ icon, color, title, count }: AnimatedCardProps) {
	return (
		<motion.div
			whileHover={{ scale: 1.02 }}
			transition={{ duration: 0.3 }}
			className="h-full w-full"
		>
			<Card className="flex h-full w-full items-center space-x-4 rounded-lg p-6 duration-300 ease-in-out">
				<motion.div
					className="flex h-16 w-16 items-center justify-center rounded-full"
					style={{ backgroundColor: color }}
				>
					{icon}
				</motion.div>
				<div className="flex flex-grow flex-col">
					<span className="text-sm font-medium">{title}</span>
					<motion.span
						className="text-2xl font-bold text-gray-800"
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.5, delay: 0.5 }}
					>
						{count}
					</motion.span>
				</div>
			</Card>
		</motion.div>
	);
}
