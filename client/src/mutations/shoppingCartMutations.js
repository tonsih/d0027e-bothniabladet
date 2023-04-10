import { gql } from '@apollo/client';

const ADD_SHOPPING_CART_IMAGE = gql`
	mutation addShoppingCartImage(
		$shopping_cart_id: ID!
		$image_id: ID!
		$time_added: DateTime!
	) {
		addShoppingCartImage(
			shopping_cart_id: $shopping_cart_id
			image_id: $image_id
			time_added: $time_added
		) {
			shopping_cart_image_id
		}
	}
`;

const DELETE_SHOPPING_CART_IMAGE = gql`
	mutation deleteShoppingCartImage($shopping_cart_image_id: ID!) {
		deleteShoppingCartImage(shopping_cart_image_id: $shopping_cart_image_id) {
			shopping_cart_image_id
		}
	}
`;

export { ADD_SHOPPING_CART_IMAGE, DELETE_SHOPPING_CART_IMAGE };
