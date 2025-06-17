import { FaFacebookSquare, FaInstagram, FaSpotify } from "react-icons/fa";
import { IoIosArrowUp } from "react-icons/io";

const socialLinks = [
  {
    icon: FaFacebookSquare,
    label: "Facebook",
    href: "https://www.facebook.com/stabzilog",
  },
  {
    icon: FaInstagram,
    label: "Instagram",
    href: "https://www.instagram.com/stab.cult",
  },
  {
    icon: FaSpotify,
    label: "Spotify",
    href: "https://open.spotify.com/artist/7sCkooThtWgYUNIp07b73f?si=v_jKMjBTQ-iyB5W_8enL7A",
  },
];

const Footer = () => {
  const scrollToTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

  return (
    <footer className="mt-10 bg-white border-gray-300">
      <div className="max-w-5xl px-4 py-5 mx-auto text-sm text-center text-gray-600">
        {/* Social Links */}
        <div className="flex flex-col-reverse justify-center gap-4 mb-2">
          {" "}
          <div className="flex justify-center gap-2 text-2xl">
            {socialLinks.map(({ icon: Icon, label, href }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`Visit our ${label}`}
                className="transition-colors hover:text-black"
              >
                <Icon />
              </a>
            ))}
          </div>
          {/* Tagline */}
          <p className="italic text-gray-500">juana osmeña hardcore</p>
        </div>

        {/* Contact */}
        {/* <p className="text-gray-500">
          need help? reach us at{" "}
          <a
            href="mailto:gaw@stabcult.com"
            className="text-black underline underline-offset-2 hover:text-stone-800"
          >
            gaw@stabcult.com
          </a>
        </p> */}

        {/* Footer bottom */}
        <div className="flex flex-col items-center justify-center gap-2 pt-4 mt-5 border-t border-gray-200">
          <button
            onClick={scrollToTop}
            className="flex items-center gap-1 text-xs text-gray-500 hover:text-black"
          >
            <IoIosArrowUp className="text-base" />
            back to top
          </button>
          <p className="text-xs text-gray-400">
            © {new Date().getFullYear()} stab.cult - all rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
