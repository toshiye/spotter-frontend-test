export type Filters = {
    maxPrice?: number;
    stops?: number[];
    airlines?: string[];
    sort?: SortOption;
}

export type SortOption = | 'price' | 'duration' | 'value';