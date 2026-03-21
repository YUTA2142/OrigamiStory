# Supabase へのデータ移行手順（現行データを引き継ぐ）

## 0) いま登録済みの問題はどこにある？

現行アプリの登録データは `localStorage` の `origamiStoryProblems` に保存されています（ブラウザごと・端末ごと）。
つまり **何もしないと Supabase には移りません**。

- 既存ユーザーAのPCデータは、ユーザーBのPCにはありません。
- Supabase移行時は、必要なブラウザからエクスポートして取り込む必要があります。

## 1) ブラウザから既存データをエクスポート

アプリを開いた状態で DevTools Console を開き、次を実行:

```js
copy(localStorage.getItem("origamiStoryProblems") || "[]");
```

貼り付け先に `problems-export.json` として保存します。

## 2) Supabase 側のテーブル作成

まず `docs/supabase_minimal.sql`（または `docs/supabase_setup.sql`）を SQL Editor で実行して、`public.problems` を作成します。

## 3) JSON を Supabase へ投入

### 方法A: Node スクリプト（推奨）

`scripts/migrate_to_supabase.mjs` を使います。

```bash
npm i @supabase/supabase-js
SUPABASE_URL="https://<project-ref>.supabase.co" \
SUPABASE_SERVICE_ROLE_KEY="<service-role-key>" \
node scripts/migrate_to_supabase.mjs ./problems-export.json
```

> `SERVICE_ROLE_KEY` は秘密情報です。**ブラウザに絶対埋め込まない**でください。

### 方法B: Table Editor からJSON取り込み

Table Editor の `public.problems` で Import してもOKですが、
`grid` の型（enum 2次元配列）整形で手間が出ることがあるため、方法Aが確実です。

## 4) APIキー/プロジェクトキーはどう使う？

- **Project URL** (`https://<project-ref>.supabase.co`)  
  - フロント/サーバーどちらでも利用可。
- **anon public key**  
  - フロントエンド用。RLS 前提で公開して使うキー。
- **service_role key**  
  - サーバー専用の管理キー。全権限に近い。クライアント配布禁止。

### フロント側（このアプリ）

`SUPABASE_URL` + `SUPABASE_ANON_KEY` を使います。  
管理操作は Supabase Auth のログインユーザー + RLS で制御します。

### 移行バッチ/管理スクリプト

`SUPABASE_URL` + `SUPABASE_SERVICE_ROLE_KEY` を使います。  
ローカル実行またはサーバー実行に限定し、`.env` で管理してください。

## 5) 移行後の切り替え

- 読み込み元を `localStorage` から `supabase.from("problems")` へ切り替える。
- 本番公開前に、問題一覧件数が一致するかを確認する。
