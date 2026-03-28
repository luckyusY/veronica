"use client";

import { X } from "lucide-react";
import type { CmsMediaUsageRecord } from "@/lib/cms-types";

type UsagePopoverProps = {
  item: CmsMediaUsageRecord;
  onClose: () => void;
};

export function UsagePopover({ item, onClose }: UsagePopoverProps) {
  return (
    <div className="admin-modal-overlay" role="presentation">
      <div className="admin-modal">
        <div className="admin-panel-header">
          <div>
            <p className="section-label">Media usage</p>
            <h3 className="display-title mt-3 text-3xl text-white">
              Used in {item.pageCount} page{item.pageCount === 1 ? "" : "s"}
            </h3>
            <p className="mt-3 text-sm leading-7 text-white/64">{item.publicId}</p>
          </div>
          <button className="admin-button admin-button--ghost" onClick={onClose} type="button">
            <X size={15} />
            <span>Close</span>
          </button>
        </div>

        <div className="admin-validation-list mt-5">
          {item.usedIn.map((usage, index) => (
            <article className="admin-validation-item" key={`${usage.field}-${index}`}>
              <strong>
                {usage.route} / {usage.section}
              </strong>
              <span>
                {usage.field} {usage.isDraft ? "(draft only)" : "(published)"}
              </span>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
}
