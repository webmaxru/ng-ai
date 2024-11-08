import { Routes } from '@angular/router';
import { SentimentAnalysisComponent } from './sentiment-analysis/sentiment-analysis.component';
import { TextGenerationComponent } from './text-generation/text-generation.component';
import { ImageSegmentationComponent } from './image-segmentation/image-segmentation.component';
import { HomeComponent } from './home/home.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'generation', component: TextGenerationComponent },
  { path: 'analysis', component: SentimentAnalysisComponent },
  { path: 'vision', component: ImageSegmentationComponent },
];
