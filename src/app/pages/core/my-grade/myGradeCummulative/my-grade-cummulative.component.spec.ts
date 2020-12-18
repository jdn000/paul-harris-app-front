import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MyGradeCummulativeComponent } from './my-grade-cummulative.component';

describe('MyGradeCummulativeComponent', () => {
  let component: MyGradeCummulativeComponent;
  let fixture: ComponentFixture<MyGradeCummulativeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [MyGradeCummulativeComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MyGradeCummulativeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
