import * as React from 'react';
import type { SVGProps } from 'react';

export const IconDocumentacao = ({
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
			<path d="M5 9V3.5a1.5 1.5 0 0 1 3 0V10a3 3 0 0 1-6 0V5M11 8h5M11 12h5M9 16h7" />
			<path d="M5 13v6a2 2 0 0 0 2 2h11a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2H8" />
		</g>
		<defs>
			<clipPath id="a">
				<path fill="#fff" d="M0 0h24v24H0z" />
			</clipPath>
		</defs>
	</svg>
);
