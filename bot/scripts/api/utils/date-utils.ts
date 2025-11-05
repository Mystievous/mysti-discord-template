// ISO string returned from FastAPI when dealing with `datetime` fields.
export type APIDateString =
  `${number}-${number}-${number}T${number}:${number}:${number}.${number}+${number}:${number}`;

export function isAPIDateString(s: string): s is APIDateString {
  return /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\+\d{2}:\d{2}$/.test(s);
}

/**
 * Type-level transformation to convert all APIDateString properties in a type to Date properties.
 *
 * Handles nested objects and arrays, matching the behavior of `convertAPIDates` function.
 */
type ConvertDateFields<T> = T extends APIDateString
  ? Date
  : T extends Date
  ? Date
  : T extends Array<infer U>
  ? Array<ConvertDateFields<U>>
  : T extends object
  ? { [K in keyof T]: ConvertDateFields<T[K]> }
  : T;

/**
 * Recursively converts all APIDateString properties in an object to Date properties.
 *
 * @param obj The object to convert.
 * @returns The converted object with Date properties in place of the `APIDateString` fields.
 */

// Overloads to handle nullable/undefined inputs and return the same
export function convertAPIDates<T>(obj: T): ConvertDateFields<T>;
export function convertAPIDates<T>(obj: T | null): ConvertDateFields<T> | null;
export function convertAPIDates<T>(
  obj: T | undefined
): ConvertDateFields<T> | undefined;
export function convertAPIDates<T>(
  obj: T | undefined | null
): ConvertDateFields<T> | undefined | null;

export function convertAPIDates<T>(
  obj: T | T[] | undefined | null
): ConvertDateFields<T> | ConvertDateFields<T>[] | undefined | null {
  if (obj === null) {
    return null;
  }
  if (obj === undefined) {
    return undefined;
  }
  if (Array.isArray(obj)) {
    return obj.map((item) => convertAPIDates(item));
  }

  const convertedObj: any = {};

  for (const key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      const value = obj[key];
      if (typeof value === "string" && isAPIDateString(value)) {
        convertedObj[key] = new Date(value);
      } else {
        convertedObj[key] = value;
      }
    }
  }

  return convertedObj as ConvertDateFields<T>;
}
