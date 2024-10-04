//IconIniciativas

import * as React from 'react';
import type { SVGProps } from 'react';

export const IconIniciativas = ({
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
			<path d="M11 21H5.778A1.9 1.9 0 0 1 4 19V5a1.9 1.9 0 0 1 1.778-2h12.444A1.9 1.9 0 0 1 20 5v6M8 13.5h3M8 17h3M18.691 16.756 17.2 18.243l-.894-.892" />
			<path d="M19 14h-3a2 2 0 0 0-2 2v3a2 2 0 0 0 2 2h3a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2M16 7l-3 3-2.714-2L8 10" />
			<path d="M16 9V7h-2" />
		</g>
		<defs>
			<clipPath id="a">
				<path fill="#fff" d="M0 0h24v24H0z" />
			</clipPath>
		</defs>
	</svg>
);
