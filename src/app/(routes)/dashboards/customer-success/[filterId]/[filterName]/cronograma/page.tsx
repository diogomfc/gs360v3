import { IconCronograma } from '@/app/(routes)/_components/sidebar/icons/icon-cronograma';

export default function PageDashboardsIniciativas() {
	return (
		<div className="flex min-h-screen items-center justify-center bg-gradient-to-r from-[#D9E4F4] to-[#ECF2FB]">
			<div className="flex flex-col items-center gap-4 p-8 bg-white rounded-lg shadow-lg">
				{/* Ícone de Cronograma */}
				<IconCronograma className="h-24 w-24 text-gray-500" />

				{/* Mensagem */}
				<h1 className="text-2xl font-semibold text-gray-800">
					Cronograma Indisponível
				</h1>
				<p className="text-gray-600">
					Atualmente, não há um cronograma definido para esta iniciativa.
				</p>
			</div>
		</div>
	);
}
