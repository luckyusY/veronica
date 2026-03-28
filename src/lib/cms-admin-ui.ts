import { type ZodIssue } from "zod";
import { type CmsPageStatus } from "@/lib/cms-types";
import { isPlainObject, pathFromIssue } from "@/lib/cms-editor-utils";

export type ValidationErrorMap = Record<string, string[]>;

export type ValidationIssueItem = {
  path: string;
  message: string;
};

export function formatUpdatedAt(value: string | null) {
  if (!value) {
    return "Not yet";
  }

  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date(value));
}

export function formatRelativeFromNow(value: string | null) {
  if (!value) {
    return "Not yet";
  }

  const target = new Date(value).getTime();
  const now = Date.now();
  const diffMs = target - now;
  const diffMinutes = Math.round(diffMs / 60000);
  const formatter = new Intl.RelativeTimeFormat("en", { numeric: "auto" });

  if (Math.abs(diffMinutes) < 60) {
    return formatter.format(diffMinutes, "minute");
  }

  const diffHours = Math.round(diffMinutes / 60);

  if (Math.abs(diffHours) < 24) {
    return formatter.format(diffHours, "hour");
  }

  const diffDays = Math.round(diffHours / 24);
  return formatter.format(diffDays, "day");
}

export function summarizePageContent(value: unknown) {
  const content = isPlainObject(value) ? value : {};
  const sectionKeys = Object.keys(content);
  const hero = isPlainObject(content.hero) ? content.hero : null;
  const heroSlides = hero && Array.isArray(hero.slides) ? hero.slides.length : 0;

  let mediaRefs = 0;

  function visit(entry: unknown) {
    if (Array.isArray(entry)) {
      entry.forEach(visit);
      return;
    }

    if (!isPlainObject(entry)) {
      return;
    }

    if (typeof entry.publicId === "string" || typeof entry.url === "string") {
      mediaRefs += 1;
    }

    Object.values(entry).forEach(visit);
  }

  visit(content);

  return { sectionKeys, heroSlides, mediaRefs };
}

export function getStatusConfig(status: CmsPageStatus) {
  if (status === "draft-pending") {
    return {
      label: "Draft pending",
      className: "status-pill--draft",
      description: "There are unpublished changes waiting for review.",
    };
  }

  if (status === "published") {
    return {
      label: "Published",
      className: "status-pill--ok",
      description: "The live site is reading the published version.",
    };
  }

  return {
    label: "Never published",
    className: "status-pill--neutral",
    description: "This page has content, but it has not been explicitly published yet.",
  };
}

export function countChangedFields(left: unknown, right: unknown): number {
  if (JSON.stringify(left ?? null) === JSON.stringify(right ?? null)) {
    return 0;
  }

  if (Array.isArray(left) && Array.isArray(right)) {
    const maxLength = Math.max(left.length, right.length);
    let total = left.length === right.length ? 0 : 1;

    for (let index = 0; index < maxLength; index += 1) {
      total += countChangedFields(left[index], right[index]);
    }

    return total;
  }

  if (isPlainObject(left) && isPlainObject(right)) {
    const keys = new Set([...Object.keys(left), ...Object.keys(right)]);
    let total = 0;

    for (const key of keys) {
      total += countChangedFields(left[key], right[key]);
    }

    return total;
  }

  return 1;
}

function normalizeIssuePath(issue: ZodIssue) {
  const fullPath = pathFromIssue(issue.path);
  return fullPath.startsWith("content.") ? fullPath.slice("content.".length) : fullPath;
}

export function buildValidationState(issues: readonly ZodIssue[]) {
  const errorMap: ValidationErrorMap = {};
  const normalizedIssues: ValidationIssueItem[] = issues.map((issue) => {
    const path = normalizeIssuePath(issue);

    if (!errorMap[path]) {
      errorMap[path] = [];
    }

    errorMap[path].push(issue.message);

    return {
      path: path || "content",
      message: issue.message,
    };
  });

  return { errorMap, issues: normalizedIssues };
}

export function getSectionErrorCount(errorMap: ValidationErrorMap, sectionKey: string) {
  return Object.entries(errorMap).reduce((count, [path, messages]) => {
    if (path === sectionKey || path.startsWith(`${sectionKey}.`)) {
      return count + messages.length;
    }

    return count;
  }, 0);
}
