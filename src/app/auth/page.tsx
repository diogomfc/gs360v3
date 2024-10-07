'use client';

import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { AlertTriangle, Loader2 } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function Login() {
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [error, setError] = useState('');
	const [isPending, setIsPending] = useState(false);
	const router = useRouter();

	const handleLogin = (e: React.FormEvent) => {
		e.preventDefault();
		setIsPending(true);

		// Usuário e senha fixos
		const fixedEmail = 'eccox@eccox.com.br';
		const fixedPassword = '123456';

		// Verificar se o e-mail e a senha correspondem aos valores fixos
		if (email === fixedEmail && password === fixedPassword) {
			setTimeout(() => {
				router.push('/dashboards'); // Redirecionar para a página protegida
			}, 1000);
		} else {
			setError('E-mail ou senha incorretos');
			setIsPending(false);
		}
	};

	return (
		<div className="flex min-h-screen items-center justify-center bg-gradient-to-r from-[#D9E4F4] to-[#ECF2FB]">
			<div className="flex h-[756px] w-[1308px] rounded-[24px] border-8 border-transparent bg-white/50 shadow-lg">
				<div className="flex w-1/2 flex-col items-center justify-center gap-5 rounded-l-[16px] bg-[#e6efff] p-8">
					<Image
						src="/logo-gestao360.svg"
						alt="logo"
						width="250"
						height="250"
					/>
					<div className="inline-flex h-[72px] flex-col items-center justify-center gap-1">
						<p className="text-center text-xl font-semibold leading-7 text-zinc-800">
							Bem-vindo ao Gestão360!
						</p>
						<p className="text-center text-sm font-normal leading-tight text-zinc-800">
							Do planejamento à entrega, tudo em um só Lugar.
						</p>
					</div>
				</div>

				<div className="flex w-1/2 flex-col justify-center p-36">
					<div className="space-y-4">
						<div className="flex flex-col items-center">
							<h2 className="text-2xl font-bold">Entrar</h2>
							<p className="mt-2 text-center text-sm text-muted-foreground">
								Faça login para acessar suas funcionalidades
							</p>
						</div>

						<form onSubmit={handleLogin} className="space-y-4">
							{error && (
								<Alert variant="destructive">
									<AlertTriangle className="size-4" />
									<AlertTitle>Erro ao fazer login!</AlertTitle>
									<AlertDescription>
										<p>{error}</p>
									</AlertDescription>
								</Alert>
							)}

							<div className="space-y-1">
								<Label htmlFor="email">E-mail</Label>
								<Input
									name="email"
									type="email"
									id="email"
									value={email}
									onChange={(e) => setEmail(e.target.value)}
									required
								/>
							</div>

							<div className="space-y-1">
								<Label htmlFor="password">Senha</Label>
								<Input
									name="password"
									type="password"
									id="password"
									value={password}
									onChange={(e) => setPassword(e.target.value)}
									required
								/>
							</div>

							<Button
								className="w-full bg-[#0862B1] py-2 text-white"
								type="submit"
								disabled={isPending}
							>
								{isPending ? (
									<Loader2 className="size-4 animate-spin" />
								) : (
									'Entrar'
								)}
							</Button>

							<div className="flex items-center justify-center">
								<p className="text-sm">Não tem uma conta?</p>
								<Button
									className="text-sm text-blue-900"
									variant="link"
									size="sm"
									asChild
								>
									<Link href="/auth/sign-up" className="pl-1">
										Criar uma conta
									</Link>
								</Button>
							</div>
						</form>

						<div className="text-center">
							<p className="text-xs text-muted-foreground">
								Ao usar o Gestão 360° você concorda com os Termos de Serviço e a
								Política de Privacidade
							</p>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
