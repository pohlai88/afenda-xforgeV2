import NextImage from "next/image";
import type { ComponentProps } from "react";

type CmsImageProperties = ComponentProps<typeof NextImage>;

export const Image = ({
  alt,
  className,
  height,
  priority,
  src,
  width,
}: CmsImageProperties) => (
  <NextImage
    alt={alt ?? ""}
    className={className}
    height={height}
    priority={priority}
    src={src}
    width={width}
  />
);
