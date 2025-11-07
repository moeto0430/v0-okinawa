"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { MapPin, Clock, DollarSign, AlertCircle } from "lucide-react"

interface ItineraryProps {
  content: string
}

export function ItineraryDisplay({ content }: ItineraryProps) {
  // Parse markdown-like content and create structured display
  const parseContent = (text: string) => {
    const lines = text.split("\n")
    const sections: { title: string; items: string[] }[] = []
    let currentSection = { title: "", items: [] as string[] }

    lines.forEach((line) => {
      if (line.startsWith("##") || line.startsWith("###") || line.startsWith("#")) {
        if (currentSection.title && currentSection.items.length > 0) {
          sections.push(currentSection)
        }
        currentSection = { title: line.replace(/^#+\s/, "").trim(), items: [] }
      } else if (line.trim() && !line.startsWith("-") && !line.startsWith("*")) {
        // Add non-empty lines that aren't list items to current section title if no section exists
        if (!currentSection.title && line.trim().length > 0) {
          currentSection.title = line.trim()
        } else if (currentSection.title) {
          currentSection.items.push(line.trim())
        }
      } else if ((line.startsWith("-") || line.startsWith("*")) && line.trim().length > 1) {
        // Handle bullet points
        currentSection.items.push(line.replace(/^[-*]\s/, "").trim())
      }
    })

    if (currentSection.title && currentSection.items.length > 0) {
      sections.push(currentSection)
    }

    if (sections.length === 0 && text.trim().length > 0) {
      const allLines = text.split("\n").filter((line) => line.trim().length > 0)
      if (allLines.length > 0) {
        sections.push({
          title: "旅行プラン",
          items: allLines,
        })
      }
    }

    console.log("[v0] Parsed sections:", sections.length)
    return sections
  }

  const sections = parseContent(content)

  return (
    <div className="space-y-4">
      <Card className="bg-gradient-to-br from-primary/10 via-accent/5 to-secondary/10 border-primary/20">
        <CardHeader className="pb-3">
          <div className="flex items-center gap-2">
            <MapPin className="w-5 h-5 text-primary" />
            <CardTitle className="text-2xl text-primary">推奨される旅行プラン</CardTitle>
          </div>
        </CardHeader>
      </Card>

      {sections.length > 0 ? (
        <div className="space-y-4">
          {sections.map((section, idx) => (
            <Card key={idx} className="border-border/50">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg text-accent flex items-center gap-2">
                  {section.title.includes("日") && <Clock className="w-4 h-4" />}
                  {section.title.includes("¥") && <DollarSign className="w-4 h-4" />}
                  {section.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {section.items.map((item, itemIdx) => (
                    <li key={itemIdx} className="flex gap-3 text-sm md:text-base text-foreground leading-relaxed">
                      <span className="text-primary font-bold flex-shrink-0">•</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card className="border-border">
          <CardContent className="pt-6">
            <div className="flex gap-3 text-muted-foreground">
              <AlertCircle className="w-5 h-5 flex-shrink-0" />
              <p>旅行プランを表示できません。もう一度お試しください。</p>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
        <Badge variant="outline" className="justify-center py-2 text-xs">
          計画的な旅行
        </Badge>
        <Badge variant="outline" className="justify-center py-2 text-xs">
          沖縄公認情報
        </Badge>
        <Badge variant="outline" className="justify-center py-2 text-xs">
          カスタマイズ可能
        </Badge>
      </div>
    </div>
  )
}
