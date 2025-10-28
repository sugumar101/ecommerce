import Image from "next/image";

interface CardProps {
  image: string;
  badge?: string;
  title: string;
  category: string;
  colorCount?: string;
  price: string;
  href?: string;
}

export default function Card({
  image,
  badge,
  title,
  category,
  colorCount,
  price,
  href = "#",
}: CardProps) {
  return (
    <a
      href={href}
      className="block group bg-gray-100 rounded-lg overflow-hidden hover:shadow-lg transition-shadow duration-300"
    >
      <div className="relative w-full aspect-square bg-gray-100">
        {badge && (
          <div className="absolute top-4 left-4 z-10">
            <span className="inline-block bg-white px-4 py-2 rounded-md text-sm font-medium text-green-600">
              {badge}
            </span>
          </div>
        )}
        <Image
          src={image}
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
        <p className="text-gray-400 text-sm mb-1">{category}</p>
        {colorCount && (
          <p className="text-gray-400 text-sm mb-2">{colorCount}</p>
        )}
        <p className="text-xl font-semibold mt-2">{price}</p>
      </div>
    </a>
  );
}
