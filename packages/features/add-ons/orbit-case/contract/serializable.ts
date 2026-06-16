/** Maps `Date` fields to ISO strings for wire-safe contracts. */
type SerializableValue<T> = T extends Date
  ? string
  : T extends Date | null
    ? string | null
    : T extends readonly (infer U)[]
      ? SerializableValue<U>[]
      : T extends object
        ? Serializable<T>
        : T;

/** Recursively converts server record shapes to JSON-safe DTO shapes. */
export type Serializable<T> = {
  [K in keyof T]: SerializableValue<T[K]>;
};
