/// <reference lib="webworker" />

import { runPipeline } from './transformers.service';

addEventListener('message', async ({ data }) => {
  let result = await runPipeline(
    data.pipelineName,
    data.input,
    data.model,
    data.options,
    data.pipelineParams
  );

  postMessage(result);
});
