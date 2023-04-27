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
			deleted
		}
	}
`;

const GET_LATEST_VERSION_IMAGES = gql`
	query latest_version_images {
		latest_version_images {
			version_id
			version_no
			original {
				image_id
			}
			image {
				image_id
				title
				price
				uses
				image_url
				description
				journalist
				distributable
				deleted
			}
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
				deleted
			}
		}
	}
`;

const GET_IMAGE_TAGS_BY_IMAGE_ID = gql`
	query image_tags_by_image_id($image_id: ID!) {
		image_tags_by_image_id(image_id: $image_id) {
			tag {
				tag_id
				name
			}
		}
	}
`;

const GET_IMAGES_BY_TAG_NAME = gql`
	query images_by_tag_name($tag_name: String!) {
		images_by_tag_name(tag_name: $tag_name) {
			image {
				image_id
				title
				price
				uses
				image_url
				description
				journalist
				distributable
				deleted
			}
		}
	}
`;

const GET_ALL_IMAGE_VERSIONS = gql`
	query all_versions_image($image_id: ID!) {
		all_versions_image(image_id: $image_id) {
			version_no
			image {
				image_id
				title
				price
				uses
				image_url
				description
				journalist
				distributable
				deleted
			}
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
			deleted
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
	GET_LATEST_VERSION_IMAGES,
	GET_IMAGES_BY_TAG_NAME,
	GET_IMAGE_TAGS,
	GET_IMAGE_TAGS_BY_IMAGE_ID,
	GET_IMAGE,
	GET_TECHNICAL_METADATA,
	GET_ALL_IMAGE_VERSIONS,
};
