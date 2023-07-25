import { Link } from 'react-router-dom';

const Navbar = () => {
	return (
		<header className="flex justify-between items-center p-4 bg-gray-700">
			<Link to="/">
				<h1 className="text-white">PDF Chat</h1>
			</Link>

			<div>
				<Link to="/upload" className="bg-blue-500 text-white px-4 py-2">
					Upload PDF
				</Link>
			</div>
		</header>
	);
};

export default Navbar;
