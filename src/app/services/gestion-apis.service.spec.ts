import { TestBed } from '@angular/core/testing';

import { GestionApisService } from './gestion-apis.service';

describe('GestionApisService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: GestionApisService = TestBed.get(GestionApisService);
    expect(service).toBeTruthy();
  });
});
