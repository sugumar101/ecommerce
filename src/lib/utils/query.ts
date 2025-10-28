import queryString from 'query-string';

export interface FilterParams {
  gender?: string | string[];
  size?: string | string[];
  color?: string | string[];
  priceRange?: string | string[];
  sort?: string;
  page?: string;
}

/**
 * Parse URL search params into a structured object
 */
export function parseQueryParams(search: string): FilterParams {
  const parsed = queryString.parse(search, { arrayFormat: 'comma' });
  return parsed as FilterParams;
}

/**
 * Stringify filter params into a URL query string
 */
export function stringifyQueryParams(params: FilterParams): string {
  return queryString.stringify(params, { arrayFormat: 'comma', skipNull: true, skipEmptyString: true });
}

/**
 * Add or update a filter parameter
 */
export function updateFilterParam(
  currentSearch: string,
  key: keyof FilterParams,
  value: string | string[]
): string {
  const params = parseQueryParams(currentSearch);
  
  if (Array.isArray(value) && value.length === 0) {
    delete params[key];
  } else {
    params[key] = value;
  }
  
  if (key !== 'page') {
    params.page = '1';
  }
  
  return stringifyQueryParams(params);
}

/**
 * Remove a filter parameter
 */
export function removeFilterParam(
  currentSearch: string,
  key: keyof FilterParams
): string {
  const params = parseQueryParams(currentSearch);
  delete params[key];
  
  if (key !== 'page') {
    params.page = '1';
  }
  
  return stringifyQueryParams(params);
}

/**
 * Toggle a value in a multi-select filter
 */
export function toggleFilterValue(
  currentSearch: string,
  key: keyof FilterParams,
  value: string
): string {
  const params = parseQueryParams(currentSearch);
  const currentValue = params[key];
  
  let newValue: string[];
  
  if (!currentValue) {
    newValue = [value];
  } else if (Array.isArray(currentValue)) {
    if (currentValue.includes(value)) {
      newValue = currentValue.filter(v => v !== value);
    } else {
      newValue = [...currentValue, value];
    }
  } else {
    if (currentValue === value) {
      newValue = [];
    } else {
      newValue = [currentValue, value];
    }
  }
  
  if (newValue.length === 0) {
    delete params[key];
  } else {
    params[key] = newValue;
  }
  
  params.page = '1';
  
  return stringifyQueryParams(params);
}

/**
 * Check if a filter value is active
 */
export function isFilterActive(
  currentSearch: string,
  key: keyof FilterParams,
  value: string
): boolean {
  const params = parseQueryParams(currentSearch);
  const currentValue = params[key];
  
  if (!currentValue) return false;
  
  if (Array.isArray(currentValue)) {
    return currentValue.includes(value);
  }
  
  return currentValue === value;
}

/**
 * Get all active filters as an array of { key, value } objects
 */
export function getActiveFilters(currentSearch: string): Array<{ key: string; value: string }> {
  const params = parseQueryParams(currentSearch);
  const activeFilters: Array<{ key: string; value: string }> = [];
  
  Object.entries(params).forEach(([key, value]) => {
    if (key === 'sort' || key === 'page') return;
    
    if (Array.isArray(value)) {
      value.forEach(v => {
        activeFilters.push({ key, value: v });
      });
    } else if (value) {
      activeFilters.push({ key, value });
    }
  });
  
  return activeFilters;
}

/**
 * Clear all filters except sort and page
 */
export function clearAllFilters(currentSearch: string): string {
  const params = parseQueryParams(currentSearch);
  const { sort } = params;
  
  return stringifyQueryParams({ sort, page: '1' });
}
