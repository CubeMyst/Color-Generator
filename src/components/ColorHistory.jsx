import React from 'react';

export default function ListColor({ colors, handleClick }) {
	return (
		<div className='history'>
			<ul>
				{colors.map((color, index) => (
					<li
						key={index}
						className='items'
						onClick={() => handleClick(color)}>
						{color}
					</li>
				))}
			</ul>
		</div>
	);
}
