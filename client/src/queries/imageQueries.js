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

const GET_IMAGE_TAGS = gql`
	query image_tags {
		image_tags {
			tag {
				tag_id
				name
			}
			image {
				image_id
			}
		}
	}
`;

const GET_IMAGES_BY_TAG_NAME = gql`
	query images_by_tag_name($tag_name: String!) {
		images_by_tag_name(tag_name: $tag_name) {
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

export { GET_IMAGES, GET_IMAGES_BY_TAG_NAME, GET_IMAGE_TAGS, GET_IMAGE };
