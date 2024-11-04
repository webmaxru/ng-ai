/// <reference lib="webworker" />

import { generateText } from './../transformers.service';

addEventListener('message', async ({ data }) => {
  let result = await runPipeline(data.text, data.model, data.options);

  postMessage(result);
});

async function runPipeline(text: string, model:string, options: any) {
  const result = await generateText(
    text,
    model,
    options
  );

  return result;
}
