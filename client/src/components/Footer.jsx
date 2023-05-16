import '../scss/Footer.scss';

const Footer = () => {
	return (
		<>
			<footer className='footer mt-auto py-3'>
				<div className='container d-flex'>
					<div className='col-md-4 d-flex align-items-center'>
						<a
							href='/'
							className='mb-3 me-2 mb-md-0 text-muted text-decoration-none lh-1'
						>
							<svg className='bi' width='30' height='24'>
								<use xlinkHref='#bootstrap'></use>
							</svg>
						</a>
						<span className='text-muted'>© 2023 Bothniabladet</span>
					</div>
					{/* <ul className='nav col-md-4 justify-content-end list-unstyled d-flex'>
						<li className='ms-2 fs-2'>
							<a className='text-muted' href='https://github.com'>
								<FaGithub />
							</a>
						</li>
					</ul> */}
				</div>
			</footer>
		</>
	);
};
export default Footer;
