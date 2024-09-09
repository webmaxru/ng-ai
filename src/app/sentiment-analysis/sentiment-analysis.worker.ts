/// <reference lib="webworker" />

import { env, pipeline } from '@huggingface/transformers';

addEventListener('message', ({ data }) => {
  let response = generateSentiment(data).then((response) => {
    postMessage(response);
  });
  //postMessage(response);F
});

async function generateSentiment(inputString: string | string[]) {
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

  let out = await pipe(inputString);
  // [{'label': 'POSITIVE', 'score': 0.999817686}]
  return out;
}
