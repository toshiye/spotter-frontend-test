export interface Filters {
  maxPrice?: number;
  stops: number[];
  airlines: string[];
  sort?: string;
}

export type SortOption = | 'price' | 'duration' | 'value';