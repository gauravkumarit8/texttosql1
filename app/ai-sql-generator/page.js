export const metadata = {
  title: "AI SQL Generator | Convert English to SQL Instantly",
  description:
    "Free AI SQL Generator that converts natural language into PostgreSQL SQL queries instantly. No manual query writing required.",
};

export default function AISQLGeneratorPage() {
  return (
    <main className="min-h-screen bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100">
      <div className="mx-auto max-w-3xl px-4 py-12">
        <h1 className="text-4xl font-bold">
          AI SQL Generator – Convert English to SQL Instantly
        </h1>

        <p className="mt-4 text-lg text-zinc-700 dark:text-zinc-300 leading-8">
          Our AI SQL Generator helps you convert natural language into
          structured SQL queries in seconds. Simply describe what you need,
          and the tool generates optimized PostgreSQL queries instantly.
        </p>

        <h2 className="mt-8 text-2xl font-semibold">
          Why Use an AI SQL Generator?
        </h2>

        <ul className="mt-4 list-disc pl-6 space-y-2 text-zinc-700 dark:text-zinc-300">
          <li>Generate SQL queries instantly</li>
          <li>Reduce syntax errors</li>
          <li>Save development time</li>
          <li>Perfect for beginners and analysts</li>
        </ul>

        <h2 className="mt-8 text-2xl font-semibold">
          Example: English to SQL
        </h2>

        <pre className="mt-4 bg-zinc-900 text-zinc-100 p-4 rounded-xl overflow-x-auto text-sm">
{`SELECT product_name, SUM(total_amount) AS revenue
FROM orders
GROUP BY product_name
ORDER BY revenue DESC;`}
        </pre>

        <div className="mt-10">
          <a
            href="/"
            className="inline-block rounded-xl bg-blue-600 px-5 py-3 text-white font-semibold hover:bg-blue-700"
          >
            Try AI SQL Generator →
          </a>
        </div>
      </div>
    </main>
  );
}