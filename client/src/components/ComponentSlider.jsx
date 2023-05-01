import _ from 'lodash';
import { useEffect, useState } from 'react';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import ActionButton from './ActionButton';

const ComponentSlider = ({ components }) => {
	const [curCompIndex, setCurCompIndex] = useState(null);

	useEffect(() => {
		if (components.length > 0) {
			setCurCompIndex(0);
		}
	}, [components]);

	const handleNext = () => {
		setCurCompIndex(
			curCompIndex >= components.length - 1 ? 0 : curCompIndex + 1
		);
	};

	const handlePrevious = () => {
		setCurCompIndex(
			curCompIndex <= 0 ? components.length - 1 : curCompIndex - 1
		);
	};

	if (!_.isNumber(curCompIndex) || curCompIndex < 0) return <p>No items</p>;
	if (curCompIndex >= 0)
		return (
			<div className='slider-container w-100'>
				{curCompIndex + 1}/{components.length}
				<ActionButton onClick={handlePrevious}>
					<FaChevronLeft />
				</ActionButton>
				<ActionButton onClick={handleNext}>
					<FaChevronRight />
				</ActionButton>
				<div className='component-container'>{components[curCompIndex]}</div>
			</div>
		);
};
export default ComponentSlider;
