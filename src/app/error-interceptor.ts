import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { catchError, Observable, throwError } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { Inject, Injectable } from '@angular/core';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {

	constructor(private toastr: ToastrService) { }

	intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
		return next.handle(req).pipe(
			catchError((error: HttpErrorResponse) => {
				this.toastr.error(error.error.message, 'Error');
				return throwError(() => error);
			})
		);
	}

}