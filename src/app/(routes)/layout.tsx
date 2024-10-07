import { Toaster } from '@/components/ui/toaster';
import { Providers } from '../providers';
import MainWrapper from './_components/main-wrapper';
import SidebarDash from './_components/sidebar';

export default function LayoutDashboard({
	children,
}: { children: React.ReactElement }) {
	return (
		<div className="w-full h-full antialiased flex min-h-screen bg-[#D9E4F4]">
			<Providers>
				<Toaster />
				<SidebarDash />
				<MainWrapper>{children}</MainWrapper>
			</Providers>
		</div>
	);
}
