// https://github.com/huggingface/transformers.js/blob/main/src/utils/dtypes.js
export type DataType =
  | 'fp16'
  | 'fp32'
  | 'q8'
  | 'int8'
  | 'uint8'
  | 'q4'
  | 'bnb4'
  | 'q4f16';

// https://github.com/huggingface/transformers.js/blob/main/src/utils/devices.js
export type Provider =
  | 'webnn'
  | 'gpu'
  | 'auto'
  | 'cpu'
  | 'wasm'
  | 'webgpu'
  | 'cuda'
  | 'dml'
  | 'webnn-npu'
  | 'webnn-gpu'
  | 'webnn-cpu';

export interface Models {
  value: string;
  viewValue: string;
}
