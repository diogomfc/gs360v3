'use client';
import { queryClient } from '@/lib/react-query';
import type { ReactNode } from 'react';

import { TooltipProvider } from '@/components/ui/tooltip';
import { QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider } from 'next-themes';

export function Providers({ children }: { children: ReactNode }) {
	return (
		<QueryClientProvider client={queryClient}>
			<ThemeProvider
				attribute="class"
				defaultTheme="light"
				disableTransitionOnChange
			>
				<TooltipProvider delayDuration={200}>{children}</TooltipProvider>
			</ThemeProvider>
		</QueryClientProvider>
	);
}
