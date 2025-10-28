import Card from "@/components/Card";
import Link from "next/link";
import Image from "next/image";

const products = [
  {
    id: 1,
    title: "Air Max Pulse",
    subtitle: "Men's Shoes",
    meta: "6 Colour",
    price: 149.99,
    imageSrc: "/shoes/shoe-1.jpg",
    badge: { label: "New", tone: "orange" as const },
  },
  {
    id: 2,
    title: "Air Zoom Pegasus",
    subtitle: "Men's Shoes",
    meta: "4 Colour",
    price: 129.99,
    imageSrc: "/shoes/shoe-2.webp",
    badge: { label: "Hot", tone: "red" as const },
  },
  {
    id: 3,
    title: "InfinityRN 4",
    subtitle: "Men's Shoes",
    meta: "6 Colour",
    price: 159.99,
    imageSrc: "/shoes/shoe-3.webp",
    badge: { label: "Trending", tone: "green" as const },
  },
  {
    id: 4,
    title: "Metcon 9",
    subtitle: "Men's Shoes",
    meta: "3 Colour",
    price: 139.99,
    imageSrc: "/shoes/shoe-4.webp",
  },
];

const Home = () => {
  return (
    <main>
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-light-200 via-light-100 to-light-300 overflow-hidden">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div className="space-y-6 lg:space-y-8">
              <div className="inline-block">
                <span className="text-sm font-semibold text-red-500 tracking-wide uppercase">
                  Bold & Sporty
                </span>
              </div>
              
              <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black text-dark-900 leading-tight">
                Style That Moves
                <br />
                With You.
              </h1>
              
              <p className="text-lg sm:text-xl text-dark-700 max-w-lg">
                Not just style. Not just comfort. Footwear that effortlessly moves with your every step.
              </p>
              
              <div>
                <Link
                  href="/products"
                  className="inline-block px-8 py-4 bg-dark-900 text-light-100 rounded-full font-semibold text-lg hover:bg-dark-700 transition-colors"
                >
                  Find Your Shoe
                </Link>
              </div>
            </div>

            {/* Right Content - Product Image */}
            <div className="relative">
              <div className="relative aspect-square lg:aspect-auto lg:h-[600px]">
                {/* Background Text Elements */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="relative w-full h-full">
                    <span className="absolute top-0 right-0 text-[120px] sm:text-[180px] lg:text-[220px] font-black text-orange-500 opacity-20 leading-none">
                      AIR
                    </span>
                    <span className="absolute bottom-0 right-0 text-[100px] sm:text-[140px] lg:text-[180px] font-black text-dark-900 leading-none">
                      JORDEN
                    </span>
                    <div className="absolute bottom-20 right-0 w-32 h-32 bg-pink-400 opacity-40 blur-3xl"></div>
                  </div>
                </div>

                {/* Product Image */}
                <div className="relative z-10 flex items-center justify-center h-full">
                  <div className="relative w-full max-w-lg transform hover:scale-105 transition-transform duration-300">
                    <Image
                      src="/shoes/shoe-1.jpg"
                      alt="Nike Air Jordan"
                      width={600}
                      height={600}
                      className="w-full h-auto object-contain drop-shadow-2xl"
                      priority
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Decorative Elements */}
        <div className="absolute top-0 left-0 w-64 h-64 bg-blue-400 opacity-10 blur-3xl"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-purple-400 opacity-10 blur-3xl"></div>
      </section>

      {/* Latest Shoes Section */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
        <div aria-labelledby="latest" className="pb-12">
          <h2 id="latest" className="mb-6 text-heading-3 text-dark-900">
            Latest shoes
          </h2>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {products.map((p) => (
              <Card
                key={p.id}
                title={p.title}
                subtitle={p.subtitle}
                meta={p.meta}
                imageSrc={p.imageSrc}
                price={p.price}
                badge={p.badge}
              />
            ))}
          </div>
        </div>
      </section>
    </main>
  );
};

export default Home;
