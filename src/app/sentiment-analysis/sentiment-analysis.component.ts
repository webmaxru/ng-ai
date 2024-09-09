import { Component } from '@angular/core';
import { env, pipeline } from '@huggingface/transformers';

@Component({
  selector: 'app-sentiment-analysis',
  standalone: true,
  imports: [],
  templateUrl: './sentiment-analysis.component.html',
  styleUrl: './sentiment-analysis.component.css',
})
export class SentimentAnalysisComponent {
  async load() {
    //env.localModelPath = '/path/to/models/';
    env.allowLocalModels = false;
    // Allocate a pipeline for sentiment-analysis
    let pipe = await pipeline(
      'sentiment-analysis',
      'Xenova/bert-base-multilingual-uncased-sentiment',
      {
        device: 'webnn',
        dtype: 'fp32', // or 'fp16'
      }
    );

    let out = await pipe('I love transformers!');
    // [{'label': 'POSITIVE', 'score': 0.999817686}]
    console.log(out);
  }
}
