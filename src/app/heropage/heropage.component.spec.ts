import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HeropageComponent } from './heropage.component';

describe('HeropageComponent', () => {
  let component: HeropageComponent;
  let fixture: ComponentFixture<HeropageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HeropageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HeropageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
