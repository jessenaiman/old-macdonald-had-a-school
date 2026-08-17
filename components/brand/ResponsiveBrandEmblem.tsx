import Image, { getImageProps } from "next/image";
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
  const common = { alt, sizes: "(max-width: 639px) 32px, 44px" };
  const { props: { srcSet: navigation } } = getImageProps({
    ...common,
    src: BRAND_IMAGE_ASSETS.emblem.navigation,
    width: 44,
    height: 44,
  });
  const { props: { srcSet: compact, ...image } } = getImageProps({
    ...common,
    src: BRAND_IMAGE_ASSETS.emblem.flat,
    width: 32,
    height: 32,
  });

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
      <source media="(min-width: 640px)" srcSet={navigation} />
      <source srcSet={compact} />
      <img {...image} alt={alt} className="size-8 object-contain sm:size-11" />
    </picture>
  );
}
