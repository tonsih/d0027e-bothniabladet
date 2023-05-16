import _ from 'lodash';
import { useEffect, useState } from 'react';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import '../scss/ComponentSlider.scss';
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
			<>
				<span id='paginationIndicator'>
					{curCompIndex + 1}/{components.length}
				</span>
				<div className='slider-container w-100 d-flex mb-5'>
					<ActionButton
						onClick={handlePrevious}
						className='slider-button'
						id='sliderButtonPrevious'
						variant='outlined'
						color='primary'
					>
						<FaChevronLeft />
					</ActionButton>
					<div className='component-container'>{components[curCompIndex]}</div>
					<ActionButton
						onClick={handleNext}
						className='slider-button'
						id='sliderButtonNext'
						variant='outlined'
						color='primary'
					>
						<FaChevronRight />
					</ActionButton>
				</div>
			</>
		);
};
export default ComponentSlider;
