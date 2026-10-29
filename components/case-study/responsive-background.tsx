import {
  RESPONSIVE_IMAGE_SOURCES,
  type ResponsiveImages,
} from "@/lib/responsive-images";

type ResponsiveBackgroundProps = {
  images?: ResponsiveImages;
  desktopImages?: ResponsiveImages;
  objectFit?: "cover" | "contain" | "fill" | "none";
  objectPosition?: string;
  /** Soften cover zoom (1 = normal). Values < 1 reveal more artwork. */
  backgroundScale?: number;
  solidBackground?: string;
  priority?: boolean;
};

/**
 * Art-directed <picture> pinned to the section background.
 * Uses cover so the asset fills the viewport edge-to-edge.
 */
export function ResponsiveBackground({
  images,
  desktopImages,
  objectFit = "cover",
  objectPosition = "center",
  backgroundScale = 1,
  solidBackground = "#FCF6EF",
  priority = false,
}: ResponsiveBackgroundProps) {
  if (desktopImages) {
    const sharedProps = { objectFit, objectPosition, backgroundScale, solidBackground, priority };
    return (
      <>
        <div className="absolute inset-0 md:hidden">
          <ResponsiveBackground {...sharedProps} images={images} />
        </div>
        <div className="absolute inset-0 hidden md:block">
          <ResponsiveBackground {...sharedProps} images={desktopImages} />
        </div>
      </>
    );
  }

  if (!images) {
    return (
      <div
        className="absolute inset-0"
        style={{ backgroundColor: solidBackground }}
        aria-hidden
      />
    );
  }

  const scale = Math.min(1, Math.max(0.5, backgroundScale));
  const origin =
    objectPosition.includes("right") && objectPosition.includes("top")
      ? "right top"
      : objectPosition.includes("right")
        ? "right center"
        : objectPosition.includes("left")
          ? "left center"
          : "center center";

  return (
    <div
      className="absolute inset-0 overflow-hidden"
      style={{ backgroundColor: solidBackground }}
      aria-hidden
    >
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
          className="absolute inset-0 h-full w-full max-w-none"
          style={{
            objectFit,
            objectPosition,
            transform: scale < 1 ? `scale(${scale})` : undefined,
            transformOrigin: scale < 1 ? origin : undefined,
          }}
          loading={priority ? "eager" : "lazy"}
          decoding="async"
          fetchPriority={priority ? "high" : "auto"}
        />
      </picture>
    </div>
  );
}
