import { useState } from "react";
import { useToast } from "../../hooks/use-toast";
import { PricingCard } from "./PricingCard";
import { createPreference } from "../../services/api";

const plans = [
  {
    id: "monthly",
    title: "Plan Mensual",
    price: 5.99,
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
    price: 29.99,
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
    price:49.99,
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
  const { toast } = useToast();

  const handleSubscribe = async (planId: string) => {
    try {
      setLoadingPlan(planId);
      const plan = plans.find(p => p.id === planId);
      
      if (!plan) {
        throw new Error("Plan no encontrado");
      }

      const response = await createPreference({ plan: planId });
      
      // Redirect to MercadoPago checkout
      if (response.preferenceId) {
        const checkoutUrl = `https://www.mercadopago.com.ar/checkout/v1/redirect?pref_id=${response.preferenceId}`;
        window.open(checkoutUrl, '_blank');
      } else {
        throw new Error("No se pudo obtener el ID de preferencia");
      }

    } catch (error) {
      console.error('Error:', error);
      toast({
        title: "Error",
        description: "Error al procesar la suscripción. Por favor, intente nuevamente.",
        variant: "destructive",
      });
    } finally {
      setLoadingPlan(null);
    }
  };

  return (
    <div className="container mx-auto py-6">
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
    </div>
  );
}