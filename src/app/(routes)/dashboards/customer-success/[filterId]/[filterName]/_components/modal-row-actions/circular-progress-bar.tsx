"use client";

import { type ChartConfig, ChartContainer } from "@/components/ui/chart";
import {
	Label,
	PolarGrid,
	PolarRadiusAxis,
	RadialBar,
	RadialBarChart,
} from "recharts";

interface CircularProgressBarProps {
	logoUrl?: string; // URL da imagem do logo (opcional)
	evolucao: number; // Valor para o gráfico
	cliente?: string; // Nome do cliente (opcional)
}

export function CircularProgressBar({
	logoUrl,
	evolucao,
}: CircularProgressBarProps) {
	// Dados do gráfico, usando o valor passado por prop para 'evolucao'
	const chartData = [{ evolucao, fill: "#38b367" }];

	// Configuração do gráfico
	const chartConfig = {
		evolucao: {
			label: "Evolução",
		},
	} satisfies ChartConfig;

	// Valor máximo para escalar o gráfico
	const MAX_VISITORS = 100;

	// Calcular o ângulo final dinamicamente com base no valor de 'evolucao'
	const endAngle = 90 - (evolucao / MAX_VISITORS) * 360;

	return (
		<ChartContainer
			config={chartConfig}
			className="aspect-square max-h-[100px]"
		>
			<RadialBarChart
				data={chartData}
				startAngle={90} // Inicia no topo
				endAngle={endAngle} // Cresce para a esquerda
				innerRadius={35}
				outerRadius={50}
			>
				<PolarGrid
					gridType="circle"
					radialLines={false}
					stroke="none"
					className="first:fill-muted last:fill-background"
					polarRadius={[39, 32]}
				/>
				<RadialBar dataKey="evolucao" background cornerRadius={100} />
				<PolarRadiusAxis tick={false} tickLine={false} axisLine={false}>
					<Label
						content={({ viewBox }) => {
							if (viewBox && "cx" in viewBox && "cy" in viewBox) {
								return (
									<g>
										{logoUrl && (
											<image
												href={logoUrl}
												x={viewBox.cx ? viewBox.cx - 17 : 0} // Centralizar horizontalmente
												y={viewBox.cy ? viewBox.cy - 17 : 0} // Centralizar verticalmente
												width="34" // Largura da imagem
												height="34" // Altura da imagem
												preserveAspectRatio="xMidYMid slice"
											/>
										)}
									</g>
								);
							}
							return null;
						}}
					/>
				</PolarRadiusAxis>
			</RadialBarChart>
		</ChartContainer>
	);
}
