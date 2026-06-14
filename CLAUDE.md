# プロジェクト概要
英語学習者向けの、雑学ネタ・英文・英単語を題材にしたタイピング練習Webアプリ
- サイトタイトル：English Typing Game
- キャッチコピー：「ちょっと楽しく、ちょっと賢く。」

## 使っている技術
- Next.js（App Router）
- TypeScript
- Tailwind CSS
- パッケージマネージャー: npm
- スコア保存: localStorage（将来的にDBへ移行予定）

## ブランド
- サイト名：BitFun（ブログ・Webアプリを統合した総合サイトとして展開予定）
- テーマカラー：オレンジ（orange-500 ベース）
- コンセプト：「Bit（ちょっと）× Fun（楽しい）」＝ちょっと楽しい

## ターゲットユーザー
- 英語学習者（正確さ・意味の理解を重視）
- タイピング練習をしたい人
- Webゲームが好きな人

## ゲームモード

### タイムモード
- 初期時間：120秒
- 時間が0になるとゲームオーバー
- ミスしても時間のペナルティなし

#### 連続ノーミスボーナス
- 連続10文字ノーミスで +1秒
- 連続20文字ノーミスで +3秒
- 連続30文字ノーミスで +5秒
- ミスするとカウントがリセット
- 30文字達成後はリセットして最初から数え直し

#### ボーナスゲージ
- 連続ノーミス文字数をゲージで表示
- 第1段階（0〜10文字）：青ゲージ
- 第2段階（10〜20文字）：緑ゲージ
- 第3段階（20〜30文字）：オレンジゲージ
- ボーナス発生時にゲージがリセット・ミス時も即リセット

### フリーモード（長文向け）
- 時間制限なし（ゲームオーバーなし）
- 経過時間をカウントアップで表示
- じっくり読みながらタイプする学習特化モード
- リザルト画面は表示するが、スコア記録には保存しない

## コンテンツ

### カテゴリ
| カテゴリ | 説明 |
|----------|------|
| 雑学（短文） | 1文の雑学ネタ |
| 雑学（長文） | 複数文の説明文 |
| 英文 | 日常フレーズなど（カテゴリID: phrase） |
| 単語 | テーマ別の英単語スペル練習（サブカテゴリあり） |

- モードとカテゴリは独立して選択できる（すべての組み合わせが可能）
- 難易度選択はなし（カテゴリが実質的な難易度の役割を担う）

### 英文カテゴリのサブカテゴリ（12時制＋日常フレーズ＋文法特集6種＋全カテゴリ＝20アイテム・5×4グリッド）
| サブカテゴリID | ラベル | 内容 |
|-------------|------|------|
| phrase_all | 全カテゴリ | 全サブカテゴリからランダム出題 |
| phrase_daily | 日常フレーズ | 会話でよく使う英語表現 |
| phrase_present_simple | 現在形 | 習慣・一般的な事実（仮定法・疑問文・比較表現なども含む） |
| phrase_present_continuous | 現在進行形 | 今まさに進行中の動作・一時的な状況 |
| phrase_present_perfect | 現在完了形 | 経験・完了・継続・結果（ever/never/just/already/yet） |
| phrase_present_perfect_continuous | 現在完了進行形 | 過去から現在まで続いている動作 |
| phrase_past_simple | 過去形 | 過去の完了した動作・状態 |
| phrase_past_continuous | 過去進行形 | 過去の特定の時点で進行中だった動作 |
| phrase_past_perfect | 過去完了形 | 過去のある時点より前に完了していた動作（仮定法過去完了を含む） |
| phrase_past_perfect_continuous | 過去完了進行形 | 過去のある時点まで継続していた動作 |
| phrase_future_simple | 未来形 | will / be going to を使った未来の動作・予定 |
| phrase_future_continuous | 未来進行形 | 未来の特定の時点で進行中の動作 |
| phrase_future_perfect | 未来完了形 | 未来の特定の時点までに完了している動作 |
| phrase_future_perfect_continuous | 未来完了進行形 | 未来の特定の時点まで継続している動作 |
| phrase_tag | 付加疑問文 | 〜ですよね？（isn't it? / don't you? など） |
| phrase_passive | 受動態 | be動詞＋過去分詞（〜される・〜された） |
| phrase_subjunctive | 仮定法 | 仮定法過去・仮定法過去完了・wish構文など |
| phrase_imperative | 命令文 | 動詞の原形で始まる指示・依頼・提案（Let's / Never / Don't など） |
| phrase_infinitive | 不定詞 | to＋動詞の原形（名詞的・形容詞的・副詞的用法） |
| phrase_gerund | 動名詞 | 動詞のing形を名詞として使う（主語・目的語・前置詞の後など） |

