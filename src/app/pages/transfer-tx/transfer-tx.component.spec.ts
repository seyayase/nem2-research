import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TransferTxComponent } from './transfer-tx.component';

describe('TransferTxComponent', () => {
  let component: TransferTxComponent;
  let fixture: ComponentFixture<TransferTxComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TransferTxComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TransferTxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
