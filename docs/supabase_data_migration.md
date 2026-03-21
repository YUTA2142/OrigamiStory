# Supabase へのデータ移行手順（現行データを引き継ぐ）

## 0) いま登録済みの問題はどこにある？

現行アプリの登録データは `localStorage` の `origamiStoryProblems` に保存されています（ブラウザごと・端末ごと）。
つまり **何もしないと Supabase には移りません**。

- 既存ユーザーAのPCデータは、ユーザーBのPCにはありません。
- Supabase移行時は、必要なブラウザからエクスポートして取り込む必要があります。

## 1) ブラウザから既存データをエクスポート

### いちばん安全で簡単な方法（推奨）

管理者画面の「登録済みの宇宙の謎」セクションにある **「JSONを書き出す」** ボタンを押してください。  
`origamiStoryProblems-YYYYMMDD.json` がダウンロードされます。

### どこで実行する？

**OrigamiStory を実際に開いているブラウザの DevTools Console** で実行します。  
（VSCode のターミナルや Supabase SQL Editor ではありません）

- 例: `http://localhost:5500` や公開URLで OrigamiStory を開く
- そのページ上で Console を開く
  - Chrome/Edge: `F12` → **Console**
  - Mac Chrome: `⌥ + ⌘ + I` → **Console**
  - Firefox: `F12` → **Console**

その Console で次を実行:

```js
copy(localStorage.getItem("origamiStoryProblems") || "[]");
```

実行後、JSON文字列がクリップボードへ入るので、テキストエディタに貼り付けて `problems-export.json` として保存します。

> `copy(...)` が使えないブラウザでは、`localStorage.getItem("origamiStoryProblems")` を実行して表示結果を手動コピーしてください。
> `copy(...)` の戻り値は通常 `undefined` です。`undefined` 表示は失敗ではありません。

### 実行確認コマンド

Console で次を実行して、件数が `1` 以上ならデータは存在しています。

```js
JSON.parse(localStorage.getItem("origamiStoryProblems") || "[]").length
```

`0` の場合は、そのブラウザにまだ登録データがない状態です（別PC/別ブラウザにある可能性あり）。
`5` のように `1` 以上が出た場合は、その件数分の問題データが入っています（例: `5` = 5件）。

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
