export default function PortfolioTab() {
  return (
    <div className="max-w-xl mx-auto py-8 px-4">
      <div className="flex items-center gap-5 mb-6">
        <div className="w-20 h-20 rounded-full bg-gray-200 flex items-center justify-center text-3xl font-bold text-gray-500 shrink-0">
          W
        </div>
        <div>
          <h2 className="text-2xl font-semibold text-gray-800">Wahaj</h2>
          <p className="text-gray-500 text-sm mt-0.5">Full-Stack Developer</p>
        </div>
      </div>
      <p className="text-gray-600 leading-relaxed mb-6">
        Building clean, fast web applications with modern tools. Passionate
        about great user experiences and simple, maintainable code. i am the change 
      </p>
      <div className="mb-6">
        <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide mb-3">
          Skills
        </h3>
        <div className="flex flex-wrap gap-2">
          {["Next.js", "React", "TypeScript", "Node.js", "Tailwind CSS"].map(
            (skill) => (
              <span
                key={skill}
                className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm"
              >
                {skill}
              </span>
            )
          )}
        </div>
      </div>
      <div>
        <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide mb-3">
          Links
        </h3>
        <div className="flex flex-col gap-2">
          {[
            { label: "GitHub", href: "https://github.com/ESE-Wahaj" },
            { label: "Email", href: "mailto:hassan@shsoftwaresolution.com" },
          ].map(({ label, href }) => (
            <a
              key={label}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-800 hover:underline text-sm"
            >
              {label} →
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}
