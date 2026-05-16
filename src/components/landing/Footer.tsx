import { IconBrandGithub, IconSchool } from "@tabler/icons-react";
import Link from "next/link";

const footerLinks = {
  Product: [
    { title: "Features", href: "#features" },
    { title: "How It Works", href: "#showcase" },
    { title: "Pricing", href: "#pricing" },
    {
      title: "Roadmap",
      href: "https://github.com/ReactiveX22/classmate-client/issues",
      external: true,
    },
  ],
  Developers: [
    {
      title: "GitHub",
      href: "https://github.com/ReactiveX22/classmate-client",
      external: true,
    },
    {
      title: "Backend Repo",
      href: "https://github.com/ReactiveX22/classmate-backend",
      external: true,
    },
    {
      title: "Report an Issue",
      href: "https://github.com/ReactiveX22/classmate-client/issues/new",
      external: true,
    },
    {
      title: "Self-host Guide",
      href: "https://github.com/ReactiveX22/classmate-client#readme",
      external: true,
    },
  ],
  Platform: [
    { title: "Admin Dashboard", href: "/dashboard" },
    { title: "Sign In", href: "/login" },
    { title: "Get Started", href: "/signup" },
  ],
};

export function Footer() {
  return (
    <footer className="relative border-t border-border/40">
      {/* Subtle top glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" />

      <div className="max-w-7xl mx-auto px-6 pt-16 pb-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-10 mb-14">
          {/* Brand column */}
          <div className="col-span-2 md:col-span-1 space-y-5">
            <Link
              href="/"
              className="flex items-center gap-2.5 font-bold text-xl group w-fit"
            >
              <div className="w-9 h-9 bg-primary rounded-xl flex items-center justify-center text-primary-foreground shadow-md shadow-primary/30 group-hover:shadow-primary/50 transition-shadow">
                <IconSchool size={20} />
              </div>
              <span>ClassMate</span>
            </Link>
            <p className="text-sm text-muted-foreground leading-relaxed max-w-[220px]">
              The open-source academic management platform for modern
              institutions.
            </p>
            <Link
              href="https://github.com/ReactiveX22/classmate-client"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-border/60 hover:border-primary/30 hover:bg-primary/5 text-sm font-medium transition-all text-muted-foreground hover:text-foreground"
            >
              <IconBrandGithub size={16} />
              Star on GitHub
            </Link>
          </div>

          {/* Link columns */}
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <h3 className="font-semibold text-sm mb-5 text-foreground">
                {category}
              </h3>
              <ul className="space-y-3.5">
                {links.map((link) => (
                  <li key={link.title}>
                    <Link
                      href={link.href}
                      target={
                        "external" in link && link.external
                          ? "_blank"
                          : undefined
                      }
                      rel={
                        "external" in link && link.external
                          ? "noopener noreferrer"
                          : undefined
                      }
                      className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {link.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="pt-8 border-t border-border/30 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} ClassMate. Open-source under the{" "}
            <Link
              href="https://github.com/ReactiveX22/classmate-client/blob/main/LICENSE"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-foreground transition-colors underline underline-offset-2"
            >
              MIT License
            </Link>
            .
          </p>
          <div className="flex items-center gap-5">
            <Link
              href="https://github.com/ReactiveX22/classmate-client"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="GitHub"
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
              </svg>
            </Link>
            {/* X / Twitter */}
            <Link
              href="#"
              aria-label="X (Twitter)"
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.73-8.835L1.254 2.25H8.08l4.213 5.567zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
              </svg>
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
