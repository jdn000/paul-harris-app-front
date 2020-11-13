import { Injectable, OnInit } from '@angular/core';
import { NbToastrService, NbComponentStatus } from '@nebular/theme';

@Injectable({
    providedIn: 'root',
})
export class ToastService implements OnInit {

    constructor(
        private toastrService: NbToastrService,
    ) { }

    ngOnInit() {
    }

    showInfo(message: string, title?: string) {
        this.toastrService.show(
            message,
            title || 'Información',
            {
                limit: 1,
                status: 'info',
            },
        );
    }

    showError(message: string, title?: string) {
        this.toastrService.show(
            message,
            title || 'Error',
            {
                limit: 1,
                status: 'danger',
            },
        );
    }

    showWarning(message: string, title?: string) {
        this.toastrService.show(
            message,
            title || 'Advertencia !',
            {
                limit: 1,
                status: 'warning',
            },
        );
    }

    showSuccess(message: string, title?: string) {
        this.toastrService.show(
            message,
            title || 'Ok !',
            {
                limit: 1,
                status: 'success',
            },
        );
    }

    showToast(status: NbComponentStatus, title, body) {
        this.toastrService.show(
            body,
            title,
            { limit: 1, status },
        );
    }
}
