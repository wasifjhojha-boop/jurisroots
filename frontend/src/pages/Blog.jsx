import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";
import { ARTICLES } from "@/data/articles";
import useSEO from "@/hooks/useSEO";

function formatDate(iso) {
  try {
    return new Date(iso).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  } catch {
    return iso;
  }
}

export default function Blog() {
  useSEO({
    title: "Journal — Court marriage law & procedure (Delhi-NCR)",
    description: "Practical guides on Special Marriage Act, Hindu Marriage Act, NRI marriage, document checklists, and parental opposition.",
  });
  const [featured, ...rest] = ARTICLES;
  return (
    <div
      className="max-w-7xl mx-auto px-6 lg:px-12 py-16 lg:py-24"
      data-testid="blog-page"
    >
      <div className="max-w-3xl mb-16">
        <div className="overline text-[#8C4A32] mb-4">The Journal</div>
        <h1 className="font-serif text-4xl lg:text-6xl text-[#1C1917] leading-tight">
          Notes from chamber — clear writing on marriage law.
        </h1>
        <p className="mt-6 text-[#57534E] leading-relaxed text-lg">
          Practical guides, procedural walkthroughs, and the occasional hot-take
          from a practice that sees hundreds of Delhi registrations every year.
        </p>
      </div>

      {/* Featured */}
      <Link
        to={`/blog/${featured.slug}`}
        className="group block mb-20 border border-[#E7E5DF] bg-[#FAF9F6] overflow-hidden hover:border-[#8C4A32] transition-colors"
        data-testid={`blog-featured-${featured.slug}`}
      >
        <div className="grid grid-cols-1 lg:grid-cols-2">
          <div
            className="aspect-[4/3] lg:aspect-auto bg-cover bg-center min-h-[320px]"
            style={{ backgroundImage: `url(${featured.cover})` }}
          />
          <div className="p-8 lg:p-12 flex flex-col justify-center">
            <div className="flex items-center gap-4 mb-6">
              <span className="overline text-[#8C4A32]">
                {featured.category}
              </span>
              <span className="text-xs text-[#57534E]">
                {formatDate(featured.date)} · {featured.read_time}
              </span>
            </div>
            <h2 className="font-serif text-3xl lg:text-4xl text-[#1C1917] leading-tight group-hover:text-[#8C4A32] transition-colors">
              {featured.title}
            </h2>
            <p className="mt-5 text-[#57534E] leading-relaxed">
              {featured.excerpt}
            </p>
            <div className="mt-8 inline-flex items-center gap-1 text-sm text-[#8C4A32]">
              Read the article <ArrowUpRight size={14} />
            </div>
          </div>
        </div>
      </Link>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px bg-[#E7E5DF] border border-[#E7E5DF]">
        {rest.map((a) => (
          <Link
            key={a.slug}
            to={`/blog/${a.slug}`}
            className="group bg-[#FAF9F6] p-8 hover:bg-[#F3F0E9] transition-colors flex flex-col"
            data-testid={`blog-card-${a.slug}`}
          >
            <div
              className="aspect-[16/10] bg-cover bg-center mb-6 border border-[#E7E5DF]"
              style={{ backgroundImage: `url(${a.cover})` }}
            />
            <span className="overline text-[#8C4A32] mb-3">{a.category}</span>
            <h3 className="font-serif text-xl text-[#1C1917] leading-snug group-hover:text-[#8C4A32] transition-colors">
              {a.title}
            </h3>
            <p className="mt-3 text-sm text-[#57534E] leading-relaxed flex-1">
              {a.excerpt}
            </p>
            <div className="mt-5 text-xs text-[#57534E]">
              {formatDate(a.date)} · {a.read_time}
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
