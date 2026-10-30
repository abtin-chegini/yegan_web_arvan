import {
  RESPONSIVE_IMAGE_SOURCES,
  type Section,
} from "@/lib/sections";

type SectionBackgroundProps = {
  section: Section;
  priority?: boolean;
};

/**
 * Art-directed <picture> when CDN images exist; otherwise a solid fill.
 */
export function SectionBackground({
  section,
  priority = false,
}: SectionBackgroundProps) {
  const { images } = section;
  const fitClass =
    section.objectFit === "none" ? "object-none" :
    section.objectFit === "fill" ? "object-fill" :
    section.objectFit === "cover" ? "object-cover" : "object-contain";

  if (!images) {
    return (
      <div
        className="absolute inset-0"
        style={{ backgroundColor: section.solidBackground ?? "#FCF6EF" }}
        aria-hidden
      />
    );
  }

  return (
    <picture className="absolute inset-0 block h-full w-full">
      {RESPONSIVE_IMAGE_SOURCES.map(({ key, minWidth }) => (
        <source
          key={key}
          media={`(min-width: ${minWidth}px)`}
          srcSet={images[key]}
        />
      ))}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={images.xs}
        alt=""
        className={`absolute inset-0 h-full w-full ${fitClass}${section.id === "home" && section.objectFit === "none" ? " min-[768px]:object-fill" : ""}`}
        style={{ objectPosition: section.objectPosition }}
        loading={priority ? "eager" : "lazy"}
        decoding="async"
        fetchPriority={priority ? "high" : "auto"}
      />
    </picture>
  );
}
