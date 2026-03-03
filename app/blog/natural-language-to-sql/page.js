export const metadata = {
  title: "Natural Language to SQL | Convert English to SQL with AI",
  description:
    "Convert natural language into SQL queries instantly using AI. Generate PostgreSQL or Spark SQL from plain English with examples, tips, and best practices.",
};

function CodeBlock({ children }) {
  return (
    <pre className="my-4 overflow-x-auto rounded-xl border border-zinc-200 bg-zinc-950 p-4 text-sm leading-relaxed text-zinc-100 dark:border-zinc-800">
      <code>{children}</code>
    </pre>
  );
}

export default function NaturalLanguageToSQLPage() {
  return (
    <main className="min-h-screen bg-white text-zinc-900 dark:bg-zinc-950 dark:text-zinc-100">
      <article className="mx-auto max-w-3xl px-4 py-12">
        <p className="text-sm text-zinc-500 dark:text-zinc-400">
          Updated: 2026 • Keyword focus: “natural language to sql”
        </p>

        <h1 className="mt-2 text-4xl font-bold tracking-tight md:text-5xl">
          Natural Language to SQL (NL2SQL): Convert English to SQL with AI
        </h1>

        <p className="mt-5 text-lg leading-8 text-zinc-700 dark:text-zinc-300">
          <strong className="text-zinc-900 dark:text-zinc-100">
            Natural Language to SQL
          </strong>{" "}
          (often called <strong>NL2SQL</strong>) is an AI-powered approach that
          translates plain English questions into SQL queries. Instead of writing
          SQL manually, you describe what you want — the AI generates the query
          for you in seconds.
        </p>

        <p className="mt-3 text-lg leading-8 text-zinc-700 dark:text-zinc-300">
          This is useful for developers, analysts, students, and teams who want
          fast query generation, fewer syntax errors, and a smoother workflow for
          databases like <strong>PostgreSQL</strong> and <strong>Spark SQL</strong>.
        </p>

        <div className="mt-8 rounded-2xl border border-zinc-200 bg-zinc-50 p-5 dark:border-zinc-800 dark:bg-zinc-900/30">
          <h2 className="text-xl font-semibold">Try it now</h2>
          <p className="mt-2 text-zinc-700 dark:text-zinc-300">
            Use the tool on the homepage. For now, you can generate{" "}
            <strong>PostgreSQL</strong> and <strong>Spark SQL</strong>.
          </p>
          <a
            href="/"
            className="mt-4 inline-flex items-center rounded-xl bg-blue-600 px-4 py-2 font-semibold text-white hover:bg-blue-500"
          >
            Open Text to SQL Tool →
          </a>
        </div>

        <hr className="my-10 border-zinc-200 dark:border-zinc-800" />

        <section>
          <h2 className="text-2xl font-semibold">What is NL2SQL?</h2>
          <p className="mt-3 leading-8 text-zinc-700 dark:text-zinc-300">
            NL2SQL systems take a natural language question and produce a SQL
            query. Example:
          </p>

          <p className="mt-4 font-semibold">English</p>
          <CodeBlock>Show top 5 products by total revenue</CodeBlock>

          <p className="mt-4 font-semibold">SQL</p>
          <CodeBlock>{`SELECT product_name, SUM(total_amount) AS revenue
FROM orders
GROUP BY product_name
ORDER BY revenue DESC
LIMIT 5;`}</CodeBlock>
        </section>

        <section className="mt-10">
          <h2 className="text-2xl font-semibold">How Natural Language to SQL works</h2>
          <ol className="mt-4 list-decimal space-y-2 pl-6 text-zinc-700 dark:text-zinc-300">
            <li>
              <strong className="text-zinc-900 dark:text-zinc-100">Intent parsing:</strong>{" "}
              Understand what you want (filtering, grouping, joins, limits).
            </li>
            <li>
              <strong className="text-zinc-900 dark:text-zinc-100">Schema mapping:</strong>{" "}
              Match your terms to tables/columns (e.g. “revenue” → total_amount).
            </li>
            <li>
              <strong className="text-zinc-900 dark:text-zinc-100">Query planning:</strong>{" "}
              Build SELECT / FROM / WHERE / GROUP BY / ORDER BY.
            </li>
            <li>
              <strong className="text-zinc-900 dark:text-zinc-100">SQL generation:</strong>{" "}
              Produce valid SQL and format it.
            </li>
          </ol>
        </section>

        <section className="mt-10">
          <h2 className="text-2xl font-semibold">Examples you can copy</h2>

          <h3 className="mt-6 text-xl font-semibold">1) Filtering</h3>
          <p className="mt-2 text-zinc-700 dark:text-zinc-300">
            English: Show all active employees in IT.
          </p>
          <CodeBlock>{`SELECT *
FROM employee
WHERE status = 'Active'
  AND department = 'IT';`}</CodeBlock>

          <h3 className="mt-6 text-xl font-semibold">2) Date range</h3>
          <p className="mt-2 text-zinc-700 dark:text-zinc-300">
            English: Orders created in January 2026.
          </p>
          <CodeBlock>{`SELECT *
FROM orders
WHERE order_date >= DATE '2026-01-01'
  AND order_date <  DATE '2026-02-01'
ORDER BY order_date;`}</CodeBlock>

          <h3 className="mt-6 text-xl font-semibold">3) Join</h3>
          <p className="mt-2 text-zinc-700 dark:text-zinc-300">
            English: Show orders with the employee who created them.
          </p>
          <CodeBlock>{`SELECT
  o.order_number,
  o.customer_name,
  o.product_name,
  o.total_amount,
  e.first_name || ' ' || e.last_name AS employee_name
FROM orders o
JOIN employee e ON e.employee_id = o.employee_id
ORDER BY o.order_date DESC;`}</CodeBlock>
        </section>

        <section className="mt-10">
          <h2 className="text-2xl font-semibold">Tips to get better SQL output</h2>
          <ul className="mt-4 list-disc space-y-2 pl-6 text-zinc-700 dark:text-zinc-300">
            <li>
              Be specific: say “top 10 by revenue in last 30 days” instead of “top products”.
            </li>
            <li>
              Mention table names if you know them: <code>orders</code>, <code>employee</code>.
            </li>
            <li>
              If you want query for your own DB tables, pass table names + question clearly.
            </li>
            <li>
              For Spark: generate SQL and run it in your Spark/Databricks environment.
            </li>
          </ul>
        </section>

        <section className="mt-10">
          <h2 className="text-2xl font-semibold">Use with your own database</h2>
          <p className="mt-3 leading-8 text-zinc-700 dark:text-zinc-300">
            Direct DB connection is temporarily paused due to high demand. If you
            want to use this app with your database, email:
          </p>

          <a
            className="mt-4 inline-flex rounded-xl border border-zinc-200 px-4 py-2 font-semibold hover:bg-zinc-50 dark:border-zinc-800 dark:hover:bg-zinc-900"
            href="mailto:thagau508@gmail.com?subject=Text%20to%20SQL%20-%20DB%20Integration%20Request"
          >
            thagau508@gmail.com
          </a>
        </section>

        <hr className="my-10 border-zinc-200 dark:border-zinc-800" />

        <section>
          <h2 className="text-2xl font-semibold">More resources</h2>
          <ul className="mt-3 list-disc pl-6 text-zinc-700 dark:text-zinc-300">
            <li>
              <a className="underline underline-offset-4 hover:opacity-80" href="/blog">
                Blog
              </a>
            </li>
            <li>
              <a className="underline underline-offset-4 hover:opacity-80" href="/blog/what-is-text-to-sql">
                What is Text to SQL? Beginner guide
              </a>
            </li>
          </ul>
        </section>
      </article>
    </main>
  );
}