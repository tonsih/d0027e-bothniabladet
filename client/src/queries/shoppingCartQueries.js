import { gql } from '@apollo/client';

const USER_SHOPPING_CART = gql`
	query shopping_cart_by_user_id($user_id: ID!) {
		shopping_cart_by_user_id(user_id: $user_id) {
			shopping_cart_id
			total_price
		}
	}
`;

const USER_SHOPPING_CART_IMAGES = gql`
	query shopping_cart_images_by_sc_id($shopping_cart_id: ID!) {
		shopping_cart_images_by_sc_id(shopping_cart_id: $shopping_cart_id) {
			shopping_cart_image_id
			shopping_cart {
				shopping_cart_id
			}
			image {
				image_id
				title
				price
				uses
				image_url
				description
			}
		}
	}
`;

const USER_SHOPPING_CART_IMAGE = gql`
	query shopping_cart_image_by_image_id(
		$image_id: ID!
		$shopping_cart_id: ID!
	) {
		shopping_cart_image_by_image_id(
			image_id: $image_id
			shopping_cart_id: $shopping_cart_id
		) {
			shopping_cart_image_id
			shopping_cart {
				shopping_cart_id
			}
			image {
				image_id
				title
				price
				uses
				image_url
				description
			}
		}
	}
`;

const SHOPPING_CART_IMAGES = gql`
	query shopping_cart_images {
		shopping_cart_images {
			shopping_cart_image_id
			image {
				image_id
				title
				price
				uses
				image_url
				description
			}
		}
	}
`;

export {
	USER_SHOPPING_CART,
	USER_SHOPPING_CART_IMAGES,
	USER_SHOPPING_CART_IMAGE,
	SHOPPING_CART_IMAGES,
};
