export interface GeneratedUI {
  id: string;
  prompt: string;
  html: string;
  css: string;
  js: string;
  timestamp: number;
}

export interface GenerateRequest {
  prompt: string;
  patternCount: number;
  referenceImages: string[];
  referenceUrls: string[];
  apiKey: string;
}

export interface GenerateResponse {
  success: boolean;
  data?: GeneratedUI[];
  error?: string;
}
