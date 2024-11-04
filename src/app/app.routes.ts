import { Routes } from '@angular/router';
import { SentimentAnalysisComponent } from './sentiment-analysis/sentiment-analysis.component';
import { TextGenerationComponent } from './text-generation/text-generation.component';

export const routes: Routes = [
  { path: '', component: SentimentAnalysisComponent },
  { path: 'text-generation', component: TextGenerationComponent }
];
