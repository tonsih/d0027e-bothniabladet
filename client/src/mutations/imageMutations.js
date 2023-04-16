import { gql } from '@apollo/client';

const uploadFileMutation = gql`
	mutation ($file: Upload!) {
		uploadFile(file: $file)
	}
`;

const ADD_IMAGE = gql`
	mutation addImage(
		$title: String!
		$price: Float!
		$uses: Int!
		$image_file: Upload
		$description: String
		$journalist: String
		$coordinates: String
		$camera_type: String
		$format: String
		$last_modified: DateTime
		$size: Int
		$distributable: Boolean
	) {
		addImage(
			title: $title
			price: $price
			uses: $uses
			image_file: $image_file
			description: $description
			journalist: $journalist
			coordinates: $coordinates
			camera_type: $camera_type
			format: $format
			last_modified: $last_modified
			size: $size
			distributable: $distributable
		) {
			technical_metadata {
				technical_metadata_id
			}
			title
			price
			uses
			image_url
			description
			distributable
			journalist
		}
	}
`;

const ADD_TECHNICAL_METADATA = gql`
	mutation addTechnicalMetadata(
		$coordinates: String
		$camera_type: String
		$format: String
		$last_modified: DateTime
		$size: Int
		$width: Int
		$height: Int
	) {
		addTechnicalMetadata(
			coordinates: $coordinates
			camera_type: $camera_type
			format: $format
			last_modified: $last_modified
			size: $size
			width: $width
			height: $height
		) {
			technical_metadata {
				technical_metadata_id
			}
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

const UPDATE_IMAGE = gql`
	mutation updateImage(
		$image_id: ID!
		$title: String
		$price: Float
		$uses: Int
		$image_url: String
		$description: String
		$journalist: String
		$distributable: Boolean
	) {
		updateImage(
			image_id: $image_id
			title: $title
			price: $price
			uses: $uses
			image_url: $image_url
			description: $description
			journalist: $journalist
			distributable: $distributable
		) {
			image_id
			title
			price
			uses
			image_url
			description
			journalist
			distributable
		}
	}
`;

const DELETE_IMAGE = gql`
	mutation deleteImage($image_id: ID!) {
		deleteImage(image_id: $image_id) {
			image_id
		}
	}
`;

export { ADD_IMAGE, ADD_TECHNICAL_METADATA, UPDATE_IMAGE, DELETE_IMAGE };
