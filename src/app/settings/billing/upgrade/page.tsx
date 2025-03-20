'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { PageContainer } from '@/components/ui/page-container'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { ArrowLeft, CheckCircle2, CreditCard, Users, MessageSquare, Mail } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import {
  RadioGroup,
  RadioGroupItem
} from '@/components/ui/radio-group'
import { Label } from '@/components/ui/label'
import { Alert, AlertDescription } from '@/components/ui/alert'

// Dados de exemplo para os planos
const plans = [
  {
    id: 'basic',
    name: 'BÁSICO',
    price: 799.90,
    features: [
      '5 usuários incluídos',
      '1 canal de WhatsApp',
      'Suporte por email',
      'Acesso ao painel de análises básico',
      'Automações limitadas'
    ],
    recommended: false
  },
  {
    id: 'pro',
    name: 'PRO',
    price: 1599.90,
    discountPrice: 1279.90,
    discountPercentage: 20,
    features: [
      '20 usuários incluídos',
      '3 canais de WhatsApp',
      '1 canal de Instagram',
      '1 canal de Facebook',
      'Suporte prioritário',
      'Acesso a todas as automações',
      'Assistente AI Kin ilimitado',
      'APIs para integrações'
    ],
    recommended: true
  },
  {
    id: 'enterprise',
    name: 'ENTERPRISE',
    price: 3299.90,
    features: [
      'Usuários ilimitados',
      'Canais ilimitados',
      'Suporte VIP 24/7',
      'Gerente de conta dedicado',
      'Treinamento personalizado',
      'Customizações específicas',
      'SLA garantido',
      'Hospedagem dedicada'
    ],
    recommended: false
  }
];

// Dados de exemplo para os ciclos de cobrança
const billingCycles = [
  { id: 'monthly', name: 'Mensal', description: 'Cobrança mensal sem desconto', multiplier: 1, discount: 0 },
  { id: 'quarterly', name: 'Trimestral', description: 'Cobrança a cada 3 meses com 5% de desconto', multiplier: 3, discount: 5 },
  { id: 'yearly', name: 'Anual', description: 'Cobrança anual com 15% de desconto', multiplier: 12, discount: 15 }
];

