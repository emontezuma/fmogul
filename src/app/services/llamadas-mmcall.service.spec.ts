import { TestBed } from '@angular/core/testing';

import { LlamadasMmcallService } from './llamadas-mmcall.service';

describe('LlamadasMmcallService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: LlamadasMmcallService = TestBed.get(LlamadasMmcallService);
    expect(service).toBeTruthy();
  });
});
