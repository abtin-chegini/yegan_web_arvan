"use client";

import { useMemo, useState } from "react";
import { useLocale } from "next-intl";

import Dialog from "@/components/ui/smoothui/dialog";
import ProductFeatures from "@/components/animata/hero/product-features";
import type { CaseStudyUxContent } from "@/lib/case-study-content";

type FolderItem = {
  id: string;
  image: string | null;
  index: string;
  name: string;
  tabTitle?: string;
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
  const locale = useLocale();
  const folders = useMemo<FolderItem[]>(
    () =>
      content.items.slice(0, 3).map((item, index) => ({
        id: item.id,
        image: item.imageDesktop ?? item.image,
        index: String(index + 1).padStart(2, "0"),
        tabTitle: content.mobileTabTitles?.[item.id],
        name: content.title ? item.title : SHORT_NAMES[index] ?? item.title,
        variant: `variant-${(index + 1) as 1 | 2 | 3}`,
        imageExpanded: item.imageExpanded,
        uxTitle: item.title,
        imageAlt: item.imageAlt,
        uxDescription: item.description,
      })),
    [content.items, content.title, content.mobileTabTitles],
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
        <p className="ux-arch-intro">{content.mobileIntro ?? content.intro}</p>
      </header>

      {content.mobileLayout === "product-cards" ? (
        <ProductFeatures
          features={folders.map((folder) => ({
            id: folder.id,
            title: folder.tabTitle ?? folder.name,
            imageUrl: folder.image,
            imageAlt: folder.imageAlt,
          }))}
          onFeatureClick={(id) => {
            const folder = folders.find((item) => item.id === id);
            if (folder) handleFolderClick(folder);
          }}
        />
      ) : <div className="folders">
        <div className="row">
          {folders.map((folder) => (
            <button
              type="button"
              className={`folder ${folder.variant}`}
              key={folder.index}
              aria-label={folder.uxTitle}
              onClick={() => handleFolderClick(folder)}
            >
              <div className="folder-wrapper">
                <div className={`folder-index${folder.tabTitle ? " folder-index--titled" : ""}`}>
                  <p>{folder.tabTitle ? <>
                    <span className="folder-tab-number">{new Intl.NumberFormat(locale, {useGrouping: false}).format(Number(folder.index))}</span>
                    <span>{folder.tabTitle}</span>
                  </> : folder.index}</p>
                </div>

                <div className="folder-name">
                  {!content.hideMobileFolderTitles && !folder.tabTitle && <h1>{folder.name}</h1>}
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>}

      <Dialog
        open={dialogOpen}
        onOpenChange={handleOpenChange}
        title={selectedFolder?.uxTitle}
        className="max-h-[80dvh] overflow-y-auto text-[#1d3557] sm:max-w-2xl"
      >
        {selectedFolder && (
          <p className="min-w-0 pt-2 text-start font-sans text-sm leading-7" dir={locale === "fa" ? "rtl" : "ltr"}>
            {selectedFolder.uxDescription}
          </p>
        )}
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
      </Dialog>
    </section>
  );
}
