"use client";

import React, { useState, useEffect } from "react";
import {
  Database,
  Search,
  Play,
  CheckCircle2,
  Check,
  Copy,
  ChevronRight,
  ChevronDown,
  Table as TableIcon,
  History,
  Terminal,
  Loader2,
  AlertTriangle,
  Settings2,
  Server,
  Lock,
  Eye,
  EyeOff,
  Layers,
  Zap,
  Globe,
  FileCode,
} from "lucide-react";

const App = () => {
  // State Management
  const [question, setQuestion] = useState("");
  const [tables, setTables] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [response, setResponse] = useState(null);
  const [history, setHistory] = useState([]);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [copied, setCopied] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // Announcement content
  const ANNOUNCEMENT = {
    title: "Notice",
    text:
      "Direct DB connection is temporarily paused due to high demand. For demo, try the built-in ",
    demoTables: ["employee", "orders"],
    more:
      " tables. If you want SQL for your own tables, enter table name(s) and your question. For DB integration, email: ",
    email: "thagau508@gmail.com",
    extra: "For now, you can use PostgreSQL and Spark SQL generation.",
  };

  // Database Connection State
  const [dbEngine, setDbEngine] = useState("postgres"); // postgres, mysql, clickhouse, spark
  const [dbConfig, setDbConfig] = useState({
    host: "localhost",
    port: "5432",
    database: "",
    user: "",
    password: "",
  });

  // Spark-specific State
  const [sparkConfig, setSparkConfig] = useState({
    catalog: "",
    database: "default",
    schemaEndpoint: "",
    schema: "",
  });
  const [showSparkSchema, setShowSparkSchema] = useState(false);
  const [showSparkEndpoint, setShowSparkEndpoint] = useState(false);

  // Automatically update default port when DB type changes
  useEffect(() => {
    const ports = {
      postgres: "5432",
      mysql: "3306",
      clickhouse: "8123",
      spark: "", // Spark doesn't use traditional port config
    };
    if (dbEngine !== "spark") {
      setDbConfig((prev) => ({ ...prev, port: ports[dbEngine] }));
    }
  }, [dbEngine]);

  const N8N_WEBHOOK_URL = "https://texttosql-1.onrender.com/webhook/text";

  const handleExecute = async () => {
    if (!question.trim()) return;

    setIsLoading(true);
    try {
      const tableArray = tables
        .split(",")
        .map((t) => t.trim())
        .filter((t) => t !== "");

      // Build payload based on engine type
      const payload = {
        question: question,
        db_engine: dbEngine,
        tables: tableArray.length > 0 ? tableArray : ["public.employees"],
      };

      // Add engine-specific configuration
      if (dbEngine === "spark") {
        // Spark configuration
        if (sparkConfig.catalog) {
          payload.spark_catalog = sparkConfig.catalog;
        }
        payload.spark_database = sparkConfig.database || "default";

        // Parse and add schema if provided
        if (sparkConfig.schema.trim()) {
          try {
            payload.spark_schema = JSON.parse(sparkConfig.schema);
          } catch (e) {
            console.warn("Invalid JSON in spark_schema, skipping");
          }
        }

        // Add schema endpoint if provided
        if (sparkConfig.schemaEndpoint.trim()) {
          payload.spark_config = {
            schema_endpoint: sparkConfig.schemaEndpoint,
          };
        }
      } else {
        // Traditional database configuration
        payload.db_config = {
          ...dbConfig,
          port: parseInt(dbConfig.port || "5432", 10),
        };
      }

      const res = await fetch(N8N_WEBHOOK_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error(`Server responded with ${res.status}`);

      const data = await res.json();
      setResponse(data);

      setHistory((prev) =>
        [
          {
            id: Date.now(),
            question,
            timestamp: new Date().toLocaleTimeString(),
            success: data.success,
            engine: dbEngine,
          },
          ...prev,
        ].slice(0, 5)
      );
    } catch (error) {
      setResponse({
        success: false,
        query: "-- Connection Error",
        results: [],
        errors: {
          messages: [
            "Failed to connect to n8n. Please ensure n8n is running and the workflow is in 'Test' mode.",
          ],
        },
        metadata: { requested: [], found_in_db: [] },
      });
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setShowToast(true);
      setTimeout(() => setCopied(false), 2000);
      setTimeout(() => setShowToast(false), 3000);
    });
  };

  const getColumns = () => {
    if (response?.results?.length > 0) return Object.keys(response.results[0]);
    return [];
  };

  const getEngineIcon = (engine) => {
    switch (engine) {
      case "spark":
        return <Zap className="w-3 h-3" />;
      case "postgres":
      case "mysql":
      case "clickhouse":
      default:
        return <Database className="w-3 h-3" />;
    }
  };

  const getEngineColor = (engine) => {
    switch (engine) {
      case "spark":
        return "text-orange-400 bg-orange-500/10 border-orange-500/30";
      case "postgres":
        return "text-blue-400 bg-blue-500/10 border-blue-500/30";
      case "mysql":
        return "text-cyan-400 bg-cyan-500/10 border-cyan-500/30";
      case "clickhouse":
        return "text-yellow-400 bg-yellow-500/10 border-yellow-500/30";
      default:
        return "text-slate-400 bg-slate-500/10 border-slate-500/30";
    }
  };

  return (
    <div className="flex h-screen bg-[#0F1115] text-slate-200 font-sans selection:bg-blue-500/30 overflow-hidden">
      {/* --- Sidebar --- */}
      <aside
        className={`${
          sidebarOpen ? "w-72" : "w-0"
        } bg-[#16191F] border-r border-slate-800 transition-all duration-300 flex flex-col overflow-hidden shrink-0`}
      >
        <div className="p-6 flex items-center gap-3 border-b border-slate-800">
          <div className="bg-blue-600 p-2 rounded-lg">
            <Database className="w-5 h-5 text-white" />
          </div>
          <span className="font-bold text-lg tracking-tight">
            Text To SQL Studio
          </span>
        </div>

        <nav className="flex-1 overflow-y-auto p-4 space-y-6 custom-scrollbar">
          {/* Database Engine Selector */}
          <div>
            <h3 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-3 flex items-center gap-2">
              <Layers className="w-3 h-3" /> Select Engine
            </h3>

            {/* Enabled: Postgres + Spark. Disabled: MySQL + ClickHouse */}
            <div className="grid grid-cols-2 gap-2 p-1 bg-slate-900/60 rounded-xl border border-slate-800">
              {[
                { key: "postgres", label: "PostgreSQL", enabled: true },
                { key: "spark", label: "Spark", enabled: true },
                { key: "mysql", label: "MySQL", enabled: false },
                { key: "clickhouse", label: "ClickHouse", enabled: false },
              ].map((item) => (
                <button
                  key={item.key}
                  onClick={() => item.enabled && setDbEngine(item.key)}
                  disabled={!item.enabled}
                  className={`py-2 text-[10px] font-bold uppercase rounded-lg transition-all flex items-center justify-center gap-1.5 ${
                    !item.enabled
                      ? "opacity-40 cursor-not-allowed text-slate-500"
                      : dbEngine === item.key
                      ? item.key === "spark"
                        ? "bg-orange-600 text-white shadow-lg"
                        : "bg-blue-600 text-white shadow-lg"
                      : "text-slate-500 hover:text-slate-300"
                  }`}
                  title={!item.enabled ? "Coming soon" : ""}
                >
                  {item.key === "spark" && <Zap className="w-3 h-3" />}
                  {item.label}
                  {!item.enabled && (
                    <span className="ml-1 rounded border border-slate-700 px-1.5 py-0.5 text-[8px]">
                      soon
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Traditional DB Configuration (postgres, mysql, clickhouse) */}
          {dbEngine !== "spark" && (
            <div>
              <h3 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-3 flex items-center gap-2">
                <Settings2 className="w-3 h-3" /> {dbEngine.toUpperCase()} Config
              </h3>
              <div className="space-y-3 bg-slate-900/40 p-4 rounded-xl border border-slate-800">
                <div className="space-y-1">
                  <label className="text-[9px] text-slate-500 uppercase">
                    Host
                  </label>
                  <div className="relative">
                    <Server className="absolute left-2.5 top-2.5 w-3 h-3 text-slate-600" />
                    <input
                      type="text"
                      className="w-full bg-[#0F1115] border border-slate-700 rounded-lg pl-8 pr-2 py-1.5 text-xs outline-none focus:border-blue-500 transition"
                      placeholder="localhost"
                      value={dbConfig.host}
                      onChange={(e) =>
                        setDbConfig({ ...dbConfig, host: e.target.value })
                      }
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div className="space-y-1">
                    <label className="text-[9px] text-slate-500 uppercase">
                      Port
                    </label>
                    <input
                      type="text"
                      className="w-full bg-[#0F1115] border border-slate-700 rounded-lg px-2 py-1.5 text-xs outline-none focus:border-blue-500 transition"
                      value={dbConfig.port}
                      onChange={(e) =>
                        setDbConfig({ ...dbConfig, port: e.target.value })
                      }
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[9px] text-slate-500 uppercase">
                      Database
                    </label>
                    <input
                      type="text"
                      className="w-full bg-[#0F1115] border border-slate-700 rounded-lg px-2 py-1.5 text-xs outline-none focus:border-blue-500 transition"
                      placeholder="name"
                      value={dbConfig.database}
                      onChange={(e) =>
                        setDbConfig({ ...dbConfig, database: e.target.value })
                      }
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[9px] text-slate-500 uppercase">
                    User
                  </label>
                  <input
                    type="text"
                    className="w-full bg-[#0F1115] border border-slate-700 rounded-lg px-2 py-1.5 text-xs outline-none focus:border-blue-500 transition"
                    value={dbConfig.user}
                    onChange={(e) =>
                      setDbConfig({ ...dbConfig, user: e.target.value })
                    }
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[9px] text-slate-500 uppercase">
                    Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-2.5 top-2.5 w-3 h-3 text-slate-600" />
                    <input
                      type={showPassword ? "text" : "password"}
                      className="w-full bg-[#0F1115] border border-slate-700 rounded-lg pl-8 pr-8 py-1.5 text-xs outline-none focus:border-blue-500 transition"
                      value={dbConfig.password}
                      onChange={(e) =>
                        setDbConfig({ ...dbConfig, password: e.target.value })
                      }
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-2 top-2 text-slate-600 hover:text-slate-400"
                    >
                      {showPassword ? (
                        <EyeOff className="w-3.5 h-3.5" />
                      ) : (
                        <Eye className="w-3.5 h-3.5" />
                      )}
                    </button>
                  </div>
                </div>

                <div className="bg-slate-800/20 border border-slate-800 rounded-lg p-2">
                  <p className="text-[10px] text-slate-500 leading-relaxed">
                    Note: Direct DB execution may be limited right now due to high
                    demand. You can still generate queries (and run them on your DB).
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Spark Configuration */}
          {dbEngine === "spark" && (
            <div>
              <h3 className="text-[10px] font-bold text-orange-400 uppercase tracking-widest mb-3 flex items-center gap-2">
                <Zap className="w-3 h-3" /> Spark Config
              </h3>
              <div className="space-y-3 bg-orange-900/10 p-4 rounded-xl border border-orange-500/20">
                {/* Catalog */}
                <div className="space-y-1">
                  <label className="text-[9px] text-slate-500 uppercase">
                    Catalog (Optional)
                  </label>
                  <input
                    type="text"
                    className="w-full bg-[#0F1115] border border-slate-700 rounded-lg px-2 py-1.5 text-xs outline-none focus:border-orange-500 transition"
                    placeholder="e.g., hive_metastore"
                    value={sparkConfig.catalog}
                    onChange={(e) =>
                      setSparkConfig({ ...sparkConfig, catalog: e.target.value })
                    }
                  />
                  <p className="text-[8px] text-slate-600 italic">
                    Leave empty if not using Unity Catalog
                  </p>
                </div>

                {/* Database */}
                <div className="space-y-1">
                  <label className="text-[9px] text-slate-500 uppercase">
                    Database
                  </label>
                  <input
                    type="text"
                    className="w-full bg-[#0F1115] border border-slate-700 rounded-lg px-2 py-1.5 text-xs outline-none focus:border-orange-500 transition"
                    placeholder="default"
                    value={sparkConfig.database}
                    onChange={(e) =>
                      setSparkConfig({
                        ...sparkConfig,
                        database: e.target.value,
                      })
                    }
                  />
                </div>

                {/* Schema Endpoint - Collapsible */}
                <div className="border-t border-slate-700/50 pt-3">
                  <button
                    type="button"
                    onClick={() => setShowSparkEndpoint(!showSparkEndpoint)}
                    className="w-full flex items-center justify-between text-[9px] text-slate-400 uppercase hover:text-slate-300 transition"
                  >
                    <span className="flex items-center gap-1.5">
                      <Globe className="w-3 h-3" /> Schema Endpoint
                    </span>
                    <ChevronDown
                      className={`w-3 h-3 transition-transform ${
                        showSparkEndpoint ? "rotate-180" : ""
                      }`}
                    />
                  </button>
                  {showSparkEndpoint && (
                    <div className="mt-2 space-y-1">
                      <input
                        type="text"
                        className="w-full bg-[#0F1115] border border-slate-700 rounded-lg px-2 py-1.5 text-xs outline-none focus:border-orange-500 transition"
                        placeholder="https://your-api.com/schema"
                        value={sparkConfig.schemaEndpoint}
                        onChange={(e) =>
                          setSparkConfig({
                            ...sparkConfig,
                            schemaEndpoint: e.target.value,
                          })
                        }
                      />
                      <p className="text-[8px] text-slate-600 italic">
                        External API to fetch table schemas
                      </p>
                    </div>
                  )}
                </div>

                {/* Manual Schema - Collapsible */}
                <div className="border-t border-slate-700/50 pt-3">
                  <button
                    type="button"
                    onClick={() => setShowSparkSchema(!showSparkSchema)}
                    className="w-full flex items-center justify-between text-[9px] text-slate-400 uppercase hover:text-slate-300 transition"
                  >
                    <span className="flex items-center gap-1.5">
                      <FileCode className="w-3 h-3" /> Manual Schema
                    </span>
                    <ChevronDown
                      className={`w-3 h-3 transition-transform ${
                        showSparkSchema ? "rotate-180" : ""
                      }`}
                    />
                  </button>
                  {showSparkSchema && (
                    <div className="mt-2 space-y-1">
                      <textarea
                        className="w-full bg-[#0F1115] border border-slate-700 rounded-lg px-2 py-1.5 text-xs outline-none focus:border-orange-500 transition font-mono resize-none"
                        rows={4}
                        placeholder={`[
  {"table": "users", "column_name": "id", "data_type": "BIGINT"},
  {"table": "users", "column_name": "name", "data_type": "STRING"}
]`}
                        value={sparkConfig.schema}
                        onChange={(e) =>
                          setSparkConfig({ ...sparkConfig, schema: e.target.value })
                        }
                      />
                      <p className="text-[8px] text-slate-600 italic">
                        JSON array of column definitions
                      </p>
                    </div>
                  )}
                </div>

                {/* Spark Info Notice */}
                <div className="bg-orange-500/5 border border-orange-500/20 rounded-lg p-2 mt-2">
                  <p className="text-[9px] text-orange-400/80 leading-relaxed">
                    ⚡ Spark SQL will be generated but not executed. Use the generated
                    query in your Spark cluster.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Table Metadata */}
          <div>
            <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-widest mb-4 flex items-center gap-2">
              <TableIcon className="w-3 h-3" /> Active Tables
            </h3>
            <div className="space-y-2">
              {response?.metadata?.found_in_db?.map((table, i) => (
                <div
                  key={i}
                  className="flex items-center gap-2 text-sm text-slate-400 bg-slate-800/40 p-2 rounded-md border border-slate-700/50"
                >
                  <div className="w-2 h-2 rounded-full bg-green-500" />
                  {table}
                </div>
              ))}
              {(!response?.metadata?.found_in_db ||
                response.metadata.found_in_db.length === 0) && (
                <p className="text-xs text-slate-600 italic">
                  No schema context loaded
                </p>
              )}
            </div>
          </div>

          {/* History */}
          <div>
            <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-widest mb-4 flex items-center gap-2">
              <History className="w-3 h-3" /> Recent
            </h3>
            <div className="space-y-3">
              {history.map((item) => (
                <button
                  key={item.id}
                  onClick={() => {
                    setQuestion(item.question);
                    if (item.engine) setDbEngine(item.engine);
                  }}
                  className="w-full text-left p-3 rounded-lg bg-slate-800/20 hover:bg-slate-800/50 border border-slate-800 transition group"
                >
                  <div className="flex items-center gap-2 mb-1">
                    <p className="text-xs text-slate-300 truncate flex-1 group-hover:text-blue-400">
                      {item.question}
                    </p>
                    {item.engine && (
                      <span
                        className={`text-[8px] px-1.5 py-0.5 rounded border ${getEngineColor(
                          item.engine
                        )}`}
                      >
                        {item.engine}
                      </span>
                    )}
                  </div>
                  <span className="text-[10px] text-slate-600 uppercase">
                    {item.timestamp}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </nav>

        <div className="p-4 border-t border-slate-800">
          <div className="bg-slate-800/30 p-4 rounded-xl text-center">
            <p className="text-xs text-slate-500 uppercase font-bold tracking-tighter">
              Connected via n8n
            </p>
          </div>
        </div>
      </aside>

      {/* --- Main Content (Query & Results) --- */}
      <main className="flex-1 flex flex-col min-w-0 bg-[#0F1115] relative">
        {/* Announcement Bar */}
        <div className="border-b border-slate-800 bg-[#12151B] px-6 py-2 text-xs text-slate-300">
          <div className="mx-auto max-w-6xl flex flex-col md:flex-row md:items-center md:justify-between gap-2">
            <div className="leading-relaxed">
              <span className="font-semibold text-slate-100 mr-2">
                {ANNOUNCEMENT.title}:
              </span>
              {ANNOUNCEMENT.text}
              <span className="font-semibold text-slate-100">
                {ANNOUNCEMENT.demoTables.join(" & ")}
              </span>
              {ANNOUNCEMENT.more}
              <a
                className="underline underline-offset-2 hover:text-white"
                href={`mailto:${ANNOUNCEMENT.email}?subject=Text%20to%20SQL%20-%20DB%20Integration%20Request`}
              >
                {ANNOUNCEMENT.email}
              </a>
              <span className="ml-2 text-slate-400">{ANNOUNCEMENT.extra}</span>
            </div>

            <div className="flex items-center gap-2">
              <a
                href="/natural-language-to-sql"
                className="px-3 py-1 rounded-lg border border-slate-800 hover:bg-slate-800/40 transition"
              >
                NL → SQL Guide
              </a>
              <a
                href="/blog"
                className="px-3 py-1 rounded-lg border border-slate-800 hover:bg-slate-800/40 transition"
              >
                Blog
              </a>
            </div>
          </div>
        </div>

        <header className="h-16 border-b border-slate-800 flex items-center justify-between px-8 bg-[#16191F]/50 backdrop-blur-md">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2 hover:bg-slate-800 rounded-md transition"
            >
              <ChevronRight
                className={`w-5 h-5 transition-transform ${
                  sidebarOpen ? "rotate-180" : ""
                }`}
              />
            </button>
            <div className="h-4 w-px bg-slate-800" />
            <span className="text-sm font-medium text-slate-400 flex items-center gap-2">
              Workspace /
              <span
                className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded border ${getEngineColor(
                  dbEngine
                )}`}
              >
                {getEngineIcon(dbEngine)}
                {dbEngine.toUpperCase()} Studio
              </span>
            </span>
          </div>

          <div className="flex items-center gap-3">
            <a
              href="/blog"
              className="text-xs font-semibold text-slate-300 hover:text-white px-3 py-1.5 rounded-lg border border-slate-800 hover:bg-slate-800/40 transition"
            >
              Blog
            </a>

            <div
              className={`px-3 py-1 rounded-full text-[10px] font-bold tracking-tighter uppercase ${
                isLoading
                  ? "bg-blue-500/10 text-blue-400 animate-pulse"
                  : "bg-slate-800 text-slate-500"
              }`}
            >
              {isLoading ? "Generating SQL..." : "System Ready"}
            </div>
          </div>
        </header>

        {/* Input Area */}
        <div className="p-8 pb-0 shrink-0">
          <div
            className={`bg-[#16191F] rounded-2xl border ${
              dbEngine === "spark"
                ? "border-orange-500/30"
                : "border-slate-800"
            } p-6 shadow-2xl relative overflow-hidden group`}
          >
            <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-6">
              <div className="lg:col-span-3 space-y-4">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                  Target Tables
                </label>
                <input
                  type="text"
                  placeholder={
                    dbEngine === "spark"
                      ? "e.g. catalog.db.table"
                      : "e.g. employee, orders"
                  }
                  value={tables}
                  onChange={(e) => setTables(e.target.value)}
                  className={`w-full bg-[#0F1115] border border-slate-700 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 ${
                    dbEngine === "spark"
                      ? "focus:ring-orange-500/50"
                      : "focus:ring-blue-500/50"
                  } transition`}
                />
                <p className="text-[10px] text-slate-500 leading-relaxed">
                  Demo tables:{" "}
                  <span className="text-slate-300 font-semibold">employee</span>,{" "}
                  <span className="text-slate-300 font-semibold">orders</span>
                </p>
              </div>

              <div className="lg:col-span-7 space-y-4">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                  Natural Language Query
                </label>
                <div className="relative">
                  <Search className="absolute left-4 top-3.5 w-4 h-4 text-slate-600" />
                  <input
                    type="text"
                    placeholder={`Ask something about your ${dbEngine} data...`}
                    value={question}
                    onChange={(e) => setQuestion(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleExecute()}
                    className={`w-full bg-[#0F1115] border border-slate-700 rounded-xl pl-12 pr-4 py-3 text-sm focus:outline-none focus:ring-2 ${
                      dbEngine === "spark"
                        ? "focus:ring-orange-500/50"
                        : "focus:ring-blue-500/50"
                    } transition`}
                  />
                </div>
                <p className="text-[10px] text-slate-500 leading-relaxed">
                  Tip: If you want query for your own tables, enter table name(s) and
                  a clear question (filters, dates, top N, etc.).
                </p>
              </div>

              <div className="lg:col-span-2 flex items-end">
                <button
                  onClick={handleExecute}
                  disabled={isLoading}
                  className={`w-full ${
                    dbEngine === "spark"
                      ? "bg-orange-600 hover:bg-orange-500 shadow-orange-900/20"
                      : "bg-blue-600 hover:bg-blue-500 shadow-blue-900/20"
                  } disabled:bg-slate-700 text-white rounded-xl py-3 px-6 font-bold flex items-center justify-center gap-2 transition-all shadow-lg`}
                >
                  {isLoading ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : dbEngine === "spark" ? (
                    <Zap className="w-4 h-4" />
                  ) : (
                    <Play className="w-4 h-4 fill-current" />
                  )}
                  {dbEngine === "spark" ? "Generate" : "Run"}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Output/Table Area */}
        {/* CHANGED: overflow-y-auto so the whole output section scrolls, letting Result Set expand fully */}
        <div className="flex-1 p-8 overflow-y-auto custom-scrollbar flex flex-col gap-6">
          {response && (
            <>
              <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 shrink-0">
                <div className="bg-[#16191F] rounded-2xl border border-slate-800 flex flex-col overflow-hidden">
                  <div className="px-5 py-3 border-b border-slate-800 flex justify-between items-center bg-slate-900/20">
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2">
                      {response.engine === "spark" && (
                        <Zap className="w-3 h-3 text-orange-400" />
                      )}
                      AI Generated {response.engine === "spark" ? "Spark " : ""}SQL
                    </span>
                    <button
                      onClick={() => copyToClipboard(response.query)}
                      className={`p-1.5 rounded transition ${
                        copied
                          ? "text-green-500 bg-green-500/10"
                          : "text-slate-500 hover:text-white hover:bg-slate-800"
                      }`}
                    >
                      {copied ? (
                        <Check className="w-3.5 h-3.5" />
                      ) : (
                        <Copy className="w-3.5 h-3.5" />
                      )}
                    </button>
                  </div>
                  <div className="p-5 font-mono text-sm max-h-[150px] overflow-y-auto custom-scrollbar">
                    <code
                      className={`${
                        response.engine === "spark"
                          ? "text-orange-400"
                          : "text-blue-400"
                      } block whitespace-pre-wrap`}
                    >
                      {response.query}
                    </code>
                  </div>
                </div>

                <div className="bg-[#16191F] rounded-2xl border border-slate-800 flex flex-col overflow-hidden">
                  <div className="px-5 py-3 border-b border-slate-800 bg-slate-900/20">
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                      Execution Status
                    </span>
                  </div>
                  <div className="p-5 flex-1 flex flex-col justify-center">
                    {response.engine === "spark" ? (
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-orange-500/10">
                          <Zap className="text-orange-400 w-5 h-5" />
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-orange-400">
                            Spark SQL Generated
                          </p>
                          <p className="text-xs text-slate-500">
                            Query ready for your Spark cluster. Execution not performed.
                          </p>
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-center gap-3">
                        {response.success ? (
                          <CheckCircle2 className="text-green-500" />
                        ) : (
                          <AlertTriangle className="text-yellow-500" />
                        )}
                        <div>
                          <p className="text-sm font-semibold">
                            {response.success ? "Query Success" : "Execution Warning"}
                          </p>
                          <p className="text-xs text-slate-500">
                            {response.success
                              ? `Data retrieved from ${dbEngine}`
                              : "There was an issue executing the SQL."}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Results Table - Hidden for Spark */}
              {response.engine !== "spark" && (
                // CHANGED: removed flex-1 + overflow-hidden, now shrink-0 with fixed min/max height and internal scroll
                <div className="bg-[#16191F] rounded-2xl border border-slate-800 flex flex-col shadow-2xl shrink-0">
                  <div className="px-6 py-4 border-b border-slate-800 flex justify-between items-center bg-slate-800/20">
                    <h2 className="text-sm font-bold flex items-center gap-2">
                      <Terminal className="w-4 h-4 text-blue-500" /> Result Set
                      <span className="ml-2 px-2 py-0.5 rounded-full bg-slate-800 text-[10px] text-slate-400">
                        {response.results?.length || 0} rows
                      </span>
                    </h2>
                  </div>

                  {/* CHANGED: overflow-auto with minHeight 300px and maxHeight 420px for scroll when >5 rows */}
                  <div
                    className="overflow-auto custom-scrollbar"
                    style={{ minHeight: "300px", maxHeight: "420px" }}
                  >
                    {response.results?.length > 0 ? (
                      <table className="w-full text-left border-collapse">
                        <thead className="sticky top-0 z-20 bg-[#1A1E24]">
                          <tr>
                            {getColumns().map((col) => (
                              <th
                                key={col}
                                className="px-6 py-4 text-[10px] font-bold text-slate-500 uppercase border-b border-slate-800 whitespace-nowrap"
                              >
                                {col}
                              </th>
                            ))}
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-800/50">
                          {response.results.map((row, idx) => (
                            <tr
                              key={idx}
                              className="hover:bg-blue-500/[0.02] transition-colors"
                            >
                              {getColumns().map((col) => (
                                <td
                                  key={col}
                                  className="px-6 py-4 text-sm text-slate-400 whitespace-nowrap"
                                >
                                  {row[col] === null ? (
                                    <span className="text-slate-700 italic">
                                      null
                                    </span>
                                  ) : (
                                    String(row[col])
                                  )}
                                </td>
                              ))}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    ) : (
                      <div className="h-full flex flex-col items-center justify-center text-slate-600 gap-4 py-16">
                        <Terminal className="w-12 h-12 opacity-20" />
                        <p className="text-sm italic">
                          No data returned for this query
                        </p>
                      </div>
                    )}
                  </div>

                  {/* ADDED: subtle footer hint when rows exceed 5 */}
                  {response.results?.length > 5 && (
                    <div className="px-6 py-2 border-t border-slate-800 bg-slate-900/20">
                      <p className="text-[10px] text-slate-600">
                        Showing all {response.results.length} rows · scroll to view more
                      </p>
                    </div>
                  )}
                </div>
              )}

              {/* Spark-specific: Show instructions instead of results */}
              {response.engine === "spark" && (
                <div className="flex-1 bg-[#16191F] rounded-2xl border border-orange-500/20 flex flex-col overflow-hidden shadow-2xl">
                  <div className="px-6 py-4 border-b border-slate-800 flex justify-between items-center bg-orange-500/5">
                    <h2 className="text-sm font-bold flex items-center gap-2 text-orange-400">
                      <Zap className="w-4 h-4" /> Spark SQL Ready
                    </h2>
                  </div>

                  <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
                    <div className="bg-orange-500/10 p-6 rounded-full mb-6">
                      <Zap className="w-12 h-12 text-orange-400" />
                    </div>
                    <h3 className="text-xl font-bold text-slate-300 mb-2">
                      Query Generated Successfully
                    </h3>
                    <p className="text-sm text-slate-500 max-w-md mb-6">
                      Your Spark SQL query has been generated. Copy the SQL above
                      and execute it in your Spark environment (Databricks, EMR, etc.).
                    </p>
                    <button
                      onClick={() => copyToClipboard(response.query)}
                      className="bg-orange-600 hover:bg-orange-500 text-white rounded-xl py-3 px-6 font-bold flex items-center gap-2 transition-all"
                    >
                      <Copy className="w-4 h-4" />
                      Copy Spark SQL
                    </button>
                  </div>
                </div>
              )}
            </>
          )}

          {!response && !isLoading && (
            <div className="flex-1 flex flex-col items-center justify-center space-y-6">
              <div
                className={`bg-slate-800/30 p-8 rounded-full border ${
                  dbEngine === "spark"
                    ? "border-orange-500/20"
                    : "border-slate-800"
                }`}
              >
                {dbEngine === "spark" ? (
                  <Zap className="w-16 h-16 text-orange-500/50" />
                ) : (
                  <Terminal className="w-16 h-16 text-slate-700" />
                )}
              </div>

              <div className="text-center">
                <h3 className="text-xl font-bold text-slate-400">
                  Ready to {dbEngine === "spark" ? "Generate" : "Query"}{" "}
                  {dbEngine.toUpperCase()}
                </h3>
                <p className="text-sm text-slate-600 mt-2 max-w-sm">
                  {dbEngine === "spark"
                    ? "Enter your tables and ask a question. The AI will generate optimized Spark SQL for your cluster."
                    : `Enter your tables and ask a question. The AI will translate it into optimized ${dbEngine} syntax.`}
                </p>

                {/* How-to section */}
                <div className="mt-6 max-w-xl text-left bg-slate-800/20 border border-slate-800 rounded-2xl p-5">
                  <h4 className="text-sm font-bold text-slate-300 mb-2">
                    How to try this demo
                  </h4>
                  <ul className="text-sm text-slate-500 space-y-2 list-disc pl-5">
                    <li>
                      Demo tables:{" "}
                      <span className="text-slate-300 font-semibold">
                        employee
                      </span>{" "}
                      and{" "}
                      <span className="text-slate-300 font-semibold">orders</span>
                      .
                    </li>
                    <li>
                      For your own schema: enter table name(s) in{" "}
                      <span className="text-slate-300">Target Tables</span> and
                      write your question.
                    </li>
                    <li>
                      Supported now:{" "}
                      <span className="text-blue-400 font-semibold">
                        PostgreSQL
                      </span>{" "}
                      and{" "}
                      <span className="text-orange-400 font-semibold">
                        Spark SQL
                      </span>
                      .
                    </li>
                    <li>
                      Want full DB integration? Email{" "}
                      <a
                        className="underline underline-offset-2 hover:text-slate-200"
                        href="mailto:thagau508@gmail.com?subject=Text%20to%20SQL%20-%20DB%20Integration%20Request"
                      >
                        thagau508@gmail.com
                      </a>
                      .
                    </li>
                    <li>
                      Learn:{" "}
                      <a
                        className="underline underline-offset-2 hover:text-slate-200"
                        href="/natural-language-to-sql"
                      >
                        Natural Language → SQL guide
                      </a>{" "}
                      •{" "}
                      <a
                        className="underline underline-offset-2 hover:text-slate-200"
                        href="/blog"
                      >
                        Blog
                      </a>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* --- Toast --- */}
      {showToast && (
        <div className="fixed bottom-6 right-6 flex items-center gap-3 bg-slate-800 border border-slate-700 px-4 py-3 rounded-xl shadow-2xl z-50">
          <CheckCircle2 className="w-4 h-4 text-green-500" />
          <span className="text-sm font-medium">SQL copied to clipboard</span>
        </div>
      )}

      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
          height: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #2d333d;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #3d4451;
        }
      `}</style>
    </div>
  );
};

export default App;
