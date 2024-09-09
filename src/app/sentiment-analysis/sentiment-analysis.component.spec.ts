import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SentimentAnalysisComponent } from './sentiment-analysis.component';

describe('SentimentAnalysisComponent', () => {
  let component: SentimentAnalysisComponent;
  let fixture: ComponentFixture<SentimentAnalysisComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SentimentAnalysisComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SentimentAnalysisComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
