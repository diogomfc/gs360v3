import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from '@/components/ui/popover';
import { ChevronsUpDown } from 'lucide-react';

export default function UserMenu({
	isSidebarOpen,
}: { isSidebarOpen: boolean }) {
	const avatar = (
		<Avatar className="w-6 h-6">
			<AvatarImage
				src="/assets/customer-success/logo_eccox.png"
				alt="@diogo.silva"
			/>
			<AvatarFallback>EC</AvatarFallback>
		</Avatar>
	);

	const userDetails = (
		<div className="flex flex-col">
			<span className="font-semibold text-xs">Eccox Technology</span>
			<span className="text-xs text-muted-foreground">eccox@eccox.com.br</span>
		</div>
	);

	return (
		<div
			className={`bg-muted/60 flex ${
				isSidebarOpen
					? 'items-center py-4 px-6 gap-2'
					: 'flex-col items-center py-4 justify-center animate-sidebar-closed'
			}`}
		>
			{avatar}
			{isSidebarOpen && userDetails}
			{/* <UserSettingsMenu /> */}
		</div>
	);
}

function UserSettingsMenu() {
	return (
		<Popover>
			<PopoverTrigger asChild>
				<Button variant="ghost" size="icon" className="">
					<ChevronsUpDown className="h-4 w-4" />
				</Button>
			</PopoverTrigger>
			<PopoverContent
				align="end"
				className="p-4 bg-white border border-gray-200 shadow-md rounded-md"
			>
				<div className="flex flex-col text-sm">
					<span className="font-semibold ">Minha Conta</span>
					<PopoverItem label="Settings" />
					<PopoverItem label="Support" />
					<PopoverItem label="Logout" />
				</div>
			</PopoverContent>
		</Popover>
	);
}

function PopoverItem({ label }: { label: string }) {
	return (
		<Button variant="link" className="text-left w-full text-sm">
			{label}
		</Button>
	);
}
