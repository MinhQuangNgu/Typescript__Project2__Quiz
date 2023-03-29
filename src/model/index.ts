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