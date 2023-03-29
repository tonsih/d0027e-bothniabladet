import './App.scss';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ApolloProvider, ApolloClient, InMemoryCache } from '@apollo/client';
import Header from './components/Header';
import Login from './pages/Login';
import Register from './pages/Register';
import Home from './pages/Home';
import Footer from './components/Footer';
import { useState } from 'react';
import ProductPage from './pages/ProductPage';
import { useMemo } from 'react';
import NotFound from './pages/NotFound';
import AdminUsers from './pages/AdminUsers';
import AdminProducts from './pages/AdminProducts';

import { Provider } from 'react-redux';
import { store } from './app/store';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { getMe } from './features/auth/authSlice';

export const client = new ApolloClient({
	uri: 'http://localhost:5000/graphql',
	cache: new InMemoryCache(),
	credentials: 'include',
});

const App = () => {
	const [user, setUser] = useState({
		loggedIn: false,
		admin: false,
		blocked: false,
	});

	return (
		<>
			<ApolloProvider client={client}>
				<Router>
					<Provider store={store}>
						<Header />
						<main className='container mt-5'>
							<Routes>
								<Route path='*' element={<NotFound />} />
								<Route path='/' element={<Home />} />
								<Route path='/login' element={<Login />} />
								<Route path='/register' element={<Register />} />
								<Route path='/admin/users' element={<AdminUsers />} />
								<Route path='/admin/products' element={<AdminProducts />} />
								<Route
									path='/product/:product'
									element={<ProductPage />}
								></Route>
							</Routes>
						</main>
						<Footer />
					</Provider>
				</Router>
				<ToastContainer />
			</ApolloProvider>
		</>
	);
};

export default App;
