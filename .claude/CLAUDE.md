# プロジェクト設定

## 言語・スタイル
- 日本語で応答
- 説明は簡潔にまとめて
- 条件分岐はツリー形式で説明
- 関数はステップバイステップ形式で説明
- コードを理解するために必要最小限の,React,JavaScriptの内部処理と前提知識を説明
- 具体例は必要最低限で良い
- 変更理由を説明

## 技術構成
React 19.1.1 (JSX) + SCSS Modules + @dnd-kit + Framer Motion + uuid

## コード規則
- 関数コンポーネント（`function Name() {}`）+ デフォルトエクスポート
- props分割代入必須
- スタイルは必ずSCSS Modules（`*.module.scss`）
- ロジックはカスタムフック（`hooks/`）に分離
- 配列操作はイミュータブル（spread, map, filter）

## 禁止
- クラスコンポーネント
- グローバルCSS・インラインstyle
- DOM直接操作（getElementById等）
- TypeScript移行・Redux導入