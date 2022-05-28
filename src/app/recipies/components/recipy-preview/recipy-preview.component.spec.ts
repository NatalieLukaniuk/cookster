import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RecipyPreviewComponent } from './recipy-preview.component';

describe('RecipyPreviewComponent', () => {
  let component: RecipyPreviewComponent;
  let fixture: ComponentFixture<RecipyPreviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RecipyPreviewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RecipyPreviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
