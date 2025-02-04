import { useState } from "react";
import { initMercadoPago, Wallet } from "@mercadopago/sdk-react";
import { PricingCard } from "./PricingCard";
import { toast } from "../../hooks/use-toast";

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

// Inicializar Mercado Pago con la public key
initMercadoPago('TEST-XXXXX-XXXXX-XXXXX-XXXXX');

export function PricingPlans() {
  const [loadingPlan, setLoadingPlan] = useState<string | null>(null);
  const [preferenceId, setPreferenceId] = useState<string | null>(null);

  const handleSubscribe = async (planId: string) => {
    try {
      setLoadingPlan(planId);
      const plan = plans.find(p => p.id === planId);
      
      if (!plan) {
        throw new Error("Plan no encontrado");
      }

      // Aquí haremos la llamada al backend para crear la preferencia
      const response = await fetch('/api/create-preference', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          planId,
          title: plan.title,
          price: plan.price,
          interval: plan.interval
        }),
      });

      if (!response.ok) {
        throw new Error('Error al crear la preferencia de pago');
      }

      const data = await response.json();
      setPreferenceId(data.preferenceId);
      
    } catch (error) {
      console.error('Error:', error);
      toast({
        title: "Error",
        description: "No se pudo procesar la solicitud. Por favor, intenta nuevamente.",
        variant: "destructive",
      });
    } finally {
      setLoadingPlan(null);
    }
  };

  return (
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
      {preferenceId && (
        <div className="fixed bottom-4 right-4">
          <Wallet initialization={{ preferenceId }} />
        </div>
      )}
    </div>
  );
}