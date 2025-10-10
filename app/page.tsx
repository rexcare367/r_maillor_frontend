import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Lightbulb, TrendingUp } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

export default function MeillorDashboard() {
  const coins = [
    {
      id: 1,
      score: 97,
      name: "Napoléon 20F - Jeton",
      subtitle: "Marianne Coq - Refrappe Pinay",
      image: "/napoleon-20-franc-gold-coin.jpg",
      country: "CH",
      grade: "SPL",
      percentage: "3.35%",
      year: "1912",
      price: "599€",
      status: "available",
    },
    {
      id: 2,
      score: 93,
      name: "Napoléon 20F - Jeton",
      subtitle: "Dieu Protège La France",
      image: "/napoleon-20-franc-silver-coin.jpg",
      country: "FR",
      grade: "SPL",
      percentage: "7.12%",
      year: "1865",
      price: null,
      status: "purchased",
    },
    {
      id: 3,
      score: 89,
      name: "Napoléon 5F",
      subtitle: "Liberté Égalité Fraternité",
      image: "/napoleon-5-franc-gold-coin.jpg",
      country: "CH",
      grade: "TTB",
      percentage: "9.20%",
      year: "1958",
      price: "395€",
      status: "available",
    },
    {
      id: 4,
      score: 89,
      name: "Napoléon 5F",
      subtitle: "Liberté Égalité Fraternité",
      image: "/napoleon-5-franc-coin-1960.jpg",
      country: "FR",
      grade: "B",
      percentage: "2.27%",
      year: "1960",
      price: "394€",
      status: "available",
    },
    {
      id: 5,
      score: 83,
      name: "Napoléon 10F",
      subtitle: "Cérès",
      image: "/napoleon-10-franc-ceres-coin.jpg",
      country: "FR",
      grade: "TTB",
      percentage: "4.15%",
      year: "1899",
      price: "444€",
      status: "available",
    },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <h1 className="text-xl font-bold text-foreground">Meillor</h1>
          <div className="flex items-center gap-3">
            <Link href="/login">
              <Button variant="outline" size="default">
                Sign In
              </Button>
            </Link>
            <Link href="/register">
              <Button size="default" className="bg-black hover:bg-black/90">
                Get Started
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Stats Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="text-center">
            <div className="text-3xl font-bold text-green-600">+9.4%</div>
            <div className="text-sm text-muted-foreground mt-1">ROI prédit</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-foreground">891</div>
            <div className="text-sm text-muted-foreground mt-1">pièces analysées</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-foreground">0.7K€</div>
            <div className="text-sm text-muted-foreground mt-1">d&apos;or analysé</div>
          </div>
        </div>

        {/* Alert Boxes */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          <Card className="bg-amber-50 border-amber-200 p-4">
            <div className="flex gap-3">
              <Lightbulb className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
              <div>
                <div className="font-medium text-amber-900 mb-1">
                  Nouvelles opportunités disponibles détectées par Meillor IA
                </div>
                <div className="text-sm text-amber-800">-22 pièces à haut potentiel de valorisation</div>
                <div className="text-sm text-amber-800">-3 pièces uniques</div>
              </div>
            </div>
          </Card>

          <Card className="bg-blue-50 border-blue-200 p-4">
            <div className="flex gap-3">
              <TrendingUp className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
              <div>
                <div className="font-medium text-blue-900 mb-1">Analyse de marché par Meillor IA</div>
                <div className="text-sm text-blue-800">-Tendance mensuelle haussière</div>
                <div className="text-sm text-blue-800">-Volume 24h de 200M€</div>
              </div>
            </div>
          </Card>
        </div>

        {/* Top Or Section */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold text-foreground">Top Or</h2>
            <div className="text-sm text-muted-foreground">Mise à jour il y a 9 heures 32 minutes</div>
          </div>

          <div className="space-y-4">
            {coins.map((coin) => (
              <Card key={coin.id} className="p-6 bg-white">
                <div className="flex items-center gap-6">
                  {/* Score */}
                  <div className="text-4xl font-bold text-purple-600 w-16 flex-shrink-0">{coin.score}</div>

                  {/* Coin Image */}
                  <div className="w-20 h-20 flex-shrink-0 relative">
                    <Image src={coin.image || "/placeholder.svg"} alt={coin.name} fill className="object-contain" />
                  </div>

                  {/* Coin Details */}
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-foreground text-lg mb-1">{coin.name}</h3>
                    <p className="text-sm text-muted-foreground mb-3">{coin.subtitle}</p>
                    <div className="flex items-center gap-4 flex-wrap">
                      <div className="flex items-center gap-2">
                        {coin.country === "CH" ? (
                          <span className="text-lg">🇨🇭</span>
                        ) : (
                          <span className="text-lg">🇫🇷</span>
                        )}
                        <Badge variant="outline" className="font-medium">
                          {coin.grade}
                        </Badge>
                      </div>
                      <span className="text-sm text-muted-foreground">{coin.percentage}</span>
                      <span className="text-sm text-muted-foreground">{coin.year}</span>
                    </div>
                  </div>

                  {/* Price and Actions */}
                  <div className="flex items-center gap-3 flex-shrink-0">
                    {coin.price && <div className="text-2xl font-bold text-foreground mr-4">{coin.price}</div>}
                    {coin.status === "available" ? (
                      <>
                        <Button variant="outline" size="default">
                          ANALYSE
                        </Button>
                        <Button size="default" className="bg-black hover:bg-black/90">
                          ACHAT
                        </Button>
                      </>
                    ) : (
                      <div className="px-6 py-2 text-muted-foreground font-medium">ACHETÉ</div>
                    )}
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </main>
    </div>
  )
}
