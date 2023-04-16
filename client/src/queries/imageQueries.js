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
			journalist
			distributable
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
				uses
				distributable
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
			distributable
			journalist
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
			journalist
			distributable
		}
	}
`;

const GET_TECHNICAL_METADATA = gql`
	query technical_metadata_by_image_id($image_id: ID!) {
		technical_metadata_by_image_id(image_id: $image_id) {
			technical_metadata_id
			coordinates
			camera_type
			format
			last_modified
			size
			width
			height
		}
	}
`;

export {
	GET_IMAGES,
	GET_IMAGES_BY_TAG_NAME,
	GET_IMAGE_TAGS,
	GET_IMAGE,
	GET_TECHNICAL_METADATA,
};