- 日常フレーズ50問、その他の時制・文法カテゴリは各30問
- 時制カテゴリの文には、疑問文・比較表現・助動詞・仮定法なども自然に組み込む
- データは `data/phrases/` フォルダ内に各カテゴリ1ファイルで管理
- 英文カテゴリ選択時はトップ画面から `/phrase-select` へ遷移（単語の `/word-select` と同じ構造）

### 単語カテゴリのサブカテゴリ（14テーマ＋全カテゴリ）
| サブカテゴリID | ラベル | 内容 |
|-------------|------|------|
| word_all | 全カテゴリ | 全テーマからランダム出題 |
| word_biology | 生物 | 動物・昆虫・魚・微生物など実際の生き物のみ（生態学など学問・概念は含めない） |
| word_nature | 自然 | 植物・地形・環境 |
| word_weather_space | 天気・宇宙 | 気象・天体 |
| word_food | 食べ物・飲み物 | 食材・料理 |
| word_lifestyle | 暮らし・生活 | 家具・ファッション・日用品 |
| word_health | 体・健康 | 体・症状・医療 |
| word_emotion | 感情・性格 | 感情・性格を表す語 |
| word_work | 仕事・職業 | 職種・職場用語 |
| word_technology | テクノロジー | IT・デジタル用語 |
| word_travel | 旅行・交通・地理 | 旅行・乗り物・国名・地理 |
| word_culture | 趣味・文化 | スポーツ・音楽・芸術 |
| word_education | 学校・学習 | 学校・理科・数学・科学 |
| word_society | 社会・政治 | 政治・法律・経済・歴史 |
| word_property | 色・形・素材 | 色・形状・素材を表す語（scarlet, oval, leather など） |
| word_other | その他 | 性質語・接続語・抽象概念など（glossy, therefore, paradox など） |

- データは `data/words/` フォルダ内に各カテゴリ1ファイルで管理
- 全単語カテゴリ（15テーマ）：各100語

### 非表示モード（単語カテゴリ専用）
- 単語カテゴリのみ、ゲーム中に👁️ボタンで表示・非表示をいつでも切り替え可能
- 非表示時：正解済み文字（緑）は見える、未入力部分はアンダースコア `_` で表示
- 表示時：通常どおりの3色ハイライト表示

### 問題文の表示
- 英文をタイプ対象として表示
- 英文の下に日本語訳を薄く補助表示（タイプ対象ではない）
- 長文は現在行を強調表示（全文は薄く表示）

### データ管理
- 問題の追加は自分のみ → TSファイルに直接追記する方式
- 雑学短文：50問　雑学長文：50問

```ts
// 問題データの構造
{
  id: "trivia_short_001",
  category: "trivia_short" | "trivia_long" | "phrase_xxx" | "word_xxx",
  en: "Honey never expires.",
  ja: "ハチミツは腐らない。",
}
```

## 機能要件

### 1. 基本ゲーム機能（コア）
- 英語タイピング判定：キー入力と正解文字の一致判定
- 出題形式：問題文を1文ずつ表示（長文は複数文）
- 進行管理：正解したら次の文字へ進む
- リスタート機能：もう一度プレイできる

