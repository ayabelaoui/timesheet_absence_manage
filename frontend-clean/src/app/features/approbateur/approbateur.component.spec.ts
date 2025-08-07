import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ApprobateurComponent } from './approbateur.component';

describe('ApprobateurComponent', () => {
  let component: ApprobateurComponent;
  let fixture: ComponentFixture<ApprobateurComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ApprobateurComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ApprobateurComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