export default function UpgradePlanPage() {
  const router = useRouter()
  const [selectedPlan, setSelectedPlan] = useState('pro')
  const [billingCycle, setBillingCycle] = useState('monthly')
  
  // Formatar preço em formato brasileiro
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(price).replace('R$', 'R$ ');
  }
  
  // Calcular o preço com desconto do ciclo de cobrança
  const calculatePrice = (basePrice: number, cycleId: string) => {
    const cycle = billingCycles.find(c => c.id === cycleId);
    if (!cycle) return basePrice;
    
    const discountMultiplier = (100 - cycle.discount) / 100;
    return basePrice * discountMultiplier * cycle.multiplier;
  }
  
  // Obter o plano atualmente selecionado
  const currentPlan = plans.find(p => p.id === selectedPlan) || plans[0];
  
  // Calcular o preço final
  const finalPrice = calculatePrice(currentPlan.discountPrice || currentPlan.price, billingCycle);
  
  // Obter o ciclo de cobrança selecionado
  const currentCycle = billingCycles.find(c => c.id === billingCycle) || billingCycles[0];

  return (
    <PageContainer>
      <div className="flex flex-col space-y-8">
        <div className="flex items-center space-x-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => router.push('/settings/billing')}
            className="h-8 w-8"
          >
            <ArrowLeft className="h-4 w-4" />
            <span className="sr-only">Voltar</span>
          </Button>
          <h1 className="text-2xl font-bold">Atualizar Plano</h1>
        </div>
        
        <div className="grid grid-cols-1 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Escolha seu plano</CardTitle>
              <CardDescription>
                Selecione o plano que melhor atende às necessidades da sua empresa
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {plans.map((plan) => (
                  <Card 
                    key={plan.id} 
                    className={`border-2 ${selectedPlan === plan.id ? 'border-primary' : 'border-border'} relative`}
                  >
                    {plan.recommended && (
                      <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                        <Badge className="bg-primary">Recomendado</Badge>
                      </div>
                    )}
                    <CardHeader className="pb-4">
                      <CardTitle className="text-center">{plan.name}</CardTitle>
                      <div className="flex justify-center items-end mt-4">
                        {plan.discountPrice ? (
                          <div className="text-center">
                            <span className="text-sm text-muted-foreground line-through">
                              {formatPrice(plan.price)}
                            </span>
                            <div className="text-3xl font-bold">
                              {formatPrice(plan.discountPrice)}
                              <span className="text-sm font-normal text-muted-foreground">/mês</span>
                            </div>
                            <span className="text-xs text-green-600">
                              {plan.discountPercentage}% de desconto
                            </span>
                          </div>
                        ) : (
                          <div className="text-center">
                            <div className="text-3xl font-bold">
                              {formatPrice(plan.price)}
                              <span className="text-sm font-normal text-muted-foreground">/mês</span>
                            </div>
                            {plan.id === 'enterprise' && (
                              <span className="text-xs text-muted-foreground">Personalizado</span>
                            )}
                          </div>
                        )}
                      </div>
                    </CardHeader>
                    <CardContent className="pb-6">
                      <ul className="space-y-2.5">
                        {plan.features.map((feature, index) => (
                          <li key={index} className="flex items-start">
                            <CheckCircle2 className="h-4 w-4 text-green-500 mr-2 mt-0.5 shrink-0" />
                            <span className="text-sm">{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                    <CardFooter>
                      <Button 
                        variant={selectedPlan === plan.id ? "default" : "outline"} 
                        className="w-full"
                        onClick={() => setSelectedPlan(plan.id)}
                      >
                        {selectedPlan === plan.id ? "Selecionado" : "Selecionar plano"}
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Ciclo de Cobrança</CardTitle>
              <CardDescription>
                Escolha a frequência de pagamento que mais se adapta à sua empresa
              </CardDescription>
            </CardHeader>
            <CardContent>
              <RadioGroup 
                value={billingCycle} 
                onValueChange={setBillingCycle}
                className="space-y-4"
              >
                {billingCycles.map((cycle) => (
                  <div 
                    key={cycle.id} 
                    className={`flex items-center space-x-3 border p-4 rounded-md cursor-pointer ${
                      billingCycle === cycle.id ? 'border-primary bg-primary/5' : 'border-border'
                    }`}
                    onClick={() => setBillingCycle(cycle.id)}
                  >
                    <RadioGroupItem value={cycle.id} id={cycle.id} />
                    <div className="flex-1">
                      <Label htmlFor={cycle.id} className="font-medium cursor-pointer">
                        {cycle.name}
                      </Label>
                      <p className="text-sm text-muted-foreground">{cycle.description}</p>
                    </div>
                    <div className="text-right">
                      <span className="font-medium">
                        {formatPrice(calculatePrice(currentPlan.discountPrice || currentPlan.price, cycle.id))}
                      </span>
                      {cycle.discount > 0 && (
                        <div className="text-xs text-green-600">{cycle.discount}% de desconto</div>
                      )}
                    </div>
                  </div>
                ))}
              </RadioGroup>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Resumo do Pedido</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center py-2">
                  <div>
                    <p className="font-medium">Plano {currentPlan.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {currentCycle.name} ({currentCycle.multiplier} {currentCycle.multiplier === 1 ? 'mês' : 'meses'})
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">{formatPrice(finalPrice)}</p>
                    {currentCycle.discount > 0 && (
                      <p className="text-xs text-green-600">Inclui {currentCycle.discount}% de desconto</p>
                    )}
                  </div>
                </div>
                
                <div className="flex justify-between items-center py-2 border-t pt-4">
                  <p className="font-bold">Total</p>
                  <p className="font-bold text-xl">{formatPrice(finalPrice)}</p>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex flex-col space-y-4">
              <Button className="w-full" size="lg">
                <CreditCard className="mr-2 h-4 w-4" />
                Confirmar e Pagar
              </Button>
              
              <Alert variant="default" className="bg-muted">
                <AlertDescription className="text-sm">
                  Ao confirmar, você concorda com os termos de serviço e autoriza a cobrança de {formatPrice(finalPrice)} para o ciclo {currentCycle.name.toLowerCase()}. 
                  Você pode cancelar ou alterar seu plano a qualquer momento.
                </AlertDescription>
              </Alert>
            </CardFooter>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Users className="h-5 w-5 mr-2 text-blue-500" />
                Perguntas Frequentes
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h3 className="font-medium">Posso mudar de plano a qualquer momento?</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  Sim, você pode atualizar, fazer downgrade ou cancelar seu plano a qualquer momento. As mudanças entrarão em vigor no próximo ciclo de cobrança.
                </p>
              </div>
              
              <div>
                <h3 className="font-medium">Como funciona o período de cobrança?</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  A cobrança é feita no início de cada período. Para planos mensais, é no mesmo dia de cada mês. Para trimestrais, a cada 3 meses, e anuais uma vez por ano.
                </p>
              </div>
              
              <div>
                <h3 className="font-medium">Tenho direito a reembolso se cancelar?</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  Oferecemos reembolso integral em até 7 dias após a contratação. Após esse período, não fazemos reembolsos proporcionais, mas você pode usar o serviço até o final do período pago.
                </p>
              </div>
              
              <div>
                <h3 className="font-medium">Preciso de cartão de crédito para testar?</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  Não, você pode solicitar uma demonstração gratuita de 14 dias sem fornecer informações de pagamento. Entre em contato com nossa equipe de vendas.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </PageContainer>
  )
} 