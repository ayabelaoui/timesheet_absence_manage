import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HoraireComponent } from '../composants/horaire.component';

@NgModule({
    declarations: [
        HoraireComponent
    ],
    imports: [
        CommonModule,
        FormsModule
    ],
    exports: [
        HoraireComponent
    ]
})
export class HoraireModule { }
