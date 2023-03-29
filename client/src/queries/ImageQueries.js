import { gql } from '@apollo/client';

const GET_PRODUCTS = gql`
	query products {
		products {
			product_id
			img_url
			title
			price
			amount
			description
		}
	}
`;

const GET_PRODUCT = gql`
	query product($product_id: ID!) {
		product(product_id: $product_id) {
			product_id
			img_url
			title
			price
			amount
			description
		}
	}
`;

export { GET_PRODUCTS, GET_PRODUCT };
