import { gql } from '@apollo/client';

const ADD_IMAGE = gql`
	mutation addImage(
		$tag_id: ID!
		$title: String!
		$price: Float!
		$uses: Int!
		$image_url: String!
		$description: String!
	) {
		addImage(
			tag_id: $tag_id
			title: $title
			price: $price
			uses: $uses
			image_url: $image_url
			description: $description
		) {
			tag_id
			title
			price
			uses
			image_url
			description
		}
	}
`;

const UPDATE_IMAGE = gql`
	mutation updateImage(
			tag_id: $tag_id
			title: $title
			price: $price
			uses: $uses
			image_url: $image_url
			description: $description
	) {
		updateImage() {
			tag_id
			title
			price
			uses
			image_url
			description
		}
	}
`;

const DELETE_IMAGE = gql`
	mutation deleteImage(
			tag_id: $tag_id
			title: $title
			price: $price
			uses: $uses
			image_url: $image_url
			description: $description
	) {
		deleteImage {
			tag_id
			title
			price
			uses
			image_url
			description
		}
	}
`;

export { ADD_IMAGE, UPDATE_IMAGE, DELETE_IMAGE };
