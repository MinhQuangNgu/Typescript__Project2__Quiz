export interface router {
	path: string;
	element: React.FC<{}>;
}

export interface user {
	token: string | null;
	name: string | null;
	image: string | null;
}
export interface ErrorLogin {
	msg: string;
}
export interface quiz {
	name: string;
	image: string;
	_id: string;
	questions: [
		{
			_id: string;
			correctAnswer: string;
			image: string;
			name: string;
			answers: string[];
		}
	];
}
export interface question {
	answers: string[];
	correctAnswer: string;
	image: ProgressEvent<FileReader> | unknown;
	name: string;
	url?: string;
	_id?: string;
	[key: string]: any;
}