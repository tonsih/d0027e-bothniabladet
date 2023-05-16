import { useQuery } from '@apollo/client';
import * as React from 'react';
import { NavDropdown } from 'react-bootstrap';
import { FaList } from 'react-icons/fa';
import { LinkContainer } from 'react-router-bootstrap';
import { useLocation } from 'react-router-dom';
import { GET_IMAGE_TAGS } from '../queries/imageQueries';

export default function CategoriesButton() {
	const { data } = useQuery(GET_IMAGE_TAGS);
	const categoriesSet = new Set();

	const location = useLocation();

	const isActiveCategory = (categoryName = '') => {
		return location.pathname.startsWith(
			`/category/${categoryName.toLowerCase()}`
		);
	};

	if (data?.image_tags) {
		data.image_tags.forEach(element => {
			const { image, tag } = element;
			const { name: tagName } = tag || {};
			const { uses, distributable, deleted } = image || {};
			if (uses > 0 && distributable && !deleted) categoriesSet.add(tagName);
		});
	}

	return (
		categoriesSet.size > 0 && (
			<>
				<NavDropdown
					title={
						<span className='categies-menu-title'>
							<FaList /> Categories
						</span>
					}
					id={`offcanvasNavbarDropdown-expand-lg`}
					active={isActiveCategory()}
				>
					{categoriesSet &&
						categoriesSet.size > 0 &&
						[...categoriesSet].map(category => (
							<LinkContainer
								key={category}
								to={`/category/${category.toLowerCase()}`}
							>
								<NavDropdown.Item active={isActiveCategory(category)}>
									{category}
								</NavDropdown.Item>
							</LinkContainer>
						))}
				</NavDropdown>
			</>
		)
	);
}
