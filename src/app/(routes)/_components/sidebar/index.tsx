'use client';
import { sidebarOpen } from '@/hooks/atoms';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import { useAtom, useAtomValue } from 'jotai';
import {
	ArrowLeft,
	ArrowRight,
	BarChart3,
	Bell,
	FolderClosed,
	PieChart,
	Settings,
	SquareCheck,
	Users,
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useParams, usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useJiraFilters } from '@/http/jira/get-jira-filter';

import { Separator } from '@/components/ui/separator';
import { IconCronograma } from './icons/icon-cronograma';
import { IconDashboard } from './icons/icon-dashboard';
import { IconDocumentacao } from './icons/icon-documentacao';
import { IconIniciativas } from './icons/icon-iniciativas';
import { IconListDashboards } from './icons/icon-lis-dashboards';
import { NavbarLink } from './nav-bar-link';
import UserMenu from './user-menu';

export default function SidebarDash() {
	const { data } = useJiraFilters();
	const [isOpen, setOpen] = useAtom(sidebarOpen);
	const path = usePathname();
	const [isHovered, setIsHovered] = useState(false);
	//const { filterId, filterName } = useAtomValue(selectedFilterAtom);

	const params = useParams();
	const { filterId, filterName } = params;

	useEffect(() => {
		// Se for exatamente /dashboards, o sidebar inicia aberto
		if (path === '/dashboards') {
			setOpen(true);
		}
		// Se for uma sub-rota de /dashboards, o sidebar inicia fechado
		else if (path.startsWith('/dashboards/')) {
			setOpen(false);
		}
	}, [path, setOpen]);

	// Configuração de links dinâmicos por rota, com campo opcional "badge"
	const sidebarLinks = {
		'/dashboards': [
			{
				href: '#',
				label: 'Tarefas',
				icon: <SquareCheck size={20} />,
				// badge: 100,
			},
			{
				href: '#',
				label: 'Projetos',
				icon: <FolderClosed size={20} />,
			},
			{ href: '#', label: 'Equipe', icon: <Users size={20} /> },
			{
				href: '#',
				label: 'Relatórios',
				icon: <PieChart size={20} />,
			},
		],
		'/dashboards/customer-success': [
			{
				href: `/dashboards/customer-success/${filterId}/${filterName}/visao-geral`,
				label: 'Visão Geral',
				//icon: <FileChartPie size={20} />,
				icon: <IconDashboard width={20} height={20} />,
			},
			{
				href: `/dashboards/customer-success/${filterId}/${filterName}/iniciativas`,
				label: 'Iniciativas',
				icon: <IconIniciativas width={20} height={20} />,
				badge: data?.filters?.length || 0,
			},
			{
				href: `/dashboards/customer-success/${filterId}/${filterName}/cronograma`,
				label: 'Cronograma',
				icon: <IconCronograma width={20} height={20} />,
				//badge: 4, // Badge para Cronograma
			},
			// {
			// 	href: `/dashboards/customer-success/${filterId}/${filterName}/documentacao`,
			// 	label: 'Documentação',
			// 	icon: <IconDocumentacao width={20} height={20} />,
			// },
		],
	};

	// Animação para o sidebar
	const sidebarVariants = {
		open: { width: '16rem', transition: { duration: 0.3 } },
		closed: { width: '3.5rem', transition: { duration: 0.3 } },
	};

	// Animação para os botões
	const buttonVariants = {
		hover: { scale: 1.1 }, // Aumenta um pouco ao passar o mouse
	};

	// Função para normalizar o caminho, removendo parâmetros dinâmicos
	const normalizePath = (path: string) => {
		const segments = path.split('/');
		return segments.slice(0, 6).join('/'); // Ajuste conforme necessário para o seu caso
	};

	// Lógica para detectar subrotas dinâmicas
	const getMatchingLinks = () => {
		// Normaliza o path atual
		const normalizedPath = normalizePath(path);

		// Match dinâmico para customer-success
		if (normalizedPath.startsWith('/dashboards/customer-success')) {
			return sidebarLinks['/dashboards/customer-success'];
		}

		// Verifica se o normalizedPath começa com alguma rota configurada no sidebarLinks
		const key = Object.keys(sidebarLinks).find((key) =>
			normalizedPath.startsWith(key),
		) as keyof typeof sidebarLinks;

		return key ? sidebarLinks[key] : undefined;
	};

	const currentLinks = getMatchingLinks();

	// Ajuste a lógica de seleção dos links
	const isLinkActive = (link: string) => {
		return path.includes(link) || path.includes(link.split('/').pop() || '');
	};

	return (
		<motion.aside
			onMouseEnter={() => setIsHovered(true)}
			onMouseLeave={() => setIsHovered(false)}
			className={cn(
				'fixed border-r z-20 bg-white overflow-hidden rounded-l-xl',
				'flex flex-col h-full',
				// 'h-[calc(100vh-32px)]',
			)}
			variants={sidebarVariants}
			animate={isOpen ? 'open' : 'closed'}
		>
			{/* Sidebar header */}
			<div
				className={cn(
					'flex items-center h-[60px] border-b bg-muted/60',
					isOpen ? 'px-6' : 'flex-col justify-center ',
				)}
			>
				<Link
					href="/dashboards"
					className="flex items-center gap-2 font-semibold"
				>
					<Image
						src={isOpen ? '/logo-dark.svg' : '/logo-icon.svg'}
						alt="Gestão 360"
						width={isOpen ? 140 : 25}
						height={isOpen ? 40 : 25}
					/>
				</Link>
			</div>

			<nav className="flex flex-col flex-1 text-sm font-medium">
				<div
					className={cn(
						'flex flex-col',
						isOpen ? 'p-4' : 'items-center gap-y-4 py-4',
					)}
				>
					{/* Links fixos */}
					<NavbarLink
						href="/dashboards"
						isSidebarOpen={isOpen}
						icon={<IconListDashboards width={24} height={24} />}
						iconColor="#0862B1"
						isSelected={path === '/dashboards'}
						label={
							<div className="flex items-center w-full justify-between gap-x-2">
								Dashboards
								<Badge className="ml-auto bg-white hover:bg-white border border-[#0862B1] text-[#0862B1] flex items-center justify-center rounded-full h-4 min-w-[1.25rem] px-1 text-[11px]">
									{data?.filters?.length
										? data.filters.length > 99
											? '99+'
											: data.filters.length
										: '0'}
								</Badge>
							</div>
						}
					/>

					<div className="flex w-full px-2">
						<Separator className="bg-gray-200 " />
					</div>

					{/* Links dinâmicos baseados na rota */}
					{currentLinks?.map((link: any) => (
						<NavbarLink
							key={link.href}
							href={link.href}
							isSidebarOpen={isOpen}
							icon={link.icon}
							iconColor="#0862B1"
							isSelected={isLinkActive(link.href)}
							label={
								<div className="flex items-center w-full justify-between gap-x-2">
									{link.label}
									{/* Se o link tiver badge, exibe-o */}
									{link.badge && (
										<Badge className="ml-auto bg-white hover:bg-white border border-[#0862B1] text-[#0862B1] flex items-center justify-center rounded-full h-4 min-w-[1.25rem] px-1 text-[11px]">
											{link.badge > 99 ? '99+' : link.badge}
										</Badge>
									)}
								</div>
							}
						/>
					))}
				</div>

				{/* Centraliza o botão para abrir/fechar o sidebar */}
				{!isOpen && isHovered ? (
					<motion.div className="flex relative left-[25px] bottom-[60px] flex-1 items-center justify-center">
						<motion.div variants={buttonVariants} whileHover="hover">
							<Button
								variant="secondary"
								size="icon"
								className="opacity-70"
								onClick={() => setOpen(true)}
							>
								<ArrowRight className="h-4 w-4 relative right-2" />
								<span className="sr-only">Open Sidebar</span>
							</Button>
						</motion.div>
					</motion.div>
				) : isOpen && isHovered ? (
					<motion.div className="flex relative left-[125px] bottom-[60px] flex-1 items-center justify-center">
						<motion.div variants={buttonVariants} whileHover="hover">
							<Button
								variant="secondary"
								size="icon"
								className="opacity-70"
								onClick={() => setOpen(false)}
							>
								<ArrowLeft className="h-4 w-4 relative right-2" />
								<span className="sr-only">Close Sidebar</span>
							</Button>
						</motion.div>
					</motion.div>
				) : null}
			</nav>

			{/* Bottom section of the sidebar */}
			<div
				className={cn(
					'mt-auto flex flex-col border-b border-t',
					isOpen ? 'p-4  text-sm' : 'items-center gap-y-4 py-4',
				)}
			>
				<NavbarLink
					href="#"
					isSelected={path === '/settings'}
					isSidebarOpen={isOpen}
					icon={<Settings className="h-4 w-4 shrink-0" />}
					label="Settings"
				/>
				<NavbarLink
					href="#"
					isSelected={path === '/notifications'}
					isSidebarOpen={isOpen}
					icon={<Bell className="h-4 w-4 shrink-0" />}
					label="Notifications"
				/>
			</div>

			{/* User menu */}
			<UserMenu isSidebarOpen={isOpen} />
		</motion.aside>
	);
}
