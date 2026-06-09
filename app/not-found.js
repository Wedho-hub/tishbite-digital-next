import Link from "next/link";
import { FaArrowRight } from "react-icons/fa";

export default function NotFound() {
  return (
    <section className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4 py-20">
      <p className="text-8xl font-extrabold text-primary/20 mb-4">404</p>
      <h1
        className="text-3xl font-extrabold text-primary-dark mb-3"
        style={{ fontFamily: "var(--font-montserrat), sans-serif" }}
      >
        Page Not Found
      </h1>
      <p className="text-text-muted max-w-md mb-8">
        The page you're looking for doesn't exist or may have moved. Let's get
        you back on track.
      </p>
      <div className="flex flex-wrap gap-3 justify-center">
        <Link
          href="/"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-primary-dark to-primary-light text-white font-bold no-underline hover:-translate-y-0.5 transition-all duration-300"
        >
          Go Home <FaArrowRight />
        </Link>
        <Link
          href="/contact"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl border-2 border-primary text-primary font-bold no-underline hover:bg-primary hover:text-white transition-all duration-300"
        >
          Contact Us
        </Link>
      </div>
    </section>
  );
}
