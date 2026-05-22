import { Link, useParams, Navigate } from "react-router-dom";
import { ArrowLeft, ArrowUpRight } from "lucide-react";
import { ARTICLES, getArticleBySlug } from "@/data/articles";
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

export default function BlogPost() {
  const { slug } = useParams();
  const article = getArticleBySlug(slug);
  useSEO(
    article
      ? {
          title: article.title,
          description: article.excerpt,
          type: "article",
          ogImage: article.cover,
        }
      : {}
  );
  if (!article) return <Navigate to="/blog" replace />;

  const related = ARTICLES.filter((a) => a.slug !== slug).slice(0, 2);

  return (
    <article data-testid={`blog-post-${slug}`}>
      {/* Cover */}
      <div
        className="h-[360px] lg:h-[480px] bg-cover bg-center relative"
        style={{ backgroundImage: `url(${article.cover})` }}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-[#1C1917]/70 via-[#1C1917]/20 to-transparent" />
      </div>

      <div className="max-w-3xl mx-auto px-6 lg:px-0 -mt-24 relative">
        <div className="bg-[#FAF9F6] border border-[#E7E5DF] p-8 lg:p-12">
          <Link
            to="/blog"
            className="inline-flex items-center gap-1 text-sm text-[#8C4A32] hover:underline mb-6"
            data-testid="back-to-blog"
          >
            <ArrowLeft size={14} /> All articles
          </Link>

          <div className="flex items-center gap-4 mb-4 flex-wrap">
            <span className="overline text-[#8C4A32]">{article.category}</span>
            <span className="text-xs text-[#57534E]">
              {formatDate(article.date)} · {article.read_time} ·{" "}
              {article.author}
            </span>
          </div>

          <h1 className="font-serif text-3xl lg:text-5xl text-[#1C1917] leading-tight">
            {article.title}
          </h1>

          <div className="divider-line my-10" />

          <div className="prose-custom">
            {article.body.map((block, i) => {
              if (block.h) {
                return (
                  <h2
                    key={i}
                    className="font-serif text-2xl text-[#1C1917] mt-10 mb-4"
                  >
                    {block.h}
                  </h2>
                );
              }
              if (block.p) {
                return (
                  <p
                    key={i}
                    className="text-[#1C1917] leading-relaxed mb-5 text-[17px]"
                  >
                    {block.p}
                  </p>
                );
              }
              if (block.list) {
                return (
                  <ul key={i} className="space-y-2 my-5 pl-5 list-disc">
                    {block.list.map((li, j) => (
                      <li
                        key={j}
                        className="text-[#1C1917] leading-relaxed text-[17px]"
                      >
                        {li}
                      </li>
                    ))}
                  </ul>
                );
              }
              return null;
            })}
          </div>

          <div className="mt-12 border-t border-[#E7E5DF] pt-8">
            <div className="overline text-[#8C4A32] mb-2">Next step</div>
            <h3 className="font-serif text-2xl text-[#1C1917]">
              Have a case you'd like us to look at?
            </h3>
            <p className="mt-2 text-[#57534E]">
              A 30-minute confidential consultation is free and without
              obligation.
            </p>
            <Link
              to="/contact"
              className="btn-primary mt-6"
              data-testid="blog-post-cta"
            >
              Talk to an advisor <ArrowUpRight size={14} />
            </Link>
          </div>
        </div>
      </div>

      {/* Related */}
      <section className="max-w-7xl mx-auto px-6 lg:px-12 py-20 mt-12">
        <div className="overline text-[#8C4A32] mb-4">Keep reading</div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-[#E7E5DF] border border-[#E7E5DF]">
          {related.map((a) => (
            <Link
              key={a.slug}
              to={`/blog/${a.slug}`}
              className="bg-[#FAF9F6] p-8 hover:bg-[#F3F0E9] transition-colors group"
              data-testid={`blog-related-${a.slug}`}
            >
              <span className="overline text-[#8C4A32]">{a.category}</span>
              <h3 className="font-serif text-xl text-[#1C1917] mt-3 leading-snug group-hover:text-[#8C4A32] transition-colors">
                {a.title}
              </h3>
              <p className="mt-3 text-sm text-[#57534E] leading-relaxed">
                {a.excerpt}
              </p>
            </Link>
          ))}
        </div>
      </section>
    </article>
  );
}
