export default function PageHeader({ title, subtitle, background = "dark" }) {
  const isDark = background === "dark";
  return (
    <section
      className={`py-14 ${isDark ? "bg-linear-to-r from-primary-dark via-primary to-primary-light" : "bg-bg border-b border-primary/8"}`}
    >
      <div className="container mx-auto px-4 max-w-7xl text-center">
        <h1
          className={`text-4xl lg:text-5xl font-extrabold mb-3 ${isDark ? "text-white" : "text-primary-dark"}`}
          style={{ fontFamily: "var(--font-montserrat), sans-serif" }}
        >
          {title}
        </h1>
        {subtitle && (
          <p
            className={`text-base max-w-xl mx-auto ${isDark ? "text-white/70" : "text-text-muted"}`}
          >
            {subtitle}
          </p>
        )}
      </div>
    </section>
  );
}
