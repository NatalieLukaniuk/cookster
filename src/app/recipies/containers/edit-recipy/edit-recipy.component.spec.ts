import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditRecipyComponent } from './edit-recipy.component';

describe('EditRecipyComponent', () => {
  let component: EditRecipyComponent;
  let fixture: ComponentFixture<EditRecipyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditRecipyComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EditRecipyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
