import { NgModule } from '@angular/core';
import { CommonModule } from "@angular/common";
import { RouterModule } from "@angular/router";
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { ToastrModule } from 'ngx-toastr';
import { HttpClientModule, HttpClient } from '@angular/common/http'; 

import {TranslateModule, TranslateLoader} from '@ngx-translate/core';
import {TranslateHttpLoader} from '@ngx-translate/http-loader';

import { FooterComponent } from "./footer/footer.component";
import { NavbarComponent } from "./navbar/navbar.component";
import { LoaderComponent } from './loader/loader.component';

//language translation Setup
export function createTranslateLoader(http: HttpClient) {
    return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

@NgModule({
    exports: [
        CommonModule,
        FooterComponent,
        NavbarComponent,
        ReactiveFormsModule,
        FormsModule,
        ToastrModule,
        LoaderComponent,
    ],
    imports:[
        RouterModule,
        CommonModule,
        ReactiveFormsModule,
        FormsModule,
        ToastrModule.forRoot({
        preventDuplicates: true,
        maxOpened: 1
        }),
        HttpClientModule,
        BrowserAnimationsModule,
        TranslateModule.forRoot({
            loader: {
                provide: TranslateLoader,
                useFactory: (createTranslateLoader),
                deps: [HttpClient]
            }
        })
    ],
    declarations: [
        FooterComponent,
        NavbarComponent,
        LoaderComponent
        ],
    providers: []
})
export class SharedModule { }
