import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import FileList from './FileList';
import ChatInterface from './ChatInterface';
import FileUpload from './FileUpload';
import Navbar from './Navbar';

const App = () => {
	return (
		<Router>
			<Navbar />
			<Routes>
				<Route path="/upload" element={<FileUpload />} />
				<Route path="/files/:id" element={<ChatInterface />} />
				<Route path="/" element={<FileList />} />
			</Routes>
		</Router>
	);
};

export default App;
