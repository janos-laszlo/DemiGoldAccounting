import { TestBed } from '@angular/core/testing';

import { TransactionOperationsService } from './transaction-operations.service';

describe('TransactionOperationsService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: TransactionOperationsService = TestBed.get(TransactionOperationsService);
    expect(service).toBeTruthy();
  });
});
