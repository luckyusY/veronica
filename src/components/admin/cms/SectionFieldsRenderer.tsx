"use client";

import type { CmsMediaAsset, CmsPageSlug } from "@/lib/cms-types";
import {
  appendArrayItemAtPath,
  EditorPath,
  getArrayTemplate,
  getItemLabel,
  humanizeKey,
  isMediaItemValue,
  isPlainObject,
  isTagListKey,
  isTextareaArrayKey,
  looksLikeTextareaField,
  looksLikeUrlField,
  moveArrayItemAtPath,
  pathKey,
  removeArrayItemAtPath,
  setValueAtPath,
} from "@/lib/cms-editor-utils";
import { RepeatableField } from "@/components/admin/cms/fields/RepeatableField";
import { ImagePickerField } from "@/components/admin/cms/fields/ImagePickerField";
import { TagListField } from "@/components/admin/cms/fields/TagListField";
import { TextField } from "@/components/admin/cms/fields/TextField";
import { TextareaField } from "@/components/admin/cms/fields/TextareaField";
import { UrlField } from "@/components/admin/cms/fields/UrlField";

type ValidationErrorMap = Record<string, string[]>;

type SectionFieldsRendererProps = {
  slug: CmsPageSlug;
  value: unknown;
  path: EditorPath;
  contentRoot: unknown;
  defaultContent: unknown;
  mediaAssets: CmsMediaAsset[];
  errorMap: ValidationErrorMap;
  onContentChange: (value: unknown) => void;
};

function getFieldError(errorMap: ValidationErrorMap, path: EditorPath) {
  return errorMap[pathKey(path)]?.[0];
}

function getLastPathKey(path: EditorPath) {
  const segment = path[path.length - 1];
  return typeof segment === "string" ? segment : "item";
}

function updateAtPath(
  contentRoot: unknown,
  path: EditorPath,
  nextValue: unknown,
  onContentChange: (value: unknown) => void,
) {
  onContentChange(setValueAtPath(contentRoot, path, nextValue));
}

function addArrayItem(
  contentRoot: unknown,
  defaultContent: unknown,
  path: EditorPath,
  onContentChange: (value: unknown) => void,
) {
  const template = getArrayTemplate(contentRoot, defaultContent, path);
  onContentChange(appendArrayItemAtPath(contentRoot, path, template));
}

function removeArrayItem(
  contentRoot: unknown,
  path: EditorPath,
  index: number,
  onContentChange: (value: unknown) => void,
) {
  onContentChange(removeArrayItemAtPath(contentRoot, path, index));
}

function moveArrayItem(
  contentRoot: unknown,
  path: EditorPath,
  fromIndex: number,
  toIndex: number,
  onContentChange: (value: unknown) => void,
) {
  onContentChange(moveArrayItemAtPath(contentRoot, path, fromIndex, toIndex));
}

