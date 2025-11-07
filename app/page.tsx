"use client"

import { ChatInterface } from "@/components/chat-interface"

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-background via-background to-secondary/10">
      <div className="container mx-auto px-4 py-8 md:py-12">
        {/* Header */}
        <div className="mb-8 md:mb-12 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-3 text-primary">沖縄観光チャットボット</h1>
          <p className="text-lg md:text-xl text-muted-foreground">AIと会話で沖縄旅行を計画しましょう</p>
        </div>

        {/* Main Content */}
        <div className="flex justify-center">
          <ChatInterface />
        </div>

        {/* Footer */}
        <div className="mt-16 md:mt-20 text-center text-muted-foreground text-sm">
          <p>このチャットボットは沖縄の観光情報を基に対応します。</p>
        </div>
      </div>
    </main>
  )
}
