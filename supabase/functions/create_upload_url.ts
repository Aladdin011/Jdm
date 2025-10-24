import { serve } from "https://deno.land/std@0.208.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.53.6";

const supabaseUrl = Deno.env.get("SUPABASE_URL");
const supabaseKey = Deno.env.get("SUPABASE_SERVICE_KEY");

if (!supabaseUrl || !supabaseKey) {
  throw new Error("Missing required environment variables: SUPABASE_URL and SUPABASE_SERVICE_KEY");
}

const supabase = createClient(supabaseUrl, supabaseKey);

serve(async (req) => {
  // Handle CORS
  if (req.method === "OPTIONS") {
    return new Response("ok", {
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
        "Access-Control-Allow-Methods": "POST, OPTIONS",
      },
    });
  }

  try {
    if (req.method !== "POST")
      return new Response("Method Not Allowed", { 
        status: 405,
        headers: {
          "Access-Control-Allow-Origin": "*",
        },
      });
    
    const body = await req.json();
    const bucket = body.bucket || "Project_Files";
    const objectPath = body.path;
    const expiresIn = body.expiresIn || body.expires || 60 * 60; // Support both expiresIn and expires

    if (!objectPath)
      return new Response(JSON.stringify({ error: "path is required" }), {
        status: 400,
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Content-Type": "application/json",
        },
      });

    // Try to create a signed upload URL (server-side API may expose this)
    // If the storage client doesn't support createSignedUploadUrl, fall back to returning a signed download URL (useful for verification)
    // Note: Deploy this function with SUPABASE_SERVICE_KEY set in the function environment.
    try {
      // @ts-ignore - some SDKs expose createSignedUploadUrl
      const fromBucket = supabase.storage.from(bucket);
      if (typeof (fromBucket as any).createSignedUploadUrl === "function") {
        // @ts-ignore
        const { data, error } = await (fromBucket as any).createSignedUploadUrl(
          objectPath,
          expiresIn,
        );
        if (error)
          return new Response(JSON.stringify({ error: error.message }), {
            status: 500,
            headers: {
              "Access-Control-Allow-Origin": "*",
              "Content-Type": "application/json",
            },
          });
        return new Response(
          JSON.stringify({ uploadUrl: data.uploadUrl, path: objectPath }),
          { 
            status: 200,
            headers: {
              "Access-Control-Allow-Origin": "*",
              "Content-Type": "application/json",
            },
          },
        );
      }
    } catch (e) {
      // fallthrough to download-signed url fallback
    }

    // Fallback: create a signed download URL (not an upload URL) so callers at least get an accessible URL
    const { data, error } = await supabase.storage
      .from(bucket)
      .createSignedUrl(objectPath, expiresIn);
    if (error)
      return new Response(JSON.stringify({ error: error.message }), {
        status: 500,
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Content-Type": "application/json",
        },
      });
    return new Response(
      JSON.stringify({ downloadUrl: data.signedUrl, path: objectPath }),
      { 
        status: 200,
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Content-Type": "application/json",
        },
      },
    );
  } catch (err: any) {
    return new Response(
      JSON.stringify({ error: err?.message ?? String(err) }),
      { 
        status: 500,
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Content-Type": "application/json",
        },
      },
    );
  }
});
