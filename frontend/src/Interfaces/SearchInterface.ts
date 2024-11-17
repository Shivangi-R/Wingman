export interface SearchInterface {
  query?: SearchQueryInterface[];
  logAmplitude?: boolean;
}
export interface SearchQueryInterface {
  type?: string;
  value?: string;
}

export interface SearchResult {
  data: string[];
}
export interface ElementTagInterface {
  id?: string;
  type?: string;
  value?: string;
  checked?: boolean;
}
export interface OnTagCloseInterface {
  event?: any;
  element?: ElementTagInterface;
}
