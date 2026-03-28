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
        <div>
          <p className="section-label">{label}</p>
          <p className="admin-repeatable-count">
            {items.length} item{items.length === 1 ? "" : "s"}
          </p>
        </div>
        <button className="admin-button admin-button--ghost" onClick={onAdd} type="button">
          <Plus size={15} />
          <span>{addLabel ?? `Add ${label}`}</span>
        </button>
      </div>
      {error ? <p className="admin-field-error">{error}</p> : null}

      <div className="admin-repeatable-stack">
        {items.map((item, index) => (
          <article className="admin-repeatable-card" key={`${label}-${index}`}>
            <div className="admin-repeatable-card-topline">
              <div className="admin-repeatable-card-label">
                <GripVertical size={15} />
                <span>{getItemLabel ? getItemLabel(index) : `Item ${index + 1}`}</span>
              </div>
              <div className="admin-button-row">
                <button
                  className="admin-icon-button"
                  disabled={index === 0}
                  onClick={() => onMove(index, index - 1)}
                  type="button"
                >
                  <ArrowUp size={15} />
                </button>
                <button
                  className="admin-icon-button"
                  disabled={index === items.length - 1}
                  onClick={() => onMove(index, index + 1)}
                  type="button"
                >
                  <ArrowDown size={15} />
                </button>
                <button
                  className="admin-icon-button admin-icon-button--danger"
                  onClick={() => onRemove(index)}
                  type="button"
                >
                  <Trash2 size={15} />
                </button>
              </div>
            </div>
            <div className="admin-repeatable-card-body">{renderItem(index)}</div>
          </article>
        ))}

        {items.length === 0 ? (
          <div className="admin-empty">No items yet. Add the first one to continue.</div>
        ) : null}
      </div>
    </div>
  );
}
