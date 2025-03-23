import { Component, ChangeDetectorRef, OnInit } from '@angular/core';
import { Post } from './posts/post.model';
import { AuthService } from './auth/auth.service';
import { MatDialog } from '@angular/material/dialog';

@Component({
	selector: 'app-root',
	templateUrl: './app.component.html',
	styleUrls: ['./app.component.css']
})

export class AppComponent implements OnInit {
	title = 'Angular course';

	constructor(
		private authService: AuthService
	) { }

	ngOnInit(): void {
		this.authService.autoAuthUser();
	}
}
