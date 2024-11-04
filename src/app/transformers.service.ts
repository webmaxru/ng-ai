import { env, pipeline } from '@huggingface/transformers';
import { Provider, DataType } from './types'; // Adjust the import path as needed

// Specify a custom location for models (defaults to '/models/').
env.localModelPath = '/models/';

// Disable the loading of remote models from the Hugging Face Hub:
env.allowRemoteModels = true;
env.allowLocalModels = false;
env.useBrowserCache = true;

// Set location of .wasm files. Defaults to use a CDN.
if (env.backends.onnx.wasm) {
  // env.backends.onnx.wasm.wasmPaths = '/wasm/'; // https://cdn.jsdelivr.net/npm/onnxruntime-web/dist/
}

interface SessionOptions {
  freeDimensionOverrides?: any;
}

export function setOptions(
  settingsComponent: any,
  freeDimensionOverridesValue: any
) {
  let provider =
    settingsComponent.settings['api'] == 'webnn'
      ? ([
          settingsComponent.settings['api'],
          settingsComponent.settings['webnnDevice'],
        ]
          .filter(Boolean)
          .join('-') as Provider)
      : (settingsComponent.settings['api'] as Provider);

  const options: any = {
    dtype: settingsComponent.settings['quantization'] as DataType,
    device: provider,
    session_options: {} as SessionOptions,
    logLevel: 'verbose',
  };

  if (settingsComponent.settings['isFreeDimensionOverrides']) {
    options.session_options.freeDimensionOverrides =
      freeDimensionOverridesValue;
  } else {
    delete options.session_options;
  }

  return options;
}

export async function analyzeSentiment(
  text: string,
  model: string,
  options: any
) {
  const startTime = Date.now();
  try {
    let pipe = await pipeline('sentiment-analysis', model, options);

    let result = await pipe(text);
    const duration = Date.now() - startTime;
    return { error: null, result: result, duration: duration };
  } catch (error) {
    const duration = Date.now() - startTime;
    return { error: error, result: null, duration: duration };
  }
}

export async function generateText(text: string, model: string, options: any) {
  const startTime = Date.now();
  options.use_external_data_format = true;
  try {
    let pipe = await pipeline('text-generation', model, options);

    let result = await pipe(text, {
      temperature: 2,
      max_new_tokens: 10,
      repetition_penalty: 1.5,
      no_repeat_ngram_size: 2,
      num_beams: 2,
      num_return_sequences: 2,
    });
    const duration = Date.now() - startTime;
    return { error: null, result: result, duration: duration };
  } catch (error) {
    const duration = Date.now() - startTime;
    console.error(error);
    return { error: error, result: null, duration: duration };
  }
}
