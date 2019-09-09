import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MosaicArtCreatorComponent } from './mosaic-art-creator.component';

describe('MosaicArtCreatorComponent', () => {
  let component: MosaicArtCreatorComponent;
  let fixture: ComponentFixture<MosaicArtCreatorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MosaicArtCreatorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MosaicArtCreatorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
