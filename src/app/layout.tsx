import './globals.css';

import { Toaster } from '@/components/ui/toaster';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { Providers } from './providers';

export const metadata: Metadata = {
	title: 'Gestão360',
	description: 'Gestão360',
};

const inter = Inter({ subsets: ['latin'] });

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="pt-BR" className={inter.className}>
			<body className="">{children}</body>
		</html>
	);
}
