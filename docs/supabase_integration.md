# OrigamiStory を Supabase 連携する手順

このアプリは現在 `localStorage` (`origamiStoryProblems`) を使って問題を保存しています。`app.js` 内の保存・読込・削除の流れに合わせると、Supabase では `public.problems` テーブルを使うと同じ挙動を再現できます。

## 1. テーブル作成

1. Supabase の SQL Editor を開く
2. `docs/supabase_setup.sql` を実行する

## 2. JavaScript 側で置き換えるポイント

`app.js` の以下を置き換えると、動きはほぼそのままです。

- `getStoredProblems()` → `supabase.from('problems').select('*').order('created_at', { ascending: false })`
- `setStoredProblems()` → 不要（DB 書き込み API に置換）
- `handleRegister()` の `problems.push(payload)` → `insert`
- `renderRegisteredProblems()` の削除処理 (`splice`) → `delete().eq('id', problem.id)`

## 3. 最小 API サンプル

```js
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

async function fetchProblems() {
  const { data, error } = await supabase
    .from("problems")
    .select("id, svg, grid, story, created_at")
    .order("created_at", { ascending: false });
  if (error) throw error;
  return data ?? [];
}

async function createProblem({ svg, grid, story }) {
  const { data, error } = await supabase
    .from("problems")
    .insert([{ svg, grid, story }])
    .select("id, svg, grid, story, created_at")
    .single();
  if (error) throw error;
  return data;
}

async function deleteProblem(id) {
  const { error } = await supabase.from("problems").delete().eq("id", id);
  if (error) throw error;
}
```

## 4. 注意点（現行仕様に合わせる）

- 判定ロジックは現状「マスごとの完全一致」ではなく、`square` と `triangle` の**個数一致**です。
- `triangle-ne/nw/se/sw` は判定時にすべて `triangle` として扱われます。
- 管理者パスワードは今はフロント固定文字列なので、運用時は Supabase Auth へ寄せるのがおすすめです。

## 5. よくあるエラー

- `cannot use subquery in check constraint`
  - PostgreSQL の制約で直接 subquery を使えないためです。
  - 本リポジトリの SQL は `grid_has_non_empty(...)` 関数を作成し、`CHECK (grid_has_non_empty(grid))` で回避しています。


## 6. とりあえずテーブルだけ作りたい場合

`docs/supabase_minimal.sql` を使ってください。`problems` テーブル作成に必要な最小セットだけを含みます。


## 7. 既存localStorageデータの移行

既存データを引き継ぐ場合は `docs/supabase_data_migration.md` を参照してください。
APIキー（anon / service_role）の使い分けも記載しています。
