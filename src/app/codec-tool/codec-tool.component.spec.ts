import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CodecToolComponent } from './codec-tool.component';

describe('CodecToolComponent', () => {
  let component: CodecToolComponent;
  let fixture: ComponentFixture<CodecToolComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CodecToolComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CodecToolComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
