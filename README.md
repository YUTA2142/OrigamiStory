# OrigamiStory

折り紙パズルを解いて、宇宙の神秘に迫るパズルゲームです。

## ローカルで起動する

このアプリは静的ファイルで動作します。ブラウザで `127.0.0.1` にアクセスする前に、下記のどちらかのコマンドでローカルサーバーを起動してください。

```bash
npm start
```

または、Node.js を使わない場合:

```bash
python3 -m http.server 8000
```

起動後、ブラウザで http://127.0.0.1:8000 を開きます。

## English UI

画面上部の `English` ボタンを押すと、UI表示が英語に切り替わります。選択した言語はブラウザに保存されます。

## デプロイ

GitHub Pages 用のワークフローを追加しています。`main` ブランチへ反映後、GitHub のリポジトリ設定で Pages の Source を `GitHub Actions` にすると自動デプロイできます。手動で再実行したい場合は、Actions の `Deploy static site to GitHub Pages` から `workflow_dispatch` を実行してください。
