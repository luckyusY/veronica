"use client";

import type { ReactNode } from "react";
import { ArrowDown, ArrowUp, GripVertical, Plus, Trash2 } from "lucide-react";

type RepeatableFieldProps = {
  label: string;
  items: unknown[];
  onAdd: () => void;
  onRemove: (index: number) => void;
  onMove: (fromIndex: number, toIndex: number) => void;
  renderItem: (index: number) => ReactNode;
  getItemLabel?: (index: number) => string;
  addLabel?: string;
  error?: string;
};

export function RepeatableField({
  label,
  items,
  onAdd,
  onRemove,
  onMove,
  renderItem,
  getItemLabel,
  addLabel,
  error,
}: RepeatableFieldProps) {
  return (
    <div className="admin-repeatable-field">
      <div className="admin-repeatable-header">
        <div className="admin-repeatable-header-left">
          <p className="admin-repeatable-label">{label}</p>
          <p className="admin-repeatable-count">
            {items.length} item{items.length === 1 ? "" : "s"}
          </p>
        </div>
        <button className="admin-button admin-button--ghost" onClick={onAdd} type="button">
          <Plus size={14} />
          <span>{addLabel ?? `Add`}</span>
        </button>
      </div>
      {error ? <p className="admin-field-error">{error}</p> : null}

      <div className="admin-repeatable-stack">
        {items.map((item, index) => (
          <article className="admin-repeatable-card" key={`${label}-${index}`}>
            <div className="admin-repeatable-card-topline">
              <div className="admin-repeatable-card-label">
                <GripVertical size={13} className="admin-repeatable-grip" />
                <span>{getItemLabel ? getItemLabel(index) : `Item ${index + 1}`}</span>
              </div>
              <div className="admin-repeatable-card-actions">
                <button
                  className="admin-icon-button"
                  disabled={index === 0}
                  onClick={() => onMove(index, index - 1)}
                  title="Move up"
                  type="button"
                >
                  <ArrowUp size={13} />
                </button>
                <button
                  className="admin-icon-button"
                  disabled={index === items.length - 1}
                  onClick={() => onMove(index, index + 1)}
                  title="Move down"
                  type="button"
                >
                  <ArrowDown size={13} />
                </button>
                <button
                  className="admin-icon-button admin-icon-button--danger"
                  onClick={() => onRemove(index)}
                  title="Remove"
                  type="button"
                >
                  <Trash2 size={13} />
                </button>
              </div>
            </div>
            <div className="admin-repeatable-card-body">{renderItem(index)}</div>
          </article>
        ))}

        {items.length === 0 ? (
          <div className="admin-empty">No items yet — add the first one above.</div>
        ) : null}
      </div>
    </div>
  );
}
