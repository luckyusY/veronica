import type { CmsMediaItem } from "@/lib/cms-types";

export type EditorPath = Array<string | number>;

export function isPlainObject(value: unknown): value is Record<string, unknown> {
  return !!value && typeof value === "object" && !Array.isArray(value);
}

export function pathKey(path: EditorPath) {
  return path.map(String).join(".");
}

export function pathFromIssue(path: readonly (string | number | symbol)[]) {
  return path
    .filter((segment): segment is string | number => typeof segment !== "symbol")
    .map(String)
    .join(".");
}

export function humanizeKey(key: string) {
  return key
    .replace(/([a-z0-9])([A-Z])/g, "$1 $2")
    .replace(/[_-]+/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .replace(/^\w/, (char) => char.toUpperCase());
}

export function getValueAtPath(value: unknown, path: EditorPath): unknown {
  return path.reduce<unknown>((current, segment) => {
    if (typeof segment === "number") {
      return Array.isArray(current) ? current[segment] : undefined;
    }

    return isPlainObject(current) ? current[segment] : undefined;
  }, value);
}

export function setValueAtPath(value: unknown, path: EditorPath, nextValue: unknown): unknown {
  if (path.length === 0) {
    return nextValue;
  }

  const [head, ...tail] = path;

  if (typeof head === "number") {
    const source = Array.isArray(value) ? [...value] : [];
    source[head] = setValueAtPath(source[head], tail, nextValue);
    return source;
  }

  const source = isPlainObject(value) ? { ...value } : {};
  source[head] = setValueAtPath(source[head], tail, nextValue);
  return source;
}

export function appendArrayItemAtPath(value: unknown, path: EditorPath, item: unknown) {
  const current = getValueAtPath(value, path);
  const nextItems = Array.isArray(current) ? [...current, item] : [item];
  return setValueAtPath(value, path, nextItems);
}

export function removeArrayItemAtPath(value: unknown, path: EditorPath, index: number) {
  const current = getValueAtPath(value, path);

  if (!Array.isArray(current)) {
    return value;
  }

  const nextItems = current.filter((_, itemIndex) => itemIndex !== index);
  return setValueAtPath(value, path, nextItems);
}

export function moveArrayItemAtPath(
  value: unknown,
  path: EditorPath,
  fromIndex: number,
  toIndex: number,
) {
  const current = getValueAtPath(value, path);

  if (!Array.isArray(current) || toIndex < 0 || toIndex >= current.length) {
    return value;
  }

  const nextItems = [...current];
  const [movedItem] = nextItems.splice(fromIndex, 1);
  nextItems.splice(toIndex, 0, movedItem);
  return setValueAtPath(value, path, nextItems);
}

export function createEmptyValueFromSample(sample: unknown): unknown {
  if (typeof sample === "string") {
    return "";
  }

  if (typeof sample === "number") {
    return 0;
  }

  if (typeof sample === "boolean") {
    return false;
  }

  if (Array.isArray(sample)) {
    return [];
  }

  if (isPlainObject(sample)) {
    return Object.fromEntries(
      Object.entries(sample).map(([key, value]) => [key, createEmptyValueFromSample(value)]),
    );
  }

  return "";
}

export function isMediaItemValue(value: unknown): value is CmsMediaItem {
  return (
    isPlainObject(value) &&
    typeof value.url === "string" &&
    typeof value.alt === "string"
  );
}

export function looksLikeUrlField(key: string) {
  return /(^href$|^url$|link$|url$)/i.test(key);
}

export function looksLikeTextareaField(key: string, value: string) {
  return (
    value.length > 80 ||
    /(description|copy|detail|note|quote|paragraph|bio|summary|text)$/i.test(key)
  );
}

export function isTagListKey(key: string) {
  return /(tags|chips|highlightWords|signals)$/i.test(key);
}

export function isTextareaArrayKey(key: string) {
  return /(paragraphs|items)$/i.test(key);
}

export function getArrayTemplate(
  currentContent: unknown,
  defaultContent: unknown,
  path: EditorPath,
) {
  const currentValue = getValueAtPath(currentContent, path);

  if (Array.isArray(currentValue) && currentValue.length > 0) {
    return createEmptyValueFromSample(currentValue[0]);
  }

  const defaultValue = getValueAtPath(defaultContent, path);

  if (Array.isArray(defaultValue) && defaultValue.length > 0) {
    return createEmptyValueFromSample(defaultValue[0]);
  }

  return "";
}

export function getItemLabel(value: unknown, index: number) {
  if (isPlainObject(value)) {
    const preferred =
      (typeof value.title === "string" && value.title) ||
      (typeof value.name === "string" && value.name) ||
      (typeof value.label === "string" && value.label) ||
      (typeof value.eyebrow === "string" && value.eyebrow) ||
      (typeof value.id === "string" && value.id) ||
      (typeof value.era === "string" && value.era);

    if (preferred) {
      return preferred;
    }
  }

  if (typeof value === "string" && value.trim()) {
    return value.trim();
  }

  return `Item ${index + 1}`;
}
