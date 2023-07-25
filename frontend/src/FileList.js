import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const FileList = () => {
	const [files, setFiles] = useState([]);

	useEffect(() => {
		const fetchFiles = async () => {
			const res = await axios.get('http://localhost:8000/files');
			setFiles(res.data);
		};
		fetchFiles();
	}, []);

	return (
		<div className="p-4">
			<div>
				<div className="text-3xl font-medium text-black py-3">Your PDFs</div>
				{files.length > 0 ? (
					<div className="grid grid-cols-5 gap-5">
						{files.map(file => (
							<Link to={`/files/${file.id}`}>
								<div
									key={file.id}
									className="text-center border border-solid border-slate-300 rounded-lg height-full p-5"
								>
									<svg
										xmlns="http://www.w3.org/2000/svg"
										fill="none"
										viewBox="0 0 24 24"
										stroke-width="1.5"
										stroke="currentColor"
										className="w-12 h-12 block m-auto text-slate-600"
									>
										<path
											stroke-linecap="round"
											stroke-linejoin="round"
											d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z"
										/>
									</svg>
									{file.filename}
								</div>
							</Link>
						))}
					</div>
				) : (
					'You have no PDFs. To upload a PDF, click the button above.'
				)}
			</div>
		</div>
	);
};

export default FileList;