export function SectionFieldsRenderer({
  slug,
  value,
  path,
  contentRoot,
  defaultContent,
  mediaAssets,
  errorMap,
  onContentChange,
}: SectionFieldsRendererProps) {
  const key = getLastPathKey(path);
  const label = humanizeKey(key);
  const error = getFieldError(errorMap, path);

  if (typeof value === "string") {
    if (looksLikeUrlField(key)) {
      return (
        <UrlField
          error={error}
          label={label}
          onChange={(nextValue) =>
            updateAtPath(contentRoot, path, nextValue, onContentChange)
          }
          value={value}
        />
      );
    }

    if (looksLikeTextareaField(key, value)) {
      return (
        <TextareaField
          error={error}
          label={label}
          onChange={(nextValue) =>
            updateAtPath(contentRoot, path, nextValue, onContentChange)
          }
          value={value}
        />
      );
    }

    return (
      <TextField
        error={error}
        label={label}
        onChange={(nextValue) => updateAtPath(contentRoot, path, nextValue, onContentChange)}
        value={value}
      />
    );
  }

  if (Array.isArray(value)) {
    if (value.every((item) => typeof item === "string")) {
      if (isTagListKey(key)) {
        return (
          <TagListField
            error={error}
            label={label}
            onChange={(nextValue) =>
              updateAtPath(contentRoot, path, nextValue, onContentChange)
            }
            values={value as string[]}
          />
        );
      }

      const multiline = isTextareaArrayKey(key) || value.some((item) => item.length > 80);

      return (
        <RepeatableField
          addLabel={`Add ${label}`}
          error={error}
          getItemLabel={(index) => `Item ${index + 1}`}
          items={value}
          label={label}
          onAdd={() => addArrayItem(contentRoot, defaultContent, path, onContentChange)}
          onMove={(fromIndex, toIndex) =>
            moveArrayItem(contentRoot, path, fromIndex, toIndex, onContentChange)
          }
          onRemove={(index) => removeArrayItem(contentRoot, path, index, onContentChange)}
          renderItem={(index) =>
            multiline ? (
              <TextareaField
                label={`Item ${index + 1}`}
                onChange={(nextValue) =>
                  updateAtPath(contentRoot, [...path, index], nextValue, onContentChange)
                }
                rows={3}
                value={(value[index] as string) ?? ""}
              />
            ) : (
              <TextField
                label={`Item ${index + 1}`}
                onChange={(nextValue) =>
                  updateAtPath(contentRoot, [...path, index], nextValue, onContentChange)
                }
                value={(value[index] as string) ?? ""}
              />
            )
          }
        />
      );
    }

    return (
      <RepeatableField
        addLabel={`Add ${label}`}
        error={error}
        getItemLabel={(index) => getItemLabel(value[index], index)}
        items={value}
        label={label}
        onAdd={() => addArrayItem(contentRoot, defaultContent, path, onContentChange)}
        onMove={(fromIndex, toIndex) =>
          moveArrayItem(contentRoot, path, fromIndex, toIndex, onContentChange)
        }
        onRemove={(index) => removeArrayItem(contentRoot, path, index, onContentChange)}
        renderItem={(index) => (
          <SectionFieldsRenderer
            contentRoot={contentRoot}
            defaultContent={defaultContent}
            errorMap={errorMap}
            mediaAssets={mediaAssets}
            onContentChange={onContentChange}
            path={[...path, index]}
            slug={slug}
            value={value[index]}
          />
        )}
      />
    );
  }

  if (isMediaItemValue(value)) {
    return (
      <ImagePickerField
        assets={mediaAssets}
        error={error}
        label={label}
        onChange={(nextValue) => updateAtPath(contentRoot, path, nextValue, onContentChange)}
        value={value}
      />
    );
  }

  if (isPlainObject(value)) {
    return (
      <div className="admin-structured-grid">
        {Object.entries(value).map(([childKey, childValue]) => {
          const childPath = [...path, childKey];
          const shouldWrapGroup =
            isPlainObject(childValue) && !isMediaItemValue(childValue);

          if (shouldWrapGroup) {
            return (
              <div className="admin-object-panel" key={pathKey(childPath)}>
                <p className="section-label">{humanizeKey(childKey)}</p>
                <div className="admin-object-panel-body">
                  <SectionFieldsRenderer
                    contentRoot={contentRoot}
                    defaultContent={defaultContent}
                    errorMap={errorMap}
                    mediaAssets={mediaAssets}
                    onContentChange={onContentChange}
                    path={childPath}
                    slug={slug}
                    value={childValue}
                  />
                </div>
              </div>
            );
          }

          return (
            <SectionFieldsRenderer
              contentRoot={contentRoot}
              defaultContent={defaultContent}
              errorMap={errorMap}
              key={pathKey(childPath)}
              mediaAssets={mediaAssets}
              onContentChange={onContentChange}
              path={childPath}
              slug={slug}
              value={childValue}
            />
          );
        })}
      </div>
    );
  }

  return null;
}
