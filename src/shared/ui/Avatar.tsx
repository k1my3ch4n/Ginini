import { mergeClasses } from "@shared/lib/utils";

interface AvatarProps {
  src: string;
  alt: string;
  size?: number;
  className?: string;
}

export function Avatar({ src, alt, size = 80, className }: AvatarProps) {
  return (
    <div
      className={mergeClasses(
        "rounded-full overflow-hidden border-2 border-[#E6A57E] shadow-md",
        className,
      )}
      style={{ width: size, height: size }}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={src} alt={alt} className="w-full h-full object-cover" />
    </div>
  );
}
