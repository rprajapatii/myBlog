import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CategoricalBlogComponent } from './categorical-blog.component';

describe('CategoricalBlogComponent', () => {
  let component: CategoricalBlogComponent;
  let fixture: ComponentFixture<CategoricalBlogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CategoricalBlogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CategoricalBlogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
