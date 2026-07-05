# Stripe決済後の会員コンテンツ自動付与

Stripe決済が完了したら、購入者のメールアドレスにGoogle Driveの会員コンテンツ閲覧権限を付与し、案内メールを自動送信する仕組みです。

## できること

1. Stripe決済完了を受け取る
2. 購入者メールアドレスを取得する
3. Google Driveの `AI LIFE ACADEMY_会員コンテンツ` フォルダに閲覧権限を付与する
4. 購入者へ会員コンテンツURL入りの案内メールを送る
5. スプレッドシートに購入者履歴を残す
6. 返金イベントを受け取ったら、閲覧権限を削除する

## 前提

- 決済サービスはStripeを想定
- 会員コンテンツフォルダ:
  - `https://drive.google.com/drive/folders/1dVWdYweunGZFYTcCIen3xcdrnMBsKh00`
- Apps Scriptはスプレッドシートに紐づけて使う
- 購入者に見せたくない管理資料は、会員コンテンツフォルダの外に置く

## 初回設定

### 1. Stripeで決済リンクを作る

StripeのPayment Linksで `AI LIFE ACADEMY` の決済リンクを作ります。

- 商品名: `AI LIFE ACADEMY`
- 価格: `165,000円`
- 税込表示
- 決済時にメールアドレスを取得

Payment LinksはStripeの管理画面から作れます。

### 2. スプレッドシートを作る

Google Driveで `AI LIFE ACADEMY_購入者管理` というスプレッドシートを作ります。

### 3. Apps Scriptを貼る

1. スプレッドシートを開く
2. `拡張機能` → `Apps Script`
3. `stripe-member-access.gs` の中身を貼り付ける
4. 保存する

### 4. Stripe秘密鍵を設定する

Apps Scriptの左メニューから `プロジェクトの設定` を開き、スクリプト プロパティに以下を追加します。

```text
STRIPE_SECRET_KEY = sk_live_...
```

テスト中は `sk_test_...` を使います。

### 5. Webアプリとしてデプロイ

Apps Script右上の `デプロイ` → `新しいデプロイ` を押します。

```text
種類: ウェブアプリ
実行ユーザー: 自分
アクセスできるユーザー: 全員
```

デプロイ後に表示される `ウェブアプリURL` をコピーします。

### 6. Stripe Webhookに登録する

Stripe管理画面でWebhookエンドポイントを作ります。

登録するURL:

```text
Apps ScriptのウェブアプリURL
```

受け取るイベント:

```text
checkout.session.completed
charge.refunded
refund.created
```

`checkout.session.completed` は決済完了、`charge.refunded` / `refund.created` は返金時の権限削除に使います。

## 運営が手動でやること

初回だけ必要です。

- Stripeアカウント作成
- Payment Link作成
- Apps Script貼り付け
- Stripe秘密鍵の設定
- Webhook登録
- 初回のGoogle許可

運用開始後は、基本的に自動です。

ただし、次の場合は手動確認が必要です。

- 購入者が決済時と別のGoogleアカウントで見ようとしている
- 返金イベントからメールアドレスを特定できなかった
- 分割返金や例外対応をした
- Google Driveの容量が不足した

## 購入者に届くメール

件名:

```text
【AI LIFE ACADEMY】会員コンテンツのご案内
```

本文には以下が入ります。

- 会員コンテンツURL
- 最初に見るフォルダ
- 学習順序
- アクセスできない時の返信案内

## 注意

Google Driveの親フォルダに閲覧権限を付与するため、親フォルダ内のコンテンツは購入者が閲覧できます。
運営用資料や購入者リストなど、購入者に見せたくないものは親フォルダの外に置くのが安全です。
