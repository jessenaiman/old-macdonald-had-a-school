import Image from "next/image";
import { BRAND_IMAGE_ASSETS } from "../../data/brand/image-registry";

type ResponsiveBrandEmblemProps = {
  className?: string;
  alt?: string;
  variant?: "responsive" | "card" | "detail";
};

export function ResponsiveBrandEmblem({
  className,
  alt = "",
  variant = "responsive",
}: ResponsiveBrandEmblemProps) {
  if (variant !== "responsive") {
    return (
      <Image
        alt={alt}
        className={className}
        height={variant === "card" ? 128 : 512}
        sizes={variant === "card" ? "128px" : "(max-width: 639px) 100vw, 512px"}
        src={variant === "card"
          ? BRAND_IMAGE_ASSETS.emblem.card
          : BRAND_IMAGE_ASSETS.emblem.detail}
        width={variant === "card" ? 128 : 512}
      />
    );
  }

  return (
    <picture className={className}>
      <source media="(min-width: 640px)" srcSet={BRAND_IMAGE_ASSETS.emblem.navigation} />
      <source srcSet={BRAND_IMAGE_ASSETS.emblem.flat} />
      <img
        src={BRAND_IMAGE_ASSETS.emblem.flat}
        alt={alt}
        className="size-8 object-contain sm:size-11"
      />
    </picture>
  );
}
