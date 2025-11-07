"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"

interface Preferences {
  duration: string
  budget: string
  interests: string[]
  season: string
  travelStyle: string
}

interface PreferenceFormProps {
  onSubmit: (preferences: Preferences) => void
  isLoading?: boolean
}

export function PreferenceForm({ onSubmit, isLoading = false }: PreferenceFormProps) {
  const [preferences, setPreferences] = useState<Preferences>({
    duration: "3-5",
    budget: "medium",
    interests: [],
    season: "any",
    travelStyle: "balanced",
  })

  const interestOptions = [
    { id: "beach", label: "ビーチ・海水浴" },
    { id: "culture", label: "文化・歴史" },
    { id: "food", label: "グルメ" },
    { id: "nature", label: "自然・トレッキング" },
    { id: "shopping", label: "ショッピング" },
    { id: "nightlife", label: "ナイトライフ" },
    { id: "activities", label: "アクティビティ" },
  ]

  const handleInterestToggle = (id: string) => {
    setPreferences((prev) => ({
      ...prev,
      interests: prev.interests.includes(id) ? prev.interests.filter((i) => i !== id) : [...prev.interests, id],
    }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(preferences)
  }

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <CardTitle className="text-2xl">あなたの旅のプリファレンス</CardTitle>
        <CardDescription>沖縄旅行をカスタマイズするための情報をお聞かせください</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Duration */}
          <div className="space-y-3">
            <Label className="text-base font-semibold">旅の期間</Label>
            <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
              {[
                { value: "1-2", label: "1-2日" },
                { value: "3-5", label: "3-5日" },
                { value: "6-7", label: "6-7日" },
                { value: "8+", label: "8日以上" },
              ].map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => setPreferences((p) => ({ ...p, duration: option.value }))}
                  className={`px-4 py-3 rounded-lg border-2 transition-all ${
                    preferences.duration === option.value
                      ? "border-primary bg-primary text-primary-foreground"
                      : "border-border bg-card text-foreground hover:border-primary/50"
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>

          {/* Budget */}
          <div className="space-y-3">
            <Label className="text-base font-semibold">予算</Label>
            <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
              {[
                { value: "budget", label: "エコノミー" },
                { value: "medium", label: "ミッドレンジ" },
                { value: "premium", label: "プレミアム" },
                { value: "luxury", label: "ラグジュアリー" },
              ].map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => setPreferences((p) => ({ ...p, budget: option.value }))}
                  className={`px-4 py-3 rounded-lg border-2 transition-all ${
                    preferences.budget === option.value
                      ? "border-primary bg-primary text-primary-foreground"
                      : "border-border bg-card text-foreground hover:border-primary/50"
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>

          {/* Season */}
          <div className="space-y-3">
            <Label className="text-base font-semibold">訪問時期</Label>
            <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
              {[
                { value: "spring", label: "春（3-5月）" },
                { value: "summer", label: "夏（6-8月）" },
                { value: "fall", label: "秋（9-11月）" },
                { value: "winter", label: "冬（12-2月）" },
              ].map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => setPreferences((p) => ({ ...p, season: option.value }))}
                  className={`px-4 py-3 rounded-lg border-2 transition-all text-sm ${
                    preferences.season === option.value
                      ? "border-accent bg-accent text-accent-foreground"
                      : "border-border bg-card text-foreground hover:border-accent/50"
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>

          {/* Travel Style */}
          <div className="space-y-3">
            <Label className="text-base font-semibold">旅のスタイル</Label>
            <div className="grid grid-cols-2 gap-3">
              {[
                { value: "relaxed", label: "のんびり派" },
                { value: "balanced", label: "バランス型" },
                { value: "active", label: "アクティブ派" },
                { value: "cultural", label: "文化重視" },
              ].map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => setPreferences((p) => ({ ...p, travelStyle: option.value }))}
                  className={`px-4 py-3 rounded-lg border-2 transition-all ${
                    preferences.travelStyle === option.value
                      ? "border-secondary bg-secondary text-secondary-foreground"
                      : "border-border bg-card text-foreground hover:border-secondary/50"
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>

          {/* Interests */}
          <div className="space-y-3">
            <Label className="text-base font-semibold">興味のあること（複数選択可）</Label>
            <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
              {interestOptions.map((option) => (
                <button
                  key={option.id}
                  type="button"
                  onClick={() => handleInterestToggle(option.id)}
                  className={`px-4 py-3 rounded-lg border-2 transition-all text-sm ${
                    preferences.interests.includes(option.id)
                      ? "border-accent bg-accent text-accent-foreground"
                      : "border-border bg-card text-foreground hover:border-accent/50"
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>

          <Button
            type="submit"
            disabled={isLoading}
            className="w-full h-12 text-base font-semibold bg-primary hover:bg-primary/90"
          >
            {isLoading ? "提案を生成中..." : "AIで旅行プランを提案"}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
