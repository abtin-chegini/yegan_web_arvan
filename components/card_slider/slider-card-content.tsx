import {useTranslations} from "next-intl";
import {Link} from "@/i18n/navigation";
import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

export type SliderCardContentProps = {
  title: ReactNode;
  kicker?: ReactNode;
  description?: ReactNode;
  image: string;
  alt: string;
  href?: string;
  className?: string;
  copyClassName?: string;
  mediaClassName?: string;
  imageClassName?: string;
};

export function SliderCardContent({
  title,
  kicker,
  description,
  image,
  alt,
  href,
  className,
  copyClassName,
  mediaClassName,
  imageClassName,
}: SliderCardContentProps) {
  const t = useTranslations("SelectedWork");
  return (
    <div className={cn("slider-card-content", className)}>
      <div className={cn("col slider-card-copy", copyClassName)}>
        <h2>{title}</h2>
        {kicker ? <p className="slider-card-kicker">{kicker}</p> : null}
        {description ? (
          <p className="slider-card-description">{description}</p>
        ) : null}
        {href ? (
          <Link
            href={href}
            className="slider-card-cta"
            data-no-section-swipe
          >
            {t("viewCaseStudy")}
          </Link>
        ) : null}
      </div>

      <div className={cn("col slider-card-media", mediaClassName)}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img className={imageClassName} src={image} alt={alt} />
      </div>
    </div>
  );
}
