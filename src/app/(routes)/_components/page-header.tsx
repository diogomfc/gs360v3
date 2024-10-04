import { LayoutGrid } from 'lucide-react';
import Image from 'next/image';

interface PageHeaderProps {
	title?: string;
	icon?: React.ReactNode;
	onInviteClick?: () => void;
	inviteLabel?: string;
	avatars?: string[];
}

export default function PageHeader({
	title = 'Dashboards',
	icon = <LayoutGrid className="w-3 h-3" />,
}: PageHeaderProps) {
	return (
		<header className="flex relative items-center justify-between w-full bg-gradient-to-r from-blue-900 to-blue-500 h-[59px] px-6 shadow-lg">
			<div className="absolute inset-0 bg-hero-pattern2 bg-contain bg-no-repeat opacity-90" />
			{/* Esquerda - Logo e Título */}
			<div className="flex items-center space-x-4">
				<div className="flex items-center space-x-2 text-white">
					{icon}
					<span className="text-lg">{title}</span>
				</div>
			</div>

			{/* Direita - Convite e Avatares */}
			<div className="flex items-center space-x-4">
				{/* Logo-Eccox */}
				<Image
					src="/logo-eccox.svg"
					alt="Eccox"
					width={100}
					height={30}
					className=""
				/>
			</div>
		</header>
	);
}
