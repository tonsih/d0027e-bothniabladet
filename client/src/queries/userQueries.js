import { gql } from '@apollo/client';

const ME_QUERY = gql`
	query me {
		me {
			user_id
			first_name
			last_name
			email
			admin
			banned
		}

		shopping_cart {
			shopping_cart_id
			total_price
		}
	}
`;

const USER_QUERY = gql`
	query user($user_id: ID!) {
		user(user_id: $user_id) {
			user_id
			first_name
			last_name
			email
			admin
			banned
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
			banned
		}
	}
`;

export { ME_QUERY, USER_QUERY, USERS_QUERY };
