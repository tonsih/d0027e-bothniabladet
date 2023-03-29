import {
	createSlice,
	createAsyncThunk,
	createSelector,
} from '@reduxjs/toolkit';
import authService from './authService';
import { ME_QUERY } from '../../queries/userQueries';
import { useSelector } from 'react-redux';

const initialState = {
	user: null,
	isError: false,
	isSuccess: false,
	isLoading: false,
	message: { error: '', success: '' },
};

export const register = createAsyncThunk(
	'auth/register',
	async (user, thunkAPI) => {
		try {
			return await authService.register(user);
		} catch (err) {
			const errors = (err &&
				err.graphQLErrors &&
				err.graphQLErrors.map(error => error.message)) || [err.toString()];

			return thunkAPI.rejectWithValue(errors);
		}
	}
);

export const login = createAsyncThunk('auth/login', async (user, thunkAPI) => {
	try {
		return await authService.login(user);
	} catch (err) {
		const errors = (err &&
			err.graphQLErrors &&
			err.graphQLErrors.map(error => error.message)) || [err.toString()];

		return thunkAPI.rejectWithValue(errors);
	}
});

export const logout = createAsyncThunk('auth/logout', async thunkAPI => {
	try {
		return await authService.logout();
	} catch (error) {
		const errors = (err &&
			err.graphQLErrors &&
			err.graphQLErrors.map(error => error.message)) || [err.toString()];

		return thunkAPI.rejectWithValue(errors);
	}
});

export const getMe = createAsyncThunk('auth/me', async thunkAPI => {
	try {
		return await authService.getMe();
	} catch (error) {
		const errors = (err &&
			err.graphQLErrors &&
			err.graphQLErrors.map(error => error.message)) || [err.toString()];

		return thunkAPI.rejectWithValue(errors);
	}
});

// export const userSelector = createSelector(
// 	state => state.auth.user,
// 	user => user
// );

// export const userAdminSelector = createSelector(
// 	state => state.auth.user.admin,
// 	blocked => blocked
// );

// export const userBlockedSelector = createSelector(
// 	state => state.auth.user.blocked,
// 	blocked => blocked
// );

// export const isErrorSelector = createSelector(
// 	state => state.auth.isError,
// 	isError => isError
// );

// export const isSuccessSelector = createSelector(
// 	state => state.auth.isSuccess,
// 	isSuccess => isSuccess
// );

// export const isLoadingSelector = createSelector(
// 	state => state.auth.isLoading,
// 	isLoading => isLoading
// );

// export const errorMessageSelector = createSelector(
// 	state => state.auth.message.error,
// 	errorMessage => errorMessage
// );

// export const successMessageSelector = createSelector(
// 	state => state.auth.message.success,
// 	successMessage => successMessage
// );

export const authSlice = createSlice({
	name: 'auth',
	initialState,
	reducers: {
		reset: state => {
			(state.isError = false),
				(state.isSuccess = false),
				(state.isLoading = false),
				(state.message.error = ''),
				(state.message.success = '');
		},
	},
	extraReducers: builder => {
		builder
			.addCase(register.pending, state => {
				state.isLoading = true;
			})
			.addCase(register.fulfilled, (state, action) => {
				state.isLoading = false;
				state.isSuccess = true;
				state.user = action.payload;
				state.message.success =
					'User account creation successful. Please login.';
			})
			.addCase(register.rejected, (state, action) => {
				state.isLoading = false;
				state.isError = true;
				state.message.error = action.payload;
			})
			.addCase(login.pending, state => {
				state.isLoading = true;
			})
			.addCase(login.fulfilled, (state, action) => {
				state.isLoading = false;
				state.isSuccess = true;
				state.user = action.payload;
				state.message.success = '';
			})
			.addCase(login.rejected, (state, action) => {
				state.isLoading = false;
				state.isError = true;
				state.message.error = action.payload;
			})
			.addCase(logout.pending, state => {
				state.isLoading = true;
			})
			.addCase(logout.fulfilled, state => {
				state.isLoading = false;
				state.isSuccess = true;
				state.user = null;
				state.message.success = '';
			})
			.addCase(logout.rejected, (state, action) => {
				state.isLoading = false;
				state.isError = true;
				state.message.error = action.payload;
			})
			.addCase(getMe.pending, state => {
				state.isLoading = true;
			})
			.addCase(getMe.fulfilled, (state, action) => {
				state.isLoading = false;
				state.isSuccess = true;
				state.user = action.payload;
				state.message.success = '';
			})
			.addCase(getMe.rejected, (state, action) => {
				state.isLoading = false;
				state.isError = true;
				state.message.error = action.payload;
			});
	},
});

export const { reset } = authSlice.actions;
export default authSlice.reducer;
