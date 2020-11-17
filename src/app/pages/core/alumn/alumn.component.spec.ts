import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AlumnComponent } from './alumn.component';

describe('AlumnComponent', () => {
  let component: AlumnComponent;
  let fixture: ComponentFixture<AlumnComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AlumnComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AlumnComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
