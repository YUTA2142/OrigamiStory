#!/usr/bin/env node
import { readFile } from "node:fs/promises";
import process from "node:process";
import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const INPUT_PATH = process.argv[2] ?? "./problems-export.json";

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
  console.error("Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY");
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
  auth: { persistSession: false }
});

function normalizeProblem(problem) {
  return {
    svg: problem.svg,
    grid: problem.grid,
    story: problem.story ?? "",
    story_en: problem.story_en ?? problem.storyEn ?? "",
    created_at: problem.createdAt ?? problem.created_at ?? new Date().toISOString()
  };
}

async function main() {
  const raw = await readFile(INPUT_PATH, "utf8");
  const parsed = JSON.parse(raw);
  const list = Array.isArray(parsed) ? parsed : parsed.items;
  if (!Array.isArray(list)) {
    throw new Error("Input JSON must be an array or { items: [...] }");
  }

  const rows = list.map(normalizeProblem);

  const { error } = await supabase.from("problems").insert(rows);
  if (error) {
    throw error;
  }

  console.log(`Inserted ${rows.length} rows into public.problems`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
