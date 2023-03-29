import {
	LOGIN_USER,
	LOGOUT_USER,
	REGISTER_USER,
} from '../../mutations/userMutations';
import { client } from '../../App';
import { ME_QUERY } from '../../queries/userQueries';

const register = async ({ first_name, last_name, email, password }) => {
	const { data } = await client.mutate({
		mutation: REGISTER_USER,
		variables: { first_name, last_name, email, password },
		refetchQueries: [{ query: ME_QUERY }],
	});

	return await data.registerUser;
};

const login = async ({ email, password }) => {
	const { data } = await client.mutate({
		mutation: LOGIN_USER,
		variables: { email, password },
		refetchQueries: [{ query: ME_QUERY }],
	});

	console.log(data.loginUser);
	return await data.loginUser;
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

	console.log(data);

	return await data;
};

const authService = {
	register,
	login,
	logout,
	getMe,
};

export default authService;
