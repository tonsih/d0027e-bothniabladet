import { useQuery } from '@apollo/client';
import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import UserRow from '../components/UserRow';
import { USERS_QUERY } from '../queries/userQueries';

const AdminUsers = () => {
	const navigate = useNavigate();

	const { user } = useSelector(state => state.auth);

	useEffect(() => {
		if (!user || !user.me || user.me.banned || !user.me.admin) {
			navigate('/');
		}
	}, [user, navigate]);

	const { data, loading, error } = useQuery(USERS_QUERY);

	return (
		<>
			<table className='table table-dark table-hover'>
				<thead>
					<tr>
						<th scope='col'>ID</th>
						<th scope='col'>First name</th>
						<th scope='col'>Last name</th>
						<th scope='col'>E-mail</th>
						<th scope='col'>Admin</th>
						<th scope='col'>Banned</th>
						<th scope='col'>Promote</th>
						<th scope='col'>Demote</th>
						<th scope='col'>Ban</th>
						<th scope='col'>Unban</th>
						<th scope='col'>Delete User</th>
					</tr>
				</thead>
				<tbody>
					{!loading &&
						!error &&
						data.users.map(user => <UserRow key={user.user_id} user={user} />)}
				</tbody>
			</table>
		</>
	);
};

export default AdminUsers;
