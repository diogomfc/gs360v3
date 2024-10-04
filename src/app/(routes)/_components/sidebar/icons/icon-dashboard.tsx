import * as React from 'react';
import type { SVGProps } from 'react';

export const IconDashboard = ({
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
			<path d="m16 21-1-4M8 21l1-4M18.925 17H5.075A2.075 2.075 0 0 1 3 14.925v-9.85A2.075 2.075 0 0 1 5.075 3h13.849A2.075 2.075 0 0 1 21 5.075v9.849A2.074 2.074 0 0 1 18.925 17" />
			<path d="M7.5 10.25h3V14h-3zM10.5 6h3v8h-3zM13.5 8.25h3V14h-3z" />
		</g>
		<defs>
			<clipPath id="a">
				<path fill="#fff" d="M0 0h24v24H0z" />
			</clipPath>
		</defs>
	</svg>
);
