import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AlvyyatunMainComponent } from './alvyyatun-main.component';

describe('AlvyyatunMainComponent', () => {
  let component: AlvyyatunMainComponent;
  let fixture: ComponentFixture<AlvyyatunMainComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AlvyyatunMainComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AlvyyatunMainComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
