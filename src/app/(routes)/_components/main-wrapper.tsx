'use client';
import { sidebarOpen } from '@/hooks/atoms';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import { useAtom } from 'jotai';

export default function MainWrapper({
	children,
}: { children: React.ReactNode }) {
	const [isOpen] = useAtom(sidebarOpen);

	// Variantes de animação para o padding do main
	const mainVariants = {
		open: { paddingLeft: '16rem', transition: { duration: 0.3 } },
		closed: { paddingLeft: '3.5rem', transition: { duration: 0.3 } },
	};

	return (
		<motion.main
			className={cn(
				'flex-1 bg-white border rounded-xl overflow-auto shadow-lg',
			)}
			variants={mainVariants}
			animate={isOpen ? 'open' : 'closed'}
		>
			{children}
		</motion.main>
	);
}
