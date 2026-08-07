import { supabase } from "@/lib/supabase/client";

export default async function TestPage() {
  const { data, error } = await supabase
    .from("test")
    .select("*");

  const isConnected =
    error?.code !== "PGRST205";

  return (
    <main className="p-8">
      <h1 className="text-2xl font-bold mb-6">
        Supabase Connection Test
      </h1>

      {error?.code === "PGRST205" ? (
        <div className="rounded-lg border border-yellow-400 bg-yellow-100 p-4">
          <h2 className="font-bold text-yellow-700">
            ✅ Connected Successfully
          </h2>

          <p className="mt-2">
            Your application is connected to Supabase.
            The table <strong>test</strong> doesn't exist yet.
          </p>

          <pre className="mt-4">
            {JSON.stringify(error, null, 2)}
          </pre>
        </div>
      ) : error ? (
        <div className="rounded-lg border border-red-400 bg-red-100 p-4">
          <h2 className="font-bold text-red-700">
            ❌ Connection Failed
          </h2>

          <pre className="mt-4">
            {JSON.stringify(error, null, 2)}
          </pre>
        </div>
      ) : (
        <div className="rounded-lg border border-green-400 bg-green-100 p-4">
          <h2 className="font-bold text-green-700">
            ✅ Connected Successfully
          </h2>

          <pre className="mt-4">
            {JSON.stringify(data, null, 2)}
          </pre>
        </div>
      )}
    </main>
  );
}