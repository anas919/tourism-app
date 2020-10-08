import { TestBed } from '@angular/core/testing';

import { StudentseancesService } from './studentseances.service';

describe('StudentseancesService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: StudentseancesService = TestBed.get(StudentseancesService);
    expect(service).toBeTruthy();
  });
});
