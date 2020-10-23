export type AnyObject = Record<string | number | symbol, unknown>;
export type Basic = string | number | boolean;
export type Constructor<T> = { new (...args: any[]): T };
