import { ApolloClient, ApolloProvider, InMemoryCache } from '@apollo/client';
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import './App.scss';
import Footer from './components/Footer';
import Header from './components/Header';
import AdminImages from './pages/AdminImages';
import AdminUsers from './pages/AdminUsers';
import Home from './pages/Home';
import ImagePage from './pages/ImagePage';
import Login from './pages/Login';
import NotFound from './pages/NotFound';
import Register from './pages/Register';

import { createUploadLink } from 'apollo-upload-client';
import { Provider } from 'react-redux';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { store } from './app/store';
import CategoryPage from './pages/CategoryPage';
import OrderConfirmation from './pages/OrderConfirmation';
import ShoppingCart from './pages/ShoppingCart';
import VersionHistory from './pages/VersionHistory';
import UserProfile from './pages/UserProfile';
import OrderHistory from './pages/OrderHistory';
import ImageRequest from './pages/ImageRequest';
import AdminImageRequests from './pages/AdminImageRequests';

const typePolicies = {
	Query: {
		fields: [
			'latest_version_images',
			'image_tags',
			'shopping_cart_images_by_sc_id',
			'images_by_tag_name',
			'requested_images',
		].reduce((accumulator, fieldName) => {
			accumulator[fieldName] = {
				merge(existing, incoming) {
					return incoming;
				},
			};
			return accumulator;
		}, {}),
	},
};

export const client = new ApolloClient({
	link: createUploadLink({
		uri: 'http://localhost:5000/graphql',
		credentials: 'include',
	}),
	cache: new InMemoryCache({
		typePolicies,
	}),
});

const App = () => {
	return (
		<>
			<ApolloProvider client={client}>
				<Router>
					<Provider store={store}>
						<Header />
						<main className='container mt-3'>
							<Routes>
								<Route path='*' element={<NotFound />} />
								<Route path='/' element={<Home />} />
								<Route path='/login' element={<Login />} />
								<Route path='/register' element={<Register />} />
								<Route path='/admin/users' element={<AdminUsers />} />
								<Route path='/admin/images' element={<AdminImages />} />
								<Route path='/image/:image' element={<ImagePage />} />
								<Route path='/order/:order' element={<OrderConfirmation />} />
								<Route path='/profile' element={<UserProfile />} />
								<Route path='/order-history' element={<OrderHistory />} />
								<Route path='/image-request' element={<ImageRequest />} />
								<Route
									path='/admin/image-requests'
									element={<AdminImageRequests />}
								/>
								<Route
									path='/version-history/:image'
									element={<VersionHistory />}
								/>
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
