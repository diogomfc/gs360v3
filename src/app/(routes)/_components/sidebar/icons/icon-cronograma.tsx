import * as React from 'react';
import type { SVGProps } from 'react';

export const IconCronograma = ({
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
			<path d="M21 8H3M22 17.5a4.5 4.5 0 1 1-9 0 4.5 4.5 0 0 1 9 0" />
			<path d="M14.673 21H6a3 3 0 0 1-3-3V6a3 3 0 0 1 3-3h12a3 3 0 0 1 3 3v8.673" />
			<path d="m18.5 17.25-1 1-1-1M6.799 11.5a.05.05 0 1 1-.05-.05" />
			<path d="M6.749 11.45a.05.05 0 0 1 .05.05M10.3 11.5a.05.05 0 1 1-.05-.05" />
			<path d="M10.25 11.45a.05.05 0 0 1 .035.015.05.05 0 0 1 .015.035M13.799 11.5a.05.05 0 1 1-.05-.05" />
			<path d="M13.749 11.45a.05.05 0 0 1 .05.05M6.799 14.5a.05.05 0 1 1-.05-.05" />
			<path d="M6.749 14.45a.05.05 0 0 1 .05.05M10.3 14.5a.05.05 0 1 1-.05-.05" />
			<path d="M10.25 14.45a.05.05 0 0 1 .035.015.05.05 0 0 1 .015.035M6.799 17.5a.05.05 0 1 1-.05-.05" />
			<path d="M6.749 17.45a.05.05 0 0 1 .05.05M10.3 17.5a.05.05 0 1 1-.05-.05" />
			<path d="M10.25 17.45a.05.05 0 0 1 .035.015.05.05 0 0 1 .015.035" />
		</g>
		<defs>
			<clipPath id="a">
				<path fill="#fff" d="M0 0h24v24H0z" />
			</clipPath>
		</defs>
	</svg>
);
