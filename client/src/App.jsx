import './App.scss';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ApolloProvider, ApolloClient, InMemoryCache } from '@apollo/client';
import Header from './components/Header';
import Login from './pages/Login';
import Register from './pages/Register';
import Home from './pages/Home';
import Footer from './components/Footer';
import ImagePage from './pages/ImagePage';
import NotFound from './pages/NotFound';
import AdminUsers from './pages/AdminUsers';
import AdminImages from './pages/AdminImages';

import { Provider } from 'react-redux';
import { store } from './app/store';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { getMe } from './features/auth/authSlice';
import ShoppingCart from './pages/ShoppingCart';
import CategoryPage from './pages/CategoryPage';
import { createUploadLink } from 'apollo-upload-client';

export const client = new ApolloClient({
	// uri: 'http://localhost:5000/graphql',
	link: createUploadLink({ uri: 'http://localhost:5000/graphql' }),
	cache: new InMemoryCache(),
	credentials: 'include',
});

const App = () => {
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
								<Route path='/admin/images' element={<AdminImages />} />
								<Route path='/image/:image' element={<ImagePage />}></Route>
								<Route
									path='/category/:category'
									element={<CategoryPage />}
								></Route>
								<Route path='/cart' element={<ShoppingCart />}></Route>
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
