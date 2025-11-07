export async function POST(request: Request) {
  try {
    const { messages } = await request.json()

    const apiKey = process.env.OPENAI_API_KEY

    if (!apiKey) {
      return Response.json({ error: "APIキーが設定されていません" }, { status: 500 })
    }

    const tourismData = `
【沖縄観光スポット情報 - 完全データベース】

1. 美ら海水族館 (ID: 1)
   - カテゴリ: 美術館・水族館
   - 場所: 沖縄本島北部
   - 説明: 国内屈指の規模を誇る水族館。巨大水槽ではジンベエザメやマンタの泳ぐ姿を間近に観察でき、屋内型で雨天時でも楽しめる。午前は比較的空いており、周辺の備瀬フクギ並木やエメラルドビーチと組み合わせると動線が良い
   - 所要時間: 120分
   - ベストシーズン: 通年
   - ベストタイム: 午前、午後
   - 料金: 中程度
   - 雨の日: 対応可
   - 子供向け: ○
   - 高齢者向け: ○
   - バリアフリー: エレベーター・スロープあり
   - 駐車場: あり
   - 写真スポット: ○
   - 混雑情報: 午前が比較的空きやすい
   - 安全情報: 混雑時はベビーカーの動線に注意
   - リンク: https://churaumi.okinawa/

2. 国際通り (ID: 2)
   - カテゴリ: 街道・ショッピング
   - 場所: 沖縄本島那覇
   - 説明: 那覇市の中心に位置する約1.6kmのメインストリート。土産物店、沖縄料理店、カフェなどが立ち並び、昼は観光、夜は飲食街として賑わう。市場本通りや牧志公設市場、壺屋やちむん通りなど周辺の下町エリアと組み合わせると一層楽しめる。夕方から夜にかけて活気が増す
   - 所要時間: 90分
   - ベストシーズン: 通年
   - ベストタイム: 午後、夕方、夜
   - 料金: 中程度
   - 雨の日: 部分的に対応可
   - 子供向け: ○
   - 高齢者向け: ○
   - バリアフリー: 歩道は整備されているが人混みに注意
   - 駐車場: 周辺に有料P多数
   - 写真スポット: ○
   - 混雑情報: 午後〜夜に混雑、週末は特に観光客が多い
   - 安全情報: 車道横断・強引な客引きに注意、夜間はスリに注意
   - リンク: https://www.kokusaidori.net/

3. アメリカンビレッジ (ID: 3)
   - カテゴリ: ショッピング・エンターテイメント・海辺
   - 場所: 沖縄本島中部
   - 説明: 米軍基地跡地を再開発した海沿いの大型リゾートエリア。ショッピングモール、レストラン、カフェ、観覧車、映画館などが集まり、昼は買い物・カフェ巡り、夕方は美しいサンセット、夜はライトアップされた街並みが楽しめる。アメリカ西海岸風の雰囲気が漂い、外国人観光客にも人気。
   - 所要時間: 120分
   - ベストシーズン: 通年
   - ベストタイム: 午後、夕方、夜
   - 料金: 中程度～高
   - 雨の日: 部分的に対応可
   - 子供向け: ○
   - 高齢者向け: ○
   - バリアフリー: 歩道広くバリアフリー対応良好、施設間にスロープあり
   - 駐車場: 無料駐車場あり（複数エリア、週末は混雑）
   - 写真スポット: ○
   - サンセット: ○
   - 観覧車: あり
   - 混雑情報: 夕方〜夜が最も混雑、特に週末は駐車待ちあり
   - 安全情報: 夜は車の往来と人通りが多い、歩行時に注意
   - リンク: https://www.okinawa-americanvillage.com/
`

    const systemPrompt = `あなたは沖縄観光のエキスパートアシスタントです。以下の観光スポット情報のみを参考にして、ユーザーの質問に対して簡潔な回答をしてください。

${tourismData}

【対応可能なサービス】
- 観光スポットの詳細情報提供
- 旅行プランの作成・カスタマイズ
- 予算・日数別の提案
- 訪問時間・ベストシーズンの提案
- バリアフリー情報の提供
- 周辺スポットの組み合わせ提案
- 混雑状況・安全情報の案内

【回答時のポイント】
- 提供データから該当スポットを正確に紹介
- ユーザーの要望に合わせて適切にカスタマイズ
- 実践的で分かりやすいアドバイスを心がける
- スポット情報と関連リンクを含める`

    const conversationText = messages
      .map((m: any) => `${m.role === "user" ? "ユーザー" : "アシスタント"}: ${m.content}`)
      .join("\n")

    const input = `${systemPrompt}\n\n会話履歴:\n${conversationText}`

    console.log("[v0] Chat request received")
    console.log("[v0] Messages count:", messages.length)
    console.log("[v0] Sending to OpenAI API")

    const response = await fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-5-mini",
        input: input,
      }),
    })

    console.log("[v0] OpenAI response status:", response.status)

    const data = await response.json()

    function extractText(d: any): string | null {
      // 1) output_text フィールドがあればそれを使用
      if (typeof d?.output_text === "string" && d.output_text.trim()) {
        return d.output_text.trim()
      }

      // 2) output配列から全てのテキストを抽出
      if (Array.isArray(d?.output)) {
        const parts: string[] = []
        for (const item of d.output) {
          if ((item.type === "text" || item.type === "message") && Array.isArray(item?.content)) {
            for (const c of item.content) {
              if (typeof c?.text === "string" && c.text.trim()) {
                parts.push(c.text)
              }
            }
          }
        }
        if (parts.length > 0) {
          return parts.join("\n").trim()
        }
      }

      // 3) chat.completions形式のフォールバック
      if (Array.isArray(d?.choices) && d.choices[0]?.message?.content) {
        return d.choices[0].message.content
      }

      return null
    }

    const textContent = extractText(data)

    if (!textContent || textContent.trim().length === 0) {
      console.log("[v0] Warning: No text extracted from response")
      return Response.json(
        { error: "テキストを抽出できませんでした", content: "応答を生成できませんでした。" },
        { status: 400 },
      )
    }

    return Response.json({ content: textContent, role: "assistant" })
  } catch (error) {
    console.error("[v0] Chat API Error:", error)
    return Response.json({ error: "チャットAPIエラーが発生しました", details: String(error) }, { status: 500 })
  }
}
