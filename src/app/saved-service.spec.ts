import { TestBed } from '@angular/core/testing';
import { SavedService } from './saved-service';

describe('SavedService', () => {
  it('toggles ids and counts them', () => {
    const service = TestBed.inject(SavedService);
    service.toggle(3);
    expect(service.has(3)).toBe(true);
    expect(service.count()).toBe(1);
    service.toggle(3);
    expect(service.has(3)).toBe(false);
    expect(service.count()).toBe(0);
  });
});
