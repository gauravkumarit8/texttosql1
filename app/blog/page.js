// app/blog/page.js

export const metadata = {
  title: "Blog | AI Text to SQL Generator",
  description:
    "Learn about Text to SQL, AI SQL generators, PostgreSQL query automation, and natural language to SQL conversion guides.",
};

const posts = [
  {
    title: "What is Text to SQL? Complete Beginner Guide (2026)",
    description:
      "Learn what Text to SQL is, how AI converts natural language into SQL queries, and why it matters for developers and analysts.",
    slug: "what-is-text-to-sql",
    date: "March 2026",
    readTime: "8 min read",
  },
];

export default function BlogPage() {
  return (
    <main
      style={{
        padding: "40px 20px",
        display: "flex",
        justifyContent: "center",
      }}
    >
      <div style={{ maxWidth: 1000, width: "100%" }}>
        {/* Header Section */}
        <h1 style={{ fontSize: 42, marginBottom: 10 }}>
          AI Text to SQL Blog
        </h1>

        <p style={{ fontSize: 18, color: "#555", lineHeight: 1.7 }}>
          Explore guides, tutorials, and deep dives about{" "}
          <strong>Text to SQL</strong>, AI SQL generators, PostgreSQL query
          automation, and natural language database querying.
        </p>

        <hr style={{ margin: "30px 0" }} />

        {/* Blog Cards */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
            gap: "24px",
          }}
        >
          {posts.map((post, index) => (
            <a
              key={index}
              href={`/blog/${post.slug}`}
              style={{
                textDecoration: "none",
                border: "1px solid #e5e5e5",
                padding: "20px",
                borderRadius: "16px",
                transition: "all 0.2s ease",
                background: "#fff",
              }}
            >
              <h2 style={{ fontSize: 22, marginBottom: 10 }}>
                {post.title}
              </h2>

              <p style={{ fontSize: 15, color: "#666", marginBottom: 12 }}>
                {post.description}
              </p>

              <p style={{ fontSize: 13, color: "#999" }}>
                {post.date} • {post.readTime}
              </p>

              <span
                style={{
                  display: "inline-block",
                  marginTop: 14,
                  fontWeight: 600,
                  color: "#0070f3",
                }}
              >
                Read Article →
              </span>
            </a>
          ))}
        </div>

        <hr style={{ margin: "40px 0" }} />

        {/* SEO Content Section (Important for Ranking) */}
        <section>
          <h2 style={{ fontSize: 28, marginBottom: 14 }}>
            Learn About AI-Powered SQL Query Generation
          </h2>

          <p style={{ fontSize: 17, lineHeight: 1.8, color: "#444" }}>
            Our blog focuses on helping developers, analysts, and students
            understand how AI can simplify SQL query writing. Whether you're
            learning how to convert English to SQL queries, exploring natural
            language database querying, or looking for the best AI SQL generator,
            our guides provide practical examples and explanations.
          </p>

          <p style={{ fontSize: 17, lineHeight: 1.8, color: "#444" }}>
            We regularly publish tutorials on PostgreSQL query generation,
            aggregation queries, JOIN statements, filtering techniques, and
            database automation using AI tools.
          </p>

          <p style={{ fontSize: 17, lineHeight: 1.8, color: "#444" }}>
            If you're new to SQL or want to speed up your workflow, explore our
            detailed guides and start using AI to generate accurate SQL queries
            instantly.
          </p>
        </section>

        <hr style={{ margin: "40px 0" }} />

        {/* CTA Section */}
        <div
          style={{
            padding: "30px",
            borderRadius: "20px",
            background: "#f5f7fa",
            textAlign: "center",
          }}
        >
          <h3 style={{ fontSize: 24, marginBottom: 10 }}>
            Try Our AI Text to SQL Generator
          </h3>

          <p style={{ fontSize: 16, color: "#555", marginBottom: 18 }}>
            Convert plain English into PostgreSQL SQL queries instantly.
          </p>

          <a
            href="/"
            style={{
              display: "inline-block",
              padding: "12px 20px",
              borderRadius: "12px",
              background: "#0070f3",
              color: "#fff",
              textDecoration: "none",
              fontWeight: 600,
            }}
          >
            Generate SQL Now →
          </a>
        </div>
      </div>
    </main>
  );
}