### 2. UI / UX
- 進捗ハイライト：正解済み／現在の文字／未入力を色分け表示
- ミス時のエフェクト（シェイクや赤フラッシュなど）
- クリア時のアニメーションエフェクト
- テーマ切り替え（ライト／ダーク）
- PC向け（スマホのキーボード入力には対応しない）
- シンプルだが適度にデザイン性のある見た目
- ゲーム画面のステータス：問題番号・ミス数・正打数（累計正解文字数）
- 全ページ左上にBitFunロゴを固定表示（クリックでトップページへ遷移）

### 3. 英文読み上げ機能
- ブラウザ標準の Web Speech API（SpeechSynthesis）を使用（外部サービス不要・無料）
- 女性英語音声で読み上げ（Samantha / Google US English / Zira を優先選択）
- 読み上げ速度：0.85（学習向けに少しゆっくり）・ボリューム：0.5
- 実装場所：`lib/speech.ts` に共通関数（`speak` / `stopSpeaking`）を定義
- ゲーム画面：問題文カードの日本語訳の右に🔊ボタン（問題が変わると自動停止）
- 問題一覧画面：各問題の右側に🔊ボタン（再クリックで停止、別問題クリックで切り替え）

### 4. 言語切替機能（JP / EN モード）
- 全ページ右上に `🇬🇧 English | 🇯🇵 日本語` ボタンを固定表示
- デフォルトは日本語モード。設定は localStorage に保存（`bitfun_language`）
- **実装ファイル：**
  - `lib/languagePreference.ts` — 言語設定のget/set
  - `lib/translations.ts` — 全UIテキストの日本語・英語定義
  - `lib/records.ts` — `categoryLabelEn`（英語版カテゴリラベル）
  - `components/LanguageContext.tsx` — Reactコンテキスト（`useLanguage`フック）
  - `components/LanguageToggle.tsx` — 切替ボタン（layout.tsxで全ページに適用）
- **英語モードで変わること：**
  - 全ページのUIテキストが英語に切り替わる
  - ゲーム・問題一覧・記事ページで日本語訳・日本語ヒントが非表示になる
  - カテゴリ名・モード名・ボタンラベルなどすべて英語化
- 翻訳テキストを追加するときは `lib/translations.ts` の `ja` と `en` 両方に追記する

### 3. スコア記録・自己ベスト
- **タイムモードのみ**記録を保存（フリーモードは保存しない）
- localStorage に最新10件を保存（`bitfun_typing_records`）
- 自己ベスト（全カテゴリ通じた最高正打数）を別途保存（`bitfun_overall_best`）
- リザルト画面：カテゴリ別自己ベストカードは廃止。スコア記録画面（/history）で確認する
- スコア記録画面（/history）：自己ベスト＋直近10件のリスト
  - 各記録：カテゴリ・正打数・総打鍵数・正確率・ミス数・日時を表示

## 雑学記事（Articles）

### 概要
- BitFunポータルの「読んで学ぶ」コンテンツとして、雑学を英語で解説する記事を公開
- 英語と日本語を切り替えながら読める（日本語訳トグル）
- 記事内の単語をクリックすると意味がポップアップ表示される（WordTooltip）
- 記事全文を Web Speech API で読み上げ可能

### データ構造
- 記事データ：`content/articles/` 配下に各記事1ファイル（slug名.ts）
- 記事一覧エクスポート：`content/articles/index.ts`
- 単語帳データ：`data/vocabulary.ts`（全記事共通・`{ 単語/熟語: 日本語訳 }` の形式）
- 型定義：`types/article.ts`

### Article型のフィールド
| フィールド | 型 | 説明 |
|---|---|---|
| id | string | 管理用連番（例: article_001） |
| slug | string | URLに使うID（例: tittle） |
| title | string | 英語タイトル |
| titleJa | string | 日本語タイトル |
| description | string | 英語概要（SEO用） |
| descriptionJa | string | 日本語概要 |
| date | string | 公開日（YYYY-MM-DD） |
| category | string | カテゴリID（例: language / science / space） |
| categoryJa | string | カテゴリ表示名 |
| emoji | string | カテゴリアイコン |
| bgPattern? | "space" | 背景テーマ（省略時はデフォルトのオレンジグラデーション） |
| sections | ArticleSection[] | 記事本文 |

