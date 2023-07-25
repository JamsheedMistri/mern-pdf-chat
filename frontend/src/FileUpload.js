import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const FileUpload = () => {
	const [selectedFile, setSelectedFile] = useState();
	const navigate = useNavigate();

	const fileSelectedHandler = event => {
		setSelectedFile(event.target.files[0]);
	};

	const fileUploadHandler = async () => {
		const fd = new FormData();
		fd.append('pdf', selectedFile, selectedFile.name);
		const res = await axios.post('http://localhost:8000/upload', fd);
		navigate(`/files/${res.data.id}`);
	};

	return (
		<div className="p-6 max-w-sm mx-auto bg-white flex items-center space-x-4">
			<input
				type="file"
				onChange={fileSelectedHandler}
				className="border p-2"
			/>
			<button
				onClick={fileUploadHandler}
				className="bg-blue-500 text-white py-2 px-4"
			>
				Upload
			</button>
		</div>
	);
};

export default FileUpload;
