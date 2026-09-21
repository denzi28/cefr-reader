import type { Scene as SceneData } from "../types/book";
import { Scene } from "../illustrations/Scene";
import { resolveAssetUrl } from "../api/client";

// Renders a page/cover's artwork: a real (e.g. AI-generated) image when one
// has been supplied, falling back to the built-in vector scene otherwise.
// This is the single place that decides which illustration style to show,
// so books can mix hand-picked images with vector fallbacks page by page.
export function PageArt({
  imageUrl,
  scene,
  className,
}: {
  imageUrl?: string;
  scene: SceneData;
  className?: string;
}) {
  if (imageUrl) {
    return (
      <img
        src={resolveAssetUrl(imageUrl)}
        alt="Story illustration"
        className={`${className ?? ""} object-cover`}
      />
    );
  }
  return <Scene scene={scene} className={className} />;
}
