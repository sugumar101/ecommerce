import Image from "next/image";
import Link from "next/link";

export default function Footer() {
  const footerSections = [
    {
      title: "Featured",
      links: [
        { name: "Air Force 1", href: "/featured/air-force-1" },
        { name: "Huarache", href: "/featured/huarache" },
        { name: "Air Max 90", href: "/featured/air-max-90" },
        { name: "Air Max 95", href: "/featured/air-max-95" },
      ],
    },
    {
      title: "Shoes",
      links: [
        { name: "All Shoes", href: "/shoes/all" },
        { name: "Custom Shoes", href: "/shoes/custom" },
        { name: "Jordan Shoes", href: "/shoes/jordan" },
        { name: "Running Shoes", href: "/shoes/running" },
      ],
    },
    {
      title: "Clothing",
      links: [
        { name: "All Clothing", href: "/clothing/all" },
        { name: "Modest Wear", href: "/clothing/modest" },
        { name: "Hoodies & Pullovers", href: "/clothing/hoodies" },
        { name: "Shirts & Tops", href: "/clothing/shirts" },
      ],
    },
    {
      title: "Kids'",
      links: [
        { name: "Infant & Toddler Shoes", href: "/kids/infant-toddler" },
        { name: "Kids' Shoes", href: "/kids/shoes" },
        { name: "Kids' Jordan Shoes", href: "/kids/jordan" },
        { name: "Kids' Basketball Shoes", href: "/kids/basketball" },
      ],
    },
  ];

  const bottomLinks = [
    { name: "Guides", href: "/guides" },
    { name: "Terms of Sale", href: "/terms-of-sale" },
    { name: "Terms of Use", href: "/terms-of-use" },
    { name: "Nike Privacy Policy", href: "/privacy-policy" },
  ];

  const socialLinks = [
    { name: "Twitter", icon: "/twitter-x.svg", href: "https://twitter.com/nike" },
    { name: "Facebook", icon: "/facebook.svg", href: "https://facebook.com/nike" },
    { name: "Instagram", icon: "/instagram.svg", href: "https://instagram.com/nike" },
  ];

  return (
    <footer className="bg-black text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 mb-12">
          <div className="lg:col-span-1">
            <Link href="/" className="inline-block mb-6">
              <Image
                src="/nike-swoosh.svg"
                alt="Nike"
                width={60}
                height={22}
                className="brightness-0 invert"
              />
            </Link>
          </div>

          {footerSections.map((section) => (
            <div key={section.title}>
              <h3 className="text-white font-medium text-base mb-4">
                {section.title}
              </h3>
              <ul className="space-y-3">
                {section.links.map((link) => (
                  <li key={link.name}>
                    <Link
                      href={link.href}
                      className="text-gray-400 hover:text-white text-sm transition-colors"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="flex flex-col md:flex-row justify-between items-center pt-8 border-t border-gray-800">
          <div className="flex items-center space-x-4 mb-4 md:mb-0">
            <div className="flex items-center space-x-2 text-gray-400 text-sm">
              <Image
                src="/location-pin.svg"
                alt="Location"
                width={16}
                height={16}
                className="brightness-0 invert opacity-60"
              />
              <span>Croatia</span>
            </div>
            <span className="text-gray-400 text-sm">
              © 2025 Nike, Inc. All Rights Reserved
            </span>
          </div>

          <div className="flex items-center space-x-6">
            <div className="flex items-center space-x-4">
              {bottomLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  className="text-gray-400 hover:text-white text-sm transition-colors"
                >
                  {link.name}
                </Link>
              ))}
            </div>
            <div className="flex items-center space-x-4 ml-6">
              {socialLinks.map((social) => (
                <a
                  key={social.name}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-8 h-8 rounded-full bg-gray-800 hover:bg-gray-700 flex items-center justify-center transition-colors"
                  aria-label={social.name}
                >
                  <Image
                    src={social.icon}
                    alt={social.name}
                    width={16}
                    height={16}
                    className="brightness-0 invert"
                  />
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
