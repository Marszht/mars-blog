import Image from "next/image";

/**
 * 朋友圈式九宫格图片：
 * - 1 张：4:3 单张大图（最大约 2/3 宽）
 * - 2 / 4 张：两列
 * - 3 张及以上：三列（1、2、4 张有专属布局）
 * SVG 用原生 img（next/image 需额外配置），其余走 next/image 优化。
 */
export function PhotoGrid({
  images,
  altPrefix = "配图",
  sizes = "(min-width: 768px) 240px, 33vw",
}: {
  images: string[];
  altPrefix?: string;
  sizes?: string;
}) {
  const n = images.length;
  if (n === 0) return null;

  if (n === 1) {
    const src = images[0];
    return (
      <div className="mt-3 max-w-sm overflow-hidden rounded-xl border border-stone-200 dark:border-stone-700">
        {src.endsWith(".svg") ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={src} alt={`${altPrefix} 1`} className="aspect-[4/3] w-full object-cover" loading="lazy" />
        ) : (
          <Image
            src={src}
            alt={`${altPrefix} 1`}
            width={640}
            height={480}
            sizes="(min-width: 640px) 384px, 100vw"
            className="aspect-[4/3] w-full object-cover"
          />
        )}
      </div>
    );
  }

  const cols = n === 2 || n === 4 ? "grid-cols-2" : "grid-cols-3";
  return (
    <div className={`mt-3 grid ${cols} gap-1.5`}>
      {images.map((src, i) => (
        <div
          key={`${src}-${i}`}
          className="relative overflow-hidden rounded-lg border border-stone-200 dark:border-stone-700"
        >
          {src.endsWith(".svg") ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={src} alt={`${altPrefix} ${i + 1}`} className="aspect-square w-full object-cover" loading="lazy" />
          ) : (
            <Image
              src={src}
              alt={`${altPrefix} ${i + 1}`}
              width={320}
              height={320}
              sizes={sizes}
              className="aspect-square w-full object-cover"
            />
          )}
        </div>
      ))}
    </div>
  );
}
