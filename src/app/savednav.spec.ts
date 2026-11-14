import { TestBed } from '@angular/core/testing';
import { Savednav } from './savednav';

describe('Savednav', () => {
  let service: Savednav;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Savednav);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
