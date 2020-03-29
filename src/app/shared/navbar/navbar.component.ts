import { Component } from '@angular/core';
import {TranslateService} from '@ngx-translate/core';
import { UserService } from '../services/user.service';

@Component({
    selector: 'app-navbar',
    templateUrl: './navbar.component.html',
    styleUrls: ['./navbar.component.scss']
})

export class NavbarComponent{

    constructor(public translate: TranslateService,
        public service: UserService) {
        translate.setDefaultLang('en');
    }

    logout() {
        this.service.logout();
    }
}
