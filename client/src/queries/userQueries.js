import { gql } from '@apollo/client';

const ME_QUERY = gql`
	query me {
		me {
			user_id
			email
			admin
			blocked
		}

		shopping_cart {
			total_price
		}
	}
`;

const USERS_QUERY = gql`
	query users {
		users {
			user_id
			first_name
			last_name
			email
			admin
			blocked
		}
	}
`;

export { ME_QUERY, USERS_QUERY };
