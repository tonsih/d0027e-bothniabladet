import {
	LOGIN_USER,
	LOGOUT_USER,
	REGISTER_USER,
} from '../../mutations/userMutations';
import { client } from '../../App';
import { ME_QUERY, USERS_QUERY } from '../../queries/userQueries';
import { USER_SHOPPING_CART } from '../../queries/shoppingCartQueries';

const register = async ({ first_name, last_name, email, password }) => {
	const { data } = await client.mutate({
		mutation: REGISTER_USER,
		variables: { first_name, last_name, email, password },
		refetchQueries: [{ query: ME_QUERY }, { query: USERS_QUERY }],
	});

	return await data.registerUser;
};

const login = async ({ email, password }) => {
	const { data } = await client.mutate({
		mutation: LOGIN_USER,
		variables: { email, password },
		refetchQueries: [{ query: ME_QUERY }],
	});

	const { loginUser } = await data;

	const { data: scData } = await client.query({
		query: USER_SHOPPING_CART,
		variables: { user_id: loginUser.user_id },
	});

	return {
		me: { ...loginUser },
		shopping_cart: {
			shopping_cart_id: scData.shopping_cart_by_user_id.shopping_cart_id,
		},
	};
};

const logout = async () => {
	const { data } = await client.mutate({
		mutation: LOGOUT_USER,
		refetchQueries: [{ query: ME_QUERY }],
	});
};

const getMe = async () => {
	const { data } = await client.query({
		query: ME_QUERY,
	});

	const { data: scData } = await client.query({
		query: USER_SHOPPING_CART,
		variables: { user_id: data.me.user_id },
	});

	return {
		me: { ...data.me },
		shopping_cart: {
			shopping_cart_id: scData.shopping_cart_by_user_id.shopping_cart_id,
		},
	};
};

const authService = {
	register,
	login,
	logout,
	getMe,
};

export default authService;
