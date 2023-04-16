import { gql } from '@apollo/client';

const CREATE_ORDER = gql`
	mutation createOrder {
		createOrder {
			order_id
		}
	}
`;

export { CREATE_ORDER };
