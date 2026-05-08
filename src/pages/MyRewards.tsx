import React, { useState } from "react";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { ADHD_REWARDS, ADHD_REWARD_CATEGORIES } from "@/constants/adhdRewards";
import { UserStoreItem } from "@/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Trophy,
  ShoppingCart,
  Check,
  Filter,
  Sparkles,
  Star,
  TrendingUp,
  Gift,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import AchievementsPanel from "@/components/productivity/AchievementsPanel";
import { IntelligentGamificationPanel } from "@/components/productivity/IntelligentGamificationPanel";

const MyRewards: React.FC = () => {
  const [sparkles, setSparkles] = useLocalStorage<number>("mushu_sparkles", 0);
  const { toast } = useToast();
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [purchasedItems, setPurchasedItems] = useLocalStorage<UserStoreItem[]>(
    "mushu_purchased_rewards",
    []
  );
  const [usedItems, setUsedItems] = useLocalStorage<string[]>(
    "mushu_used_rewards",
    []
  );
  const [activeTab, setActiveTab] = useState("achievements");

  const purchaseReward = (itemId: string, cost: number) => {
    if (sparkles < cost) {
      toast({
        title: "Sparkles insuficientes",
        description: `Necesitas ${cost} Sparkles. Tienes ${sparkles}.`,
        variant: "destructive",
      });
      return;
    }

    const newPurchase: UserStoreItem = {
      userId: "current-user",
      itemId,
      purchasedAt: new Date().toISOString(),
    };
    setPurchasedItems([...purchasedItems, newPurchase]);
    setSparkles(sparkles - cost);

    toast({
      title: "¡Recompensa obtenida! ✨",
      description: "Tu nueva recompensa está lista para usar",
    });
  };

  const useReward = (itemId: string) => {
    setUsedItems([...usedItems, itemId]);
    const reward = ADHD_REWARDS.find((r) => r.id === itemId);
    toast({
      title: "¡Recompensa activada! 🎉",
      description: `${reward?.name}: ${reward?.description}`,
    });
  };

  const isPurchased = (itemId: string) =>
    purchasedItems.some((item) => item.itemId === itemId);
  const isUsed = (itemId: string) => usedItems.includes(itemId);

  const filteredRewards =
    selectedCategory === "all"
      ? ADHD_REWARDS
      : ADHD_REWARDS.filter((reward) => reward.category === selectedCategory);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-500 text-white shadow-lg">
            <Trophy className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
              Mis Logros
            </h1>
            <p className="text-muted-foreground text-sm">
              Celebra tu progreso y canjea recompensas
            </p>
          </div>
        </div>

        <Card className="bg-gradient-to-r from-amber-500/10 to-orange-500/10 border-amber-500/20 px-4 py-3">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-amber-500" />
            <span className="text-xl font-bold text-amber-600 dark:text-amber-400">
              {sparkles}
            </span>
            <span className="text-sm text-muted-foreground">Sparkles</span>
          </div>
        </Card>
      </div>

      {/* Main Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="achievements" className="flex items-center gap-1.5 text-xs sm:text-sm">
            <Star className="h-4 w-4" />
            <span className="hidden sm:inline">Logros</span>
          </TabsTrigger>
          <TabsTrigger value="store" className="flex items-center gap-1.5 text-xs sm:text-sm">
            <Gift className="h-4 w-4" />
            <span className="hidden sm:inline">Tienda</span>
          </TabsTrigger>
          <TabsTrigger value="ai" className="flex items-center gap-1.5 text-xs sm:text-sm">
            <TrendingUp className="h-4 w-4" />
            <span className="hidden sm:inline">Progreso IA</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="achievements" className="mt-4 space-y-6">
          <AchievementsPanel />

          {/* How to earn */}
          <Card className="bg-gradient-to-r from-violet-500/5 to-pink-500/5 border-violet-500/20">
            <CardContent className="pt-6">
              <div className="text-center space-y-3">
                <h3 className="font-semibold text-foreground mb-3">
                  ✨ ¿Cómo ganar más Sparkles?
                </h3>
                <div className="grid sm:grid-cols-2 gap-4 text-sm text-muted-foreground">
                  <div className="space-y-2 text-left">
                    <p>• Completar tareas: +10 Sparkles</p>
                    <p>• Completar subtareas: +2 Sparkles</p>
                    <p>• Completar hábitos: +5 Sparkles</p>
                  </div>
                  <div className="space-y-2 text-left">
                    <p>• Racha de 7 días: +10 Sparkles bonus</p>
                    <p>• Escribir en el diario: +5 Sparkles</p>
                    <p>• Ejercicios de bienestar: +15 Sparkles</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="store" className="mt-4 space-y-6">
          {/* Category Filter */}
          <Card className="border-border">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center text-base">
                <Filter className="mr-2 h-4 w-4" />
                Filtrar por categoría
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Select
                value={selectedCategory}
                onValueChange={setSelectedCategory}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecciona una categoría" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas las categorías</SelectItem>
                  {Object.entries(ADHD_REWARD_CATEGORIES).map(
                    ([key, label]) => (
                      <SelectItem key={key} value={key}>
                        {label}
                      </SelectItem>
                    )
                  )}
                </SelectContent>
              </Select>
            </CardContent>
          </Card>

          {/* Rewards Grid */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredRewards.map((reward) => {
              const purchased = isPurchased(reward.id);
              const used = isUsed(reward.id);

              return (
                <Card
                  key={reward.id}
                  className={`transition-all hover:shadow-lg border-border ${
                    purchased
                      ? "ring-2 ring-green-500 bg-green-500/5"
                      : ""
                  } ${used ? "opacity-50" : ""}`}
                >
                  <CardHeader className="pb-2">
                    <div className="text-center">
                      <div className="text-4xl mb-3">{reward.icon}</div>
                      <CardTitle className="text-base">
                        {reward.name}
                      </CardTitle>
                      <Badge variant="outline" className="mt-2 text-xs">
                        {ADHD_REWARD_CATEGORIES[reward.category]}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <p className="text-muted-foreground text-sm text-center line-clamp-2">
                      {reward.description}
                    </p>

                    <div className="text-center">
                      <Badge
                        variant="outline"
                        className="bg-amber-500/10 border-amber-500/30 text-amber-600 dark:text-amber-400"
                      >
                        ✨ {reward.cost} Sparkles
                      </Badge>
                    </div>

                    <div>
                      {used ? (
                        <Button disabled className="w-full" variant="secondary">
                          Ya usado
                        </Button>
                      ) : purchased ? (
                        <Button
                          onClick={() => useReward(reward.id)}
                          className="w-full bg-green-600 hover:bg-green-700 text-white"
                        >
                          <Check className="mr-2 h-4 w-4" />
                          Usar recompensa
                        </Button>
                      ) : (
                        <Button
                          onClick={() =>
                            purchaseReward(reward.id, reward.cost)
                          }
                          disabled={sparkles < reward.cost}
                          className="w-full"
                          variant={
                            sparkles >= reward.cost ? "default" : "secondary"
                          }
                        >
                          <ShoppingCart className="mr-2 h-4 w-4" />
                          {sparkles >= reward.cost
                            ? "Comprar"
                            : "Insuficiente"}
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>

        <TabsContent value="ai" className="mt-4">
          <IntelligentGamificationPanel />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default MyRewards;
