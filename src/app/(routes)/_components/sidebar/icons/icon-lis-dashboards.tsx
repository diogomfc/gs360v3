//IconListDashboards
import * as React from 'react';
import type { SVGProps } from 'react';

export const IconListDashboards = ({
	stroke = '#172554',
	strokeWidth = 1.3,
	width = 24,
	height = 24,
	...props
}: SVGProps<SVGSVGElement> & {
	stroke?: string;
	strokeWidth?: number;
	width?: number;
	height?: number;
}) => (
	// biome-ignore lint/a11y/noSvgWithoutTitle: <explanation>
	<svg
		xmlns="http://www.w3.org/2000/svg"
		width={width}
		height={height}
		viewBox="0 0 24 24" // Define o viewBox para evitar deslocamento
		fill="none"
		{...props}
	>
		<g
			stroke={stroke}
			strokeWidth={strokeWidth}
			strokeLinecap="round"
			strokeLinejoin="round"
			clipPath="url(#a)"
		>
			<path d="M19.12 14.88a3.002 3.002 0 0 1-.417 4.592 3.01 3.01 0 0 1-3.406 0A3.003 3.003 0 0 1 17 14a3 3 0 0 1 2.12.88M19.121 19.121 21 21.001M8 10H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h3a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2M19 10h-3a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h3a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2M8 21H5a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2" />
		</g>
		<defs>
			<clipPath id="a">
				<path fill="#fff" d="M0 0h24v24H0z" />
			</clipPath>
		</defs>
	</svg>
);
