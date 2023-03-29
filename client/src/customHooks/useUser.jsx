import { useQuery } from '@apollo/client';
import { useEffect, useState } from 'react';
import { ME_QUERY } from '../queries/userQueries';

export const useUser = ({ setUser, user, logoutUser }) => {
	const [state, setState] = useState({ data: null, loading: true });
	const { loading, error, data } = useQuery(ME_QUERY);

	useEffect(() => {
		const getLogin = async () => {
			setState(state => ({ data: state.data, loading: true }));
			if (data) {
				if (data.me) {
					setState(state => ({ ...state, data: data.me }));
					if (data.me.admin) setUser(state => ({ ...state, admin: true }));
					if (data.me.blocked) {
						try {
							await logoutUser();
							setUser(state => ({ ...state, loggedIn: false, blocked: false }));
						} catch (error) {
							console.log(error);
						}
					} else {
						setUser(state => ({ ...state, loggedIn: true }));
					}
				}
			} else {
				setUser(state => ({ ...state, loggedIn: false }));
				setState(state => ({ ...state, data: null }));
			}
		};

		getLogin();
		setState(state => ({ ...state, loading: false }));
	}, [data, setUser, logoutUser]);
	return state;
};
