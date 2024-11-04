import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TextGenerationComponent } from './text-generation.component';

describe('TextGenerationComponent', () => {
  let component: TextGenerationComponent;
  let fixture: ComponentFixture<TextGenerationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TextGenerationComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TextGenerationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