### セクション種別（type）
| type | 用途 |
|---|---|
| paragraph | 本文段落 |
| heading | 見出し（h2） |
| quote | 引用（左ボーダー付き） |

### 現在の記事一覧
| ID | slug | タイトル | カテゴリ |
|---|---|---|---|
| article_001 | tittle | The Tiny Dot You Never Noticed Has a Name | language |
| article_002 | olympus-mons | The Largest Volcano in the Solar System Is on Mars | space（bgPattern: "space"） |
| article_003 | honey | Honey Never Expires | science |
| article_004 | octopus-hearts | Octopuses Have Three Hearts — And Blue Blood | biology |
| article_005 | cleopatra-pyramid | Cleopatra Lived Closer in Time to the Moon Landing Than to the Pyramids | history |
| article_006 | banana-berry | Bananas Are Berries. Strawberries Are Not. | food |

### WordTooltip
- コンポーネント：`components/WordTooltip.tsx`
- `data/vocabulary.ts` の単語と照合し、該当単語をクリック可能にする
- クリックで日本語の意味をポップアップ表示（外側クリックで閉じる）

## 画面構成
- ポータルページ（/）：BitFunトップ。「ゲームで学ぶ」と「雑学記事」の2セクション構成
- タイピングゲーム選択画面（/typing-game）：モード選択・カテゴリ選択・スタートボタン
- 英文カテゴリ選択画面（/phrase-select）：英文選択時に遷移。20サブカテゴリを5×4グリッドで表示
- 単語テーマ選択画面（/word-select）：単語選択時に遷移。16アイテムを4×4グリッドで表示
- ゲーム画面（/game）：問題文（英文＋日本語訳）・タイマー・ミス数・正打数・ボーナスゲージ
- リザルト画面（/result）：正確率・ミス数・正打数・自己ベスト（タイムモードのみ）
- スコア記録画面（/history）：自己ベスト＋タイムモードの直近10件
- 問題一覧画面（/questions）：カテゴリ別・検索・ブックマーク・練習ボタン・読み上げ
- 出題問題一覧画面（/played）：直前のゲームで出題された問題の一覧。ブックマーク・読み上げ・「この問題で練習する」ボタンあり
- 記事一覧画面（/articles）：カテゴリフィルター付き記事リスト
- 記事詳細画面（/articles/[slug]）：本文・日本語訳トグル・読み上げ・WordTooltip

## 実装状況
- タイムモード・フリーモード：✅ 完成
- 全カテゴリ（雑学・英文・単語）：✅ 実装済み・データ充実
- スコア記録・自己ベスト：✅ 完成
- 英文読み上げ・効果音・ブックマーク：✅ 完成
- 雑学記事（6本）・WordTooltip・vocabulary：✅ 完成
- BitFunポータルページ（/）：✅ 完成
- 言語切替機能（JP/ENモード）：✅ 完成

## 技術的な実装方針
- キー入力処理：onKeyDown を使う
- 状態管理：useState・useEffect を使う
- タイマー処理：setInterval を使う
- API Routes：将来的なスコア保存用に用意だけしておく
- "use client" は必要なコンポーネントにだけつける
- pagesフォルダは使わない（App Router使用）
- ページ間ナビゲーションは原則 router.replace を使い、ゲーム画面を履歴に残さない
- localStorageを参照するコンポーネントは useState の初期値を固定値にし、useEffect でマウント後に読み込む（hydration エラー対策）
- `<script>` タグは next/script の Script コンポーネントを使う（layout.tsx での直書き禁止）

## コーディング規約
- コメントはすべて日本語で書く
- 返答はすべて日本語で
- コンポーネントは適切に分割する
- 初心者でも読みやすいシンプルなコードにする
- 処理の意図がわかるコメントを必ずつける（何をしているか・なぜそうしているかを日本語で明記する）
