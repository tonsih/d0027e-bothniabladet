import { gql } from '@apollo/client';

const GET_ORDER = gql`
	query order($order_id: ID!) {
		order(order_id: $order_id) {
			order_id
			order_date
			total_price
			user {
				user_id
			}
		}
	}
`;

const GET_ORDER_IMAGES = gql`
	query order_images_by_order_id($order_id: ID!) {
		order_images_by_order_id(order_id: $order_id) {
			order {
				order_id
			}
			image {
				image_id
				title
				price
				image_url
				description
			}
		}
	}
`;

const GET_USER_ORDERS = gql`
	query user_orders {
		user_orders {
			order_id
			order_date
			total_price
		}
	}
`;

export { GET_ORDER, GET_ORDER_IMAGES, GET_USER_ORDERS };
