import { gql } from '@apollo/client';

const REGISTER_USER = gql`
	mutation registerUser(
		$first_name: String!
		$last_name: String!
		$email: String!
		$password: String!
	) {
		registerUser(
			first_name: $first_name
			last_name: $last_name
			email: $email
			password: $password
		) {
			user_id
			email
			admin
			banned
		}
	}
`;

const LOGIN_USER = gql`
	mutation loginUser($email: String!, $password: String!) {
		loginUser(email: $email, password: $password) {
			user_id
			email
			admin
			banned
		}
	}
`;

const LOGOUT_USER = gql`
	mutation logoutUser {
		logoutUser {
			user_id
			email
		}
	}
`;

const UPDATE_USER = gql`
	mutation updateUser(
		$user_id: ID!
		$first_name: String
		$last_name: String
		$email: String
		$password: String
		$banned: Boolean
		$admin: Boolean
	) {
		updateUser(
			user_id: $user_id
			first_name: $first_name
			last_name: $last_name
			email: $email
			password: $password
			banned: $banned
			admin: $admin
		) {
			user_id
		}
	}
`;

const DELETE_USER = gql`
	mutation deleteUser($user_id: ID!) {
		deleteUser(user_id: $user_id) {
			user_id
		}
	}
`;

export { REGISTER_USER, LOGIN_USER, LOGOUT_USER, UPDATE_USER, DELETE_USER };
