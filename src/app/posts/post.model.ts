export interface Post {
	id: string,
	title: string;
	content: string;
	imagePath?: string;
	creator: string;
	authorUsername: string;
	createdAt: string;
}