import MainWrapper from './_components/main-wrapper';
import SidebarDash from './_components/sidebar';

export default function LayoutDashboard({
	children,
}: { children: React.ReactElement }) {
	return (
		<div className="flex w-full h-full">
			<SidebarDash />
			<MainWrapper>{children}</MainWrapper>
		</div>
	);
}
