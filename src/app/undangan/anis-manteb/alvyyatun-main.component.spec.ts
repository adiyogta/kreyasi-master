import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AlvyyatunMainComponent2 } from './alvyyatun-main.component';

describe('AlvyyatunMainComponent', () => {
  let component: AlvyyatunMainComponent2;
  let fixture: ComponentFixture<AlvyyatunMainComponent2>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AlvyyatunMainComponent2]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AlvyyatunMainComponent2);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
