import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MyRecruitment } from './my-recruitment';

describe('MyRecruitment', () => {
  let component: MyRecruitment;
  let fixture: ComponentFixture<MyRecruitment>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MyRecruitment],
    }).compileComponents();

    fixture = TestBed.createComponent(MyRecruitment);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
