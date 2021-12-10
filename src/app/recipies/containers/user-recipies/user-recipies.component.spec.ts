/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { UserRecipiesComponent } from './user-recipies.component';

describe('UserRecipiesComponent', () => {
  let component: UserRecipiesComponent;
  let fixture: ComponentFixture<UserRecipiesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UserRecipiesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserRecipiesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
