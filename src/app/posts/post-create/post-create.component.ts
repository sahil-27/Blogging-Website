import { Component, OnInit, EventEmitter, Output, OnDestroy } from '@angular/core';
import { FormControl, FormGroup, NgForm, Validators } from '@angular/forms';

import { Post } from '../post.model';
import { PostsService } from '../posts.service';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { mimeType } from './mime-type.validator';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/auth/auth.service';


@Component({
	selector: 'app-post-create',
	templateUrl: './post-create.component.html',
	styleUrls: ['./post-create.component.css']
})
export class PostCreateComponent implements OnInit, OnDestroy {

	private mode = 'create';
	private postId: string;
	public singlePost: Post;
	public showLoadingSpinner = false;
	public imagePreview: string;
	private authSub: Subscription;
	username: string;
	form: FormGroup;


	constructor(public postsService: PostsService, public route: ActivatedRoute, public authService: AuthService) { }

	ngOnInit(): void {
		this.authSub = this.authService.getAuthStatusListener().subscribe((authStatus) => {
			this.showLoadingSpinner = false;
		});

		this.username = this.authService.getUsername();

		/**
		 * Check if the route has a postId parameter
		 */
		this.form = new FormGroup({
			'title': new FormControl(null, { validators: [Validators.required, Validators.minLength(3)] }),
			'content': new FormControl(null, { validators: [Validators.required, Validators.pattern(/\S/)] }),
			'image': new FormControl(null, { asyncValidators: [mimeType] })
		});
		this.route.paramMap.subscribe((paramMap: ParamMap) => {
			if (paramMap.has('postId')) {
				this.mode = 'edit';
				this.postId = paramMap.get('postId');
				this.showLoadingSpinner = true;
				this.postsService.getSinglePost(this.postId)
					.subscribe((postData) => {
						this.showLoadingSpinner = false;
						this.singlePost = {
							id: postData._id,
							title: postData.title,
							content: postData.content,
							creator: postData.creator,
							authorUsername: postData.username,
							createdAt: postData.createdAt
						}
						if (postData.imagePath) {
							this.singlePost.imagePath = postData.imagePath;
						}
						this.form.patchValue({
							'title': this.singlePost.title,
							'content': this.singlePost.content,
							...(this.singlePost.imagePath && { 'image': this.singlePost.imagePath })
						});
					});
			}
			else {
				this.mode = 'create';
				this.postId = null;
			}
		});
	}

	ngOnDestroy(): void {
		this.authSub.unsubscribe();
	}

	// @Output() postCreated = new EventEmitter<Post>();

	onImagePicked(event: Event) {
		const file = (event.target as HTMLInputElement).files[0];
		this.form.patchValue({ image: file });
		this.form.get('image').updateValueAndValidity();

		const reader = new FileReader();
		reader.onload = () => {
			this.imagePreview = reader.result as string;
		};
		reader.readAsDataURL(file);
	}

	onSavePost(form: NgForm) {
		if (this.form.invalid) {
			return;
		}
		this.showLoadingSpinner = true;
		if (this.mode === 'create') {
			this.postsService.addPost(this.form.value.title, this.form.value.content, this.form.value.image ? this.form.value.image : null, this.username);
		}
		else {
			this.postsService.updatePost(this.postId, this.form.value.title, this.form.value.content, this.form.value.image ? this.form.value.image : null);
		}
		this.form.reset();
	}
}
