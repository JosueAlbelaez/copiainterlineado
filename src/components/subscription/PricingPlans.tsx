import { useState } from "react";
import { initMercadoPago, Wallet } from "@mercadopago/sdk-react";
import { useToast } from "../../hooks/use-toast";
import { PricingCard } from "./PricingCard";

const plans = [
  {
    id: "monthly",
    title: "Plan Mensual",
    price: 9.99,
    interval: "mes",
    description: "Acceso completo por un mes",
    features: [
      "Acceso ilimitado a todas las frases",
      "Sin límite diario",
      "Todas las categorías disponibles",
      "Soporte prioritario"
    ]
  },
  {
    id: "biannual",
    title: "Plan Semestral",
    price: 49.99,
    interval: "6 meses",
    description: "Ahorra con 6 meses de acceso",
    features: [
      "Todo lo del plan mensual",
      "Ahorro del 17%",
      "Acceso a contenido exclusivo",
      "Descarga de recursos"
    ]
  },
  {
    id: "annual",
    title: "Plan Anual",
    price: 89.99,
    interval: "año",
    description: "La mejor relación calidad-precio",
    features: [
      "Todo lo del plan semestral",
      "Ahorro del 31%",
      "Contenido premium exclusivo",
      "Características beta anticipadas"
    ]
  }
];

initMercadoPago('TEST-3c7d96f2-f320-41b7-b724-05de43fd40ac');

export function PricingPlans() {
  const [loadingPlan, setLoadingPlan] = useState<string | null>(null);
  const [preferenceId, setPreferenceId] = useState<string | null>(null);
  const { toast } = useToast();

  const handleSubscribe = async (planId: string) => {
    try {
      setLoadingPlan(planId);
      const plan = plans.find(p => p.id === planId);
      
      if (!plan) {
        throw new Error("Plan no encontrado");
      }

      console.log('Creando preferencia para el plan:', plan);

      const response = await fetch('/api/create-preference', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          planId: plan.id,
          title: plan.title,
          price: plan.price,
          interval: plan.interval
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('Error response:', errorData);
        throw new Error(errorData.error || 'Error al crear la preferencia de pago');
      }

      const data = await response.json();
      console.log('Preferencia creada:', data);
      setPreferenceId(data.preferenceId);

    } catch (error) {
      console.error('Error:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Error al procesar la suscripción",
        variant: "destructive",
      });
    } finally {
      setLoadingPlan(null);
    }
  };

  return (
    <div className="container mx-auto py-12 px-4">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">Planes de Suscripción</h2>
        <p className="text-gray-600">
          Elige el plan que mejor se adapte a tus necesidades
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-7xl mx-auto">
        {plans.map((plan) => (
          <PricingCard
            key={plan.id}
            title={plan.title}
            price={plan.price}
            interval={plan.interval}
            description={plan.description}
            features={plan.features}
            onSubscribe={() => handleSubscribe(plan.id)}
            isLoading={loadingPlan === plan.id}
          />
        ))}
      </div>
      {preferenceId && (
        <div className="fixed bottom-4 right-4 scale-125 transform">
          <Wallet initialization={{ preferenceId }} />
        </div>
      )}
    </div>
  );
}