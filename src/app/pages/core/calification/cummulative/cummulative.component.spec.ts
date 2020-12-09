import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CummulativeComponent } from './cummulative.component';

describe('CummulativeComponent', () => {
  let component: CummulativeComponent;
  let fixture: ComponentFixture<CummulativeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CummulativeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CummulativeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
