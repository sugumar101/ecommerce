import Image from "next/image";

type Badge = { label: string; tone?: string };

interface CardProps {
  imageSrc: string;
  badge?: Badge;
  title: string;
  subtitle?: string;
  meta?: string;
  price: number | string;
  href?: string;
}

export default function Card({
  imageSrc,
  badge,
  title,
  subtitle,
  meta,
  price,
  href = "#",
}: CardProps) {
  console.log('Card badge prop:', badge);
  const toneTextClass = badge?.tone
    ? {
        orange: "text-orange-600",
        red: "text-red-600",
        green: "text-green-600",
      }[badge.tone] ?? "text-gray-700"
    : "text-gray-700";

  return (
    <a
      href={href}
      className="block group bg-gray-100 rounded-lg overflow-hidden hover:shadow-lg transition-shadow duration-300"
    >
      <div className="relative w-full aspect-square bg-gray-100">
        {badge?.label && (
          <div className="absolute top-4 left-4 z-10">
            <span
              className={`inline-block bg-white px-4 py-2 rounded-md text-sm font-medium ${toneTextClass}`}
            >
              {badge.label}
            </span>
          </div>
        )}
        <Image
          src={imageSrc}
          alt={title}
          fill
          className="object-contain p-8"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
      </div>
      <div className="bg-black text-white p-4">
        <h3 className="text-lg font-medium mb-1 group-hover:text-gray-300 transition-colors">
          {title}
        </h3>
        {subtitle && <p className="text-gray-400 text-sm mb-1">{subtitle}</p>}
        {meta && <p className="text-gray-400 text-sm mb-2">{meta}</p>}
        <p className="text-xl font-semibold mt-2">{typeof price === "number" ? `$${price.toFixed(2)}` : price}</p>
      </div>
    </a>
  );
}
