"use client";

import { useState } from "react";
import { FALLBACK_PRODUCT_IMAGE } from "@/lib/store-utils";

type SafeImageProps = React.ImgHTMLAttributes<HTMLImageElement> & {
  src: unknown;
  fallback?: string;
};

export function SafeImage({ src, fallback = FALLBACK_PRODUCT_IMAGE, alt, ...props }: SafeImageProps) {
  const initial = typeof src === "string" && src.trim() ? src : fallback;
  const [current, setCurrent] = useState<string>(initial);

  return (
    <img
      {...props}
      alt={alt ?? ""}
      src={current}
      onError={() => {
        if (current !== fallback) setCurrent(fallback);
      }}
    />
  );
}

export default SafeImage;
