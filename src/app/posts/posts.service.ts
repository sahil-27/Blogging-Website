import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';

import { Post } from './post.model'
import { Router } from '@angular/router';
import { environment } from '../../environments/environment';

const BACKEND_URL = `${environment.apiUrl}/posts/`;

@Injectable({ providedIn: 'root' })
export class PostsService {
	private posts: Post[] = [];
	private postsUpdated = new Subject<{ posts: Post[], postCount: number }>();

	constructor(private http: HttpClient, private router: Router) { }

	/**
	 * Fetch all posts from the server
	 */
	getPost(postsPerPage: number, currentPage: number) {
		const queryParams = `?pagesize=${postsPerPage}&page=${currentPage}`;
		this.http.get<{ message: string, posts: any, maxPosts: number }>(BACKEND_URL + queryParams)
			.pipe(map((postData) => {
				return {
					posts: postData.posts.map(post => {
						return {
							title: post.title,
							content: post.content,
							id: post._id,
							imagePath: post.imagePath,
							creator: post.creator,
							authorUsername: post.username,
							createdAt: post.createdAt
						};
					}),
					maxPosts: postData.maxPosts
				};
			}))
			.subscribe((modifiedPosts) => {
				this.posts = modifiedPosts.posts;
				this.postsUpdated.next({
					posts: [...this.posts],
					postCount: modifiedPosts.maxPosts
				});
			});
	}

	/**
	 * Fetch a single post from the server
	 */
	getSinglePost(postId: string) {
		return this.http.get<{ _id: string, title: string, content: string, imagePath?: string, creator: string, username: string, createdAt: string }>(BACKEND_URL + postId);
	}

	getPostUpdatedListener() {
		return this.postsUpdated.asObservable();
	}

	/**
	 * Create a new post
	 */
	addPost(title: string, content: string, image: File, creator: string) {
		const postData = new FormData();
		postData.append('title', title);
		postData.append('content', content);
		postData.append('username', creator);
		if (image) {
			postData.append('image', image, title);
		}

		this.http.post<{ message: string, post: Post }>(BACKEND_URL, postData)
			.subscribe((responseData) => {
				this.router.navigate(['/']);
			});
	}

	/**
	 * Update/edit a post
	 */
	updatePost(id: string, title: string, content: string, image: File | string) {
		let postData: any | FormData;
		if (typeof (image) === 'string') {
			postData = { id: id, title: title, content: content, imagePath: image, creator: null, authorUsername: null };
		}
		else {
			postData = new FormData();
			postData.append('id', id);
			postData.append('title', title);
			postData.append('content', content);
			postData.append('creator', null);
			if (image) {
				postData.append('image', image, title);
			}
		}

		this.http.put(BACKEND_URL + id, postData)
			.subscribe((Response) => {
				this.router.navigate(['/']);
			})
	}

	/**
	 * Delete a post
	 */
	deletePost(postId: string) {
		return this.http.delete(BACKEND_URL + postId);
	}

}