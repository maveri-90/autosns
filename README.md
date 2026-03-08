# SNS Post Calendar

AIがSNS投稿ネタを自動提案・投稿文を自動生成するSaaSアプリ。個人事業主・フリーランスのSNS運用を効率化します。

**本番URL:** https://autosns-umber.vercel.app

---

## 主な機能

- **AIネタ提案** — 業種・ターゲット・トーンを設定するだけで今月の投稿ネタを20件自動生成
- **投稿文生成** — X・Instagram・Threads向けに最適化した投稿文をワンクリックで生成
- **投稿カレンダー** — 投稿スケジュールをカレンダーで一元管理
- **Googleログイン** — Googleアカウントでかんたん登録・ログイン
- **Stripe決済** — プロプラン（月¥1,980）の決済対応

---

## 技術スタック

| カテゴリ | 技術 |
|--------|------|
| フロントエンド | Nuxt 3 + Tailwind CSS |
| 認証・DB | Supabase |
| AI | Anthropic API（Claude Sonnet） |
| 決済 | Stripe |
| メール | Resend |
| デプロイ | Vercel |

---

## 料金プラン

| プラン | 価格 | ネタ生成 | 投稿文生成 |
|------|------|--------|---------|
| フリー | ¥0 | 月3回 | 月10回 |
| プロ | ¥1,980/月 | 無制限 | 無制限 |

---

## 開発環境のセットアップ

```bash
# 依存パッケージのインストール
npm install

# 開発サーバー起動（http://localhost:3000）
npm run dev
```

### 必要な環境変数

`.env` ファイルをプロジェクトルートに作成:

```env
SUPABASE_URL=...
SUPABASE_KEY=...
SUPABASE_SERVICE_KEY=...
ANTHROPIC_API_KEY=...
STRIPE_SECRET_KEY=...
STRIPE_WEBHOOK_SECRET=...
RESEND_API_KEY=...
```

---

## ブランチ運用

| ブランチ | 用途 |
|--------|------|
| `develop` | 開発・プレビュー（push時にVercelプレビューURL生成） |
| `main` | 本番（マージ時に自動デプロイ） |

---

## ディレクトリ構成

```
app/
  pages/         # ページコンポーネント
  middleware/    # 認証ミドルウェア
server/
  api/           # サーバーサイドAPI
public/          # 静的ファイル（アイコン等）
```

---

## ライセンス

Private
