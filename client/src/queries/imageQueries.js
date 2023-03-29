import { gql } from '@apollo/client';

const GET_IMAGES = gql`
	query images {
		images {
			image_id
			image_url
			title
			price
			uses
			description
		}
	}
`;

const GET_IMAGE = gql`
	query image($image_id: ID!) {
		image(image_id: $image_id) {
			image_id
			image_url
			title
			price
			uses
			description
		}
	}
`;

export { GET_IMAGES, GET_IMAGE };
