import { useState } from "react";
import { PricingCard } from "./PricingCard";

const plans = [
  {
    id: "monthly",
    title: "Plan Mensual",
    price: 6,
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
    price: 30,
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
    price: 50,
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

export function PricingPlans() {
  const [loadingPlan, setLoadingPlan] = useState<string | null>(null);

  const handleSubscribe = async (planId: string) => {
    try {
      setLoadingPlan(planId);
      
      // Aquí iría la lógica de integración con la pasarela de pago
      // Por ahora solo simulamos un delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Redirigir a la pasarela de pago
      console.log(`Redirigiendo al plan: ${planId}`);
      
    } catch (error) {
      console.error("Error al procesar la suscripción:", error);
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
    </div>
  );
}