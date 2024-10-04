import { StopwatchIcon } from '@radix-ui/react-icons';

import { CircleHelp, Flame, OctagonPause, Rocket } from 'lucide-react';

export const productLogos: { [key: string]: string } = {
	'Eccox APT': '/assets/logo-produtos/APT.png',
	'BMC AMI OPS - Monitors': '/assets/logo-produtos/QMG.png',
	IVP: '/assets/logo-produtos/QMG.png',
	'Eccox QC': '/assets/logo-produtos/QC.png',
	SHP: '/assets/logo-produtos/ABM.png',
	EBK: '/assets/logo-produtos/QMG.png',
};

export const logosCliente = [
	{
		cliente: 'Eccox ',
		logo: '/assets/customer-success/logo_eccox.png',
	},
	{
		cliente: 'Eccox',
		logo: '/assets/customer-success/logo_eccox.png',
	},
	{
		cliente: 'Bradesco Seguros',
		logo: '/assets/customer-success/logo-bradesco-seguro.svg',
	},
	{
		cliente: 'Banco Bradesco',
		logo: '/assets/customer-success/logo-bradesco.svg',
	},
	{
		cliente: 'Caixa Econômica Federal',
		logo: '/assets/customer-success/logo-caixa.svg',
	},
	{
		cliente: 'Cielo',
		logo: '/assets/customer-success/logo-cielo.svg',
	},
	{
		cliente: 'Banco Itaú',
		logo: '/assets/customer-success/logo-itau.svg',
	},
	{
		cliente: 'Banco Mercantil',
		logo: '/assets/customer-success/logo-mercantil.svg',
	},
	{
		cliente: 'ProdeMGe',
		logo: '/assets/customer-success/logo_prodemge.png',
	},
];

export const statuses = [
	{
		value: 'Backlog',
		label: 'Backlog',
		icon: CircleHelp,
		color: '#327dd2',
	},
	{
		value: 'Impedimento',
		label: 'Impedimento',
		icon: OctagonPause,
		color: '#a6b5c7',
	},
	{
		value: 'Em andamento',
		label: 'Em andamento',
		icon: StopwatchIcon,
		color: '#E8C468',
	},
	{
		value: 'Concluído',
		label: 'Concluído',
		icon: Rocket,
		color: '#2A9D90',
	},
	{
		value: 'Impedimento Onboarding',
		label: 'Impedimento Onboarding',
		icon: OctagonPause,
		color: '#a6b5c7',
	},
	{
		value: 'Impedimento Ongoing',
		label: 'Impedimento Ongoing',
		icon: OctagonPause,
		color: '#a6b5c7',
	},
	{
		value: 'Impedimento Suporte',
		label: 'Impedimento Suporte',
		icon: OctagonPause,
		color: '#a6b5c7',
	},
	{
		value: 'Tarefas Onboarding',
		label: 'Tarefas Onboarding',
		icon: CircleHelp,
		color: '#327dd2',
	},
	{
		value: 'Tarefas Ongoing',
		label: 'Tarefas Ongoing',
		icon: CircleHelp,
		color: '#327dd2',
	},
	{
		value: 'Tarefas Suporte',
		label: 'Tarefas Suporte',
		icon: CircleHelp,
		color: '#327dd2',
	},
];

export const priorities = [
	{
		label: 'Crítica',
		value: 'P1 - Critical',
		icon: Flame,
		color: '#8B0000',
	},
	{
		label: 'Alta',
		value: 'P2 - High',
		icon: Flame,
		color: '#FF0000',
	},
	{
		label: 'Média',
		value: 'P3 - Medium',
		icon: Flame,
		//color: '#FD9C08',
		color: '#FF6347',
	},
	{
		label: 'Baixa',
		value: 'P4 - Low',
		icon: Flame,
		color: '#ff7700',
	},
	// {
	// 	label: 'Very Low',
	// 	value: 'P5 - Very Low',
	// 	icon: Flame,
	// 	color: '#0748FE',
	// },
];
