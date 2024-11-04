/// <reference lib="webworker" />

import { analyzeSentiment } from './../transformers.service';

addEventListener('message', async ({ data }) => {
  let result = await runPipeline(data.text, data.model, data.options);

  postMessage(result);
});

async function runPipeline(text: string, model:string, options: any) {
  const result = await analyzeSentiment(
    text,
    model,
    options
  );

  return result;
}
