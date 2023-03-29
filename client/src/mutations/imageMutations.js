import { gql } from '@apollo/client';

const ADD_PRODUCT = gql`
	mutation addProduct(
		$category_id: ID!
		$title: String!
		$price: Float!
		$amount: Int!
		$img_url: String!
		$description: String!
	) {
		addProduct(
			category_id: $category_id
			title: $title
			price: $price
			amount: $amount
			img_url: $img_url
			description: $description
		) {
			category_id
			title
			price
			amount
			img_url
			description
		}
	}
`;

const UPDATE_PRODUCT = gql`
	mutation updateProduct($email: String!, $password: String!) {
		updateProduct(email: $email, password: $password) {
			user_id
			email
			admin
			blocked
		}
	}
`;

const DELETE_PRODUCT = gql`
	mutation deleteProduct {
		deleteProduct {
			user_id
			email
		}
	}
`;

export { ADD_PRODUCT, UPDATE_PRODUCT, DELETE_PRODUCT };
