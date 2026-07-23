import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { LeaveService } from './leave';  

describe('LeaveService', () => {
  let service: LeaveService;  

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule]  
    });
    service = TestBed.inject(LeaveService); 
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});