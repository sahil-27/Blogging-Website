import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';

import { Post } from '../post.model';
import { PostsService } from '../posts.service';
import { ActivatedRoute } from '@angular/router';
import { PageEvent } from '@angular/material/paginator';
import { AuthService } from 'src/app/auth/auth.service';
import { PopUpComponent } from 'src/app/pop-up/pop-up.component';

@Component({
	selector: 'app-post-list',
	templateUrl: './post-list.component.html',
	styleUrls: ['./post-list.component.css']
})

export class PostListComponent implements OnInit, OnDestroy {

	public showLoadingSpinner = false;
	totalPosts = 0;
	postsPerPage = 10;
	currentPage = 1;
	pageSizeOptions = [1, 2, 5, 10];
	isUserAuthenticated = false;
	userId: string;
	username: string;
	tempTitle = "Surprise !! 👀"

	firstPost = {
		authorUsername: "~~~~",
		content: "",
		createdAt: "2025-03-02T16:53:54.868Z",
		creator: "67c48c973e98a201350dd0b2",
		id: "67c48d223e98a201350dd0b9",
		imagePath: undefined,
		title: this.tempTitle
	};


	constructor(
		public postsService: PostsService,
		private authService: AuthService,
		public dialog: MatDialog
	) { }

	@Input() posts: Post[] = []
	private postsSub: Subscription;
	private authSubjectListener: Subscription;

	ngOnInit(): void {
		this.showLoadingSpinner = true;
		this.userId = this.authService.getUserId();
		this.isUserAuthenticated = this.authService.getIsAuth();
		this.authSubjectListener = this.authService.getAuthStatusListener().subscribe(
			isAuthenticated => {
				this.isUserAuthenticated = isAuthenticated;
				this.userId = this.authService.getUserId();
				this.username = this.authService.getUsername();
			}
		);
		this.postsService.getPost(this.postsPerPage, this.currentPage);
		this.postsSub = this.postsService.getPostUpdatedListener()
			.subscribe((postData: { posts: Post[], postCount: number }) => {
				this.showLoadingSpinner = false
				this.totalPosts = postData.postCount;
				this.posts = postData.posts;
				if (this.isUserAuthenticated) {
					this.username = this.authService.getUsername();
					if (this.username == 'user') {
						this.posts.push(this.firstPost);
					}
				}
			})
	}

	ngOnDestroy(): void {
		this.postsSub.unsubscribe();
		this.authSubjectListener.unsubscribe();
	}

	onDelete(postId: string) {
		this.showLoadingSpinner = true;
		this.postsService.deletePost(postId).subscribe(() => {
			this.postsService.getPost(this.postsPerPage, this.currentPage);
		}, () => {
			this.showLoadingSpinner = false;
		});
	}

	onChangedPage(pageData: PageEvent) {
		this.showLoadingSpinner = true;
		this.currentPage = pageData.pageIndex + 1;
		this.postsPerPage = pageData.pageSize;
		this.postsService.getPost(this.postsPerPage, this.currentPage);
	}

	getDate(isoDate: string) {
		const date = new Date(isoDate);

		return date.toLocaleString("en-GB", {
			day: "numeric",
			month: "short",
			year: "numeric",
			hour: "2-digit",
			minute: "2-digit",
			hour12: false
		}).replace(",", "");
	}

	openDialog() {
		const log = `${this.username} opened the dialog`;
		this.authService.postLogs(log);
		this.dialog.open(PopUpComponent, {
			height: '400px',
			width: '600px'
		});
	}
}
