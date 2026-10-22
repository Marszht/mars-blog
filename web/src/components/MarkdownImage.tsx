import Image from "next/image";

const SIZE = 1200;

function isOptimized(src: string) {
  return src.startsWith("/") && /\.(avif|webp|png|jpe?g)$/i.test(src);
}

export function MarkdownImage({
  src,
  alt,
}: {
  src?: string;
  alt?: string;
}) {
  if (!src) return null;
  const label = alt || "文章配图";

  if (!isOptimized(src)) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img src={src} alt={label} loading="lazy" className="h-auto w-full" />
    );
  }

  return (
    <Image
      src={src}
      alt={label}
      width={SIZE}
      height={Math.round(SIZE * 0.62)}
      sizes="(min-width: 768px) 768px, 100vw"
      className="h-auto w-full"
    />
  );
}
