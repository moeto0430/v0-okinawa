"use client"

import type React from "react"
import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { ItineraryDisplay } from "@/components/itinerary-display"

interface Message {
  id: string
  role: "user" | "assistant"
  content: string
  isItinerary?: boolean
}

interface ChatInterfaceProps {
  onResetApiKey?: () => void
}

export function ChatInterface({ onResetApiKey }: ChatInterfaceProps) {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [initialQuery, setInitialQuery] = useState(true)
  const scrollRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: "smooth" })
    }
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim()) return

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input,
    }

    setMessages((prev) => [...prev, userMessage])
    setInput("")
    setIsLoading(true)

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [...messages, userMessage],
        }),
      })

      if (!response.ok) {
        throw new Error("API request failed")
      }

      const data = await response.json()
      console.log("[v0] API response received:", data)
      console.log("[v0] Content length:", data.content?.length)

      const hasItineraryMarkers =
        data.content.includes("##") ||
        data.content.includes("日程") ||
        data.content.includes("コース") ||
        data.content.includes("1日目") ||
        data.content.includes("2日目") ||
        data.content.includes("3日目") ||
        data.content.includes("スケジュール") ||
        data.content.includes("プラン") ||
        data.content.includes("予算") ||
        input.includes("プラン") ||
        input.includes("プランを") ||
        input.includes("スケジュール")

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: data.content || "応答がありません。",
        isItinerary: hasItineraryMarkers,
      }

      console.log("[v0] Setting assistant message:", assistantMessage)
      setMessages((prev) => {
        console.log("[v0] Previous messages count:", prev.length)
        console.log("[v0] Adding message, new count will be:", prev.length + 1)
        return [...prev, assistantMessage]
      })
    } catch (error) {
      console.error("[v0] Error:", error)
      const errorMessage: Message = {
        id: (Date.now() + 2).toString(),
        role: "assistant",
        content: "すみません、応答の生成に失敗しました。もう一度お試しください。",
      }
      setMessages((prev) => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  const handleInitialQuery = async (query: string) => {
    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: query,
    }

    setMessages((prev) => [...prev, userMessage])
    setInitialQuery(false)
    setIsLoading(true)

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [userMessage],
        }),
      })

      if (!response.ok) {
        throw new Error("API request failed")
      }

      const data = await response.json()

      const hasItineraryMarkers =
        data.content.includes("##") ||
        data.content.includes("日程") ||
        data.content.includes("コース") ||
        data.content.includes("1日目") ||
        data.content.includes("2日目") ||
        data.content.includes("3日目") ||
        data.content.includes("スケジュール") ||
        data.content.includes("プラン") ||
        data.content.includes("予算") ||
        query.includes("プラン") ||
        query.includes("スケジュール")

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: data.content || "応答がありません。",
        isItinerary: hasItineraryMarkers,
      }

      setMessages((prev) => [...prev, assistantMessage])
    } catch (error) {
      console.error("[v0] Error:", error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className="w-full max-w-4xl h-full flex flex-col">
      <CardHeader>
        <CardTitle>沖縄観光チャットボット</CardTitle>
        {onResetApiKey && (
          <Button onClick={onResetApiKey} variant="outline" size="sm" className="text-xs bg-transparent">
            APIキーをリセット
          </Button>
        )}
      </CardHeader>
      <CardContent className="flex-1 flex flex-col">
        <ScrollArea className="flex-1 mb-4 rounded-lg border border-border p-4">
          <div className="space-y-4">
            {messages.length === 0 && initialQuery ? (
              <div className="space-y-3">
                <p className="text-muted-foreground mb-4">以下のいずれかを選択するか、直接質問をしてください</p>
                <div className="grid grid-cols-1 gap-2">
                  {[
                    "沖縄の人気観光地を教えてください",
                    "沖縄でおすすめの食べ物とレストランは？",
                    "3日間の沖縄旅行プランを作成してください",
                  ].map((query, index) => (
                    <button
                      key={index}
                      onClick={() => handleInitialQuery(query)}
                      className="text-left px-4 py-3 bg-secondary/20 hover:bg-secondary/40 rounded-lg border border-border transition-colors"
                    >
                      {query}
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              messages.map((message) => (
                <div key={message.id} className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}>
                  {message.role === "user" ? (
                    <div className="max-w-xs md:max-w-md lg:max-w-xl px-4 py-3 rounded-lg bg-primary text-primary-foreground rounded-br-none">
                      <p className="text-sm md:text-base whitespace-pre-wrap">{message.content}</p>
                    </div>
                  ) : message.isItinerary ? (
                    <div className="w-full max-w-4xl">
                      <ItineraryDisplay content={message.content} />
                    </div>
                  ) : (
                    <div className="max-w-xs md:max-w-md lg:max-w-xl px-4 py-3 rounded-lg bg-muted text-foreground rounded-bl-none">
                      <p className="text-sm md:text-base whitespace-pre-wrap">{message.content}</p>
                    </div>
                  )}
                </div>
              ))
            )}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-muted text-foreground px-4 py-3 rounded-lg">
                  <p className="text-sm">考え中...</p>
                </div>
              </div>
            )}
            <div ref={scrollRef} />
          </div>
        </ScrollArea>

        <form onSubmit={handleSendMessage} className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="質問を入力..."
            disabled={isLoading}
            className="flex-1 px-4 py-2 bg-input border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
          />
          <Button type="submit" disabled={isLoading || !input.trim()} className="bg-primary hover:bg-primary/90">
            送信
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
