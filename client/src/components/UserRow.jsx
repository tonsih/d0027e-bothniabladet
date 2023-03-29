import {
	FaArrowUp,
	FaBan,
	FaCheckCircle,
	FaLevelUpAlt,
	FaLongArrowAltUp,
	FaMedal,
	FaRegThumbsDown,
	FaThumbsDown,
	FaThumbsUp,
	FaTrash,
	FaTrophy,
} from 'react-icons/fa';
import { DELETE_USER, UPDATE_USER } from '../mutations/userMutations';
import { useMutation, useQuery } from '@apollo/client';
import { ME_QUERY, USERS_QUERY } from '../queries/userQueries';
import { Button } from '@mui/material';

const UserRow = ({ user: curUser }) => {
	const { user_id, first_name, last_name, email, admin, blocked } = curUser;

	const [updateUser] = useMutation(UPDATE_USER, {
		refetchQueries: [{ query: USERS_QUERY }],
	});

	const [deleteUser] = useMutation(DELETE_USER, {
		refetchQueries: [{ query: USERS_QUERY }],
	});

	const {
		loading: meLoading,
		data: meData,
		error: meError,
	} = useQuery(ME_QUERY);

	return (
		<tr>
			<th scope='row'>{user_id}</th>
			<td>{first_name}</td>
			<td>{last_name}</td>
			<td>{email}</td>
			<td>{admin && <FaCheckCircle />}</td>
			<td>{blocked && <FaBan />}</td>
			<td>
				{!admin && (
					<>
						<Button
							className='btn'
							variant='outlined'
							disabled={user_id === meData.me.user_id}
							onClick={async () => {
								try {
									await updateUser({
										variables: {
											user_id: parseInt(user_id),
											admin: true,
										},
									});
								} catch (error) {
									console.log(error);
								}
							}}
						>
							<FaMedal />
						</Button>
					</>
				)}
			</td>
			<td>
				{admin && (
					<>
						<Button
							className='btn'
							variant='outlined'
							color='secondary'
							disabled={user_id === meData.me.user_id}
							onClick={async () => {
								try {
									await updateUser({
										variables: {
											user_id: parseInt(user_id),
											admin: false,
										},
									});
								} catch (error) {
									console.log(error);
								}
							}}
						>
							<FaRegThumbsDown />
						</Button>
					</>
				)}
			</td>
			<td>
				{!blocked && (
					<Button
						color='secondary'
						onClick={async () => {
							try {
								await updateUser({
									variables: {
										user_id: user_id,
										blocked: true,
									},
								});
							} catch (error) {
								console.log(error);
							}
						}}
						className='btn'
						variant='contained'
						disabled={user_id === meData.me.user_id}
					>
						<FaBan />
						{console.log(user_id === meData.me.user_id)}
					</Button>
				)}
			</td>
			<td>
				{blocked && (
					<>
						<Button
							className='btn'
							variant='contained'
							onClick={async () => {
								try {
									await updateUser({
										variables: {
											user_id: user_id,
											blocked: false,
										},
									});
								} catch (error) {
									console.log(error);
								}
							}}
						>
							<FaThumbsUp />
						</Button>
					</>
				)}
			</td>
			<td>
				<>
					<Button
						className='btn'
						variant='contained'
						color='secondary'
						onClick={async () => {
							try {
								await deleteUser({
									variables: {
										user_id: user_id,
									},
								});
							} catch (error) {
								console.log(error);
							}
						}}
					>
						<FaTrash />
					</Button>
				</>
			</td>
		</tr>
	);
};
export default UserRow;
