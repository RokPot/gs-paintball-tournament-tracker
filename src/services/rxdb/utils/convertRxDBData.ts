/**
 * Utility function to convert RxDB's DeepReadonly types to mutable types
 *
 * RxDB's toJSON() returns DeepReadonlyArray and DeepReadonlyObject,
 * but our domain classes expect mutable arrays and objects.
 *
 * This function creates a deep clone, converting all readonly arrays to mutable arrays.
 *
 * Type assertion is needed because TypeScript can't infer that DeepReadonly types
 * become mutable after cloning, but at runtime they are indeed mutable arrays.
 */
export default function convertRxDBData<T>(data: T): T {
  if (data === null || data === undefined) {
    return data;
  }

  // Handle arrays (including DeepReadonlyArray)
  if (Array.isArray(data)) {
    // Clone array and recursively convert items
    return data.map((item) => convertRxDBData(item)) as unknown as T;
  }

  // Handle Date objects
  if (data instanceof Date) {
    return new Date(data.getTime()) as unknown as T;
  }

  // Handle plain objects
  if (typeof data === 'object') {
    const converted = {} as any;
    Object.keys(data).forEach((key) => {
      converted[key] = convertRxDBData((data as any)[key]);
    });
    return converted as T;
  }

  // Primitives (string, number, boolean, etc.)
  return data;
}
