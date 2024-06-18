export type getEnumFromObject<T extends Record<string, string | number | boolean>> = T[keyof T];
