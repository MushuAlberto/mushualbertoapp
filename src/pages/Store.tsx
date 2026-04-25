import React, { useState } from 'react';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { ADHD_REWARDS, ADHD_REWARD_CATEGORIES } from '@/constants/adhdRewards';
import { UserStoreItem } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Store as StoreIcon, ShoppingCart, Crown, Check, Filter } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const Store: React.FC = () => {
  const [sparkles, setSparkles] = useLocalStorage<number>('mushu_sparkles', 0);
  const { toast } = useToast();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [purchasedItems, setPurchasedItems] = useLocalStorage<UserStoreItem[]>('mushu_purchased_rewards', []);
  const [usedItems, setUsedItems] = useLocalStorage<string[]>('mushu_used_rewards', []);

  const purchaseReward = (itemId: string, cost: number) => {
    if (sparkles < cost) {
      toast({
        title: "Sparkles insuficientes",
        description: `Necesitas ${cost} Sparkles para comprar esta recompensa. Actualmente tienes ${sparkles}.`,
        variant: "destructive"
      });
      return;
    }

    const newPurchase: UserStoreItem = {
      userId: 'current-user',
      itemId,
      purchasedAt: new Date().toISOString()
    };
    setPurchasedItems([...purchasedItems, newPurchase]);
    setSparkles(sparkles - cost);
    
    toast({
      title: "¡Recompensa obtenida! ✨",
      description: "Tu nueva herramienta de apoyo TDAH está lista para usar",
    });
  };

  const useReward = (itemId: string) => {
    setUsedItems([...usedItems, itemId]);
    
    const reward = ADHD_REWARDS.find(r => r.id === itemId);
    toast({
      title: "¡Recompensa activada! 🎉",
      description: `${reward?.name}: ${reward?.description}`,
    });
  };

  const isPurchased = (itemId: string) => {
    return purchasedItems.some(item => item.itemId === itemId);
  };

  const isUsed = (itemId: string) => {
    return usedItems.includes(itemId);
  };

  const filteredRewards = selectedCategory === 'all' 
    ? ADHD_REWARDS 
    : ADHD_REWARDS.filter(reward => reward.category === selectedCategory);

  return (
    <div className="space-y-6 p-4">
      <div className="text-center">
        <StoreIcon className="h-12 w-12 text-purple-500 mx-auto mb-4" />
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Tienda de Recompensas TDAH</h1>
        <p className="text-gray-600">Herramientas y permisos para apoyar tu bienestar neurodivergente</p>
        
        <Card className="inline-block mt-4 bg-gradient-to-r from-yellow-100 to-amber-100 border-yellow-200">
          <CardContent className="pt-4 pb-4">
            <div className="flex items-center space-x-2">
              <span className="text-2xl">✨</span>
              <span className="text-amber-700 font-bold text-lg">{sparkles} Sparkles</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Category Filter */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Filter className="mr-2 h-5 w-5" />
            Filtrar por categoría
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger>
              <SelectValue placeholder="Selecciona una categoría" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas las categorías</SelectItem>
              {Object.entries(ADHD_REWARD_CATEGORIES).map(([key, label]) => (
                <SelectItem key={key} value={key}>{label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      {/* How to Earn Sparkles */}
      <Card className="bg-gradient-to-r from-purple-50 to-pink-50 border-purple-200">
        <CardContent className="pt-6">
          <div className="text-center space-y-3">
            <h3 className="font-medium text-purple-800 mb-3">✨ ¿Cómo ganar más Sparkles?</h3>
            <div className="grid md:grid-cols-2 gap-4 text-sm text-purple-700">
              <div className="space-y-2">
                <p>• Completar tareas: +10 Sparkles</p>
                <p>• Completar subtareas: +2 Sparkles</p>
                <p>• Completar hábitos: +5 Sparkles</p>
              </div>
              <div className="space-y-2">
                <p>• Racha de 7 días: +10 Sparkles bonus</p>
                <p>• Escribir en el diario: +5 Sparkles</p>
                <p>• Ejercicios de bienestar: +15 Sparkles</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Rewards Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredRewards.map(reward => {
          const purchased = isPurchased(reward.id);
          const used = isUsed(reward.id);
          
          return (
            <Card key={reward.id} className={`transition-all hover:shadow-lg ${
              purchased ? 'ring-2 ring-green-500 bg-green-50' : ''
            } ${used ? 'opacity-50' : ''}`}>
              <CardHeader>
                <div className="text-center">
                  <div className="text-4xl mb-3">{reward.icon}</div>
                  <CardTitle className="text-lg">{reward.name}</CardTitle>
                  <Badge variant="outline" className="mt-2">
                    {ADHD_REWARD_CATEGORIES[reward.category]}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-gray-600 text-sm text-center">{reward.description}</p>
                
                <div className="text-center">
                  <Badge variant="outline" className="bg-yellow-50 border-yellow-200">
                    ✨ {reward.cost} Sparkles
                  </Badge>
                </div>

                <div className="space-y-2">
                  {used ? (
                    <Button disabled className="w-full bg-gray-400">
                      Ya usado
                    </Button>
                  ) : purchased ? (
                    <Button onClick={() => useReward(reward.id)} className="w-full bg-green-600 hover:bg-green-700">
                      <Check className="mr-2 h-4 w-4" />
                      Usar recompensa
                    </Button>
                  ) : (
                    <Button 
                      onClick={() => purchaseReward(reward.id, reward.cost)}
                      disabled={sparkles < reward.cost}
                      className="w-full"
                      variant={sparkles >= reward.cost ? "default" : "secondary"}
                    >
                      <ShoppingCart className="mr-2 h-4 w-4" />
                      {sparkles >= reward.cost ? 'Comprar' : 'Sparkles insuficientes'}
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default Store;