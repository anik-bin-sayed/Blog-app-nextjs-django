import React from "react";
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin } from "react-icons/fa";

const socialIcons = [
  {
    Icon: FaFacebook,
    href: "#",
    label: "Facebook",
    color: "hover:text-blue-600",
  },
  {
    Icon: FaTwitter,
    href: "#",
    label: "Twitter",
    color: "hover:text-sky-500",
  },
  {
    Icon: FaInstagram,
    href: "#",
    label: "Instagram",
    color: "hover:text-pink-500",
  },
  {
    Icon: FaLinkedin,
    href: "#",
    label: "LinkedIn",
    color: "hover:text-blue-700",
  },
];

const SocialLinks = () => {
  return (
    <section className="bg-linear-to-b from-white to-gray-50 py-16 md:py-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-center gap-8 md:gap-12">
          <div className="text-center space-y-2">
            <h2 className="text-sm uppercase tracking-wider font-semibold text-amber-600">
              My Email
            </h2>
            <p className="text-xl md:text-2xl text-gray-800 font-medium">
              info@sophiaellis.com
            </p>
          </div>

          <div className="w-12 h-px md:w-px md:h-12 bg-gray-300"></div>

          <div className="text-center space-y-4">
            <h2 className="text-sm uppercase tracking-wider font-semibold text-amber-600">
              Follow Me
            </h2>
            <div className="flex justify-center gap-5">
              {socialIcons.map(({ Icon, href, label, color }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`text-gray-600 text-2xl transition-all duration-200 ${color} hover:scale-110`}
                  aria-label={label}
                >
                  <Icon />
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SocialLinks;
