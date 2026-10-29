"use client";

import { useMemo, useState } from "react";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
} from "@/components/ui/smoothui/dialog";
import type { CaseStudyUxContent } from "@/lib/case-study-content";

type FolderItem = {
  index: string;
  name: string;
  variant: `variant-${1 | 2 | 3}`;
  imageExpanded?: string;
  uxTitle: string;
  imageAlt?: string;
  uxDescription: string;
};

const SHORT_NAMES = ["Unified Search", "Results & Filters", "Seat & Booking"];

type UxArchitectureResponsiveProps = {
  content: CaseStudyUxContent;
};

/** Mobile-only UX Architecture folders UI (shown below md by parent). */
export default function UxArchitectureResponsive({
  content,
}: UxArchitectureResponsiveProps) {
  const folders = useMemo<FolderItem[]>(
    () =>
      content.items.slice(0, 3).map((item, index) => ({
        index: String(index + 1).padStart(2, "0"),
        name: content.title ? item.title : SHORT_NAMES[index] ?? item.title,
        variant: `variant-${(index + 1) as 1 | 2 | 3}`,
        imageExpanded: item.imageExpanded,
        uxTitle: item.title,
        imageAlt: item.imageAlt,
        uxDescription: item.description,
      })),
    [content.items, content.title],
  );

  const [selectedFolder, setSelectedFolder] = useState<FolderItem | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  const handleFolderClick = (folder: FolderItem) => {
    setSelectedFolder(folder);
    setDialogOpen(true);
  };

  const handleOpenChange = (open: boolean) => {
    setDialogOpen(open);
    if (!open) setSelectedFolder(null);
  };

  return (
    <section className="third-section-responsive" data-no-section-swipe>
      <header className="ux-arch-header">
        <h2 className="ux-arch-title">{content.title ?? "UX Architecture"}</h2>
        <p className="ux-arch-intro">{content.intro}</p>
      </header>

      <div className="folders">
        <div className="row">
          {folders.map((folder) => (
            <button
              type="button"
              className={`folder ${folder.variant}`}
              key={folder.index}
              onClick={() => handleFolderClick(folder)}
            >
              <div className="folder-wrapper">
                <div className="folder-index">
                  <p>{folder.index}</p>
                </div>

                <div className="folder-name">
                  <h1>{folder.name}</h1>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      <AlertDialog
        open={dialogOpen}
        onOpenChange={handleOpenChange}
        title={
          selectedFolder
            ? `${selectedFolder.index} · ${selectedFolder.uxTitle}`
            : ""
        }
        description={selectedFolder?.uxDescription}
        className="folder-alert-dialog"
        footer={
          <>
            <AlertDialogCancel
              className="folder-alert-dialog__cancel"
              onClick={() => handleOpenChange(false)}
            >
              Close
            </AlertDialogCancel>
            <AlertDialogAction
              className="folder-alert-dialog__action"
              onClick={() => handleOpenChange(false)}
            >
              Got it
            </AlertDialogAction>
          </>
        }
      >
        {selectedFolder?.imageExpanded && (
          <div className="max-h-[55dvh] overflow-auto rounded-lg">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={selectedFolder.imageExpanded}
              alt={selectedFolder.imageAlt ?? selectedFolder.uxTitle}
              className="h-auto w-full object-contain"
            />
          </div>
        )}
      </AlertDialog>
    </section>
  );
}
