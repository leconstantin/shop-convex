import { useEffect, useMemo, useState } from "react";
import { ChevronLeftIcon } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import Price from "@/components/custom/price";
import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";

type TshippingOptions = {
  id: string;
  name: string;
  description: string;
  price: number;
};
export default function ShipPrice() {
  const user = useQuery(api.auth.loggedInUser);
  const router = useRouter();
  const saveShipping = useMutation(api.checkout.selectShippingMethod);
  const shippingOptions: TshippingOptions[] = useMemo(
    () => [
      {
        id: "economy",
        name: "Economy",
        description: "5 to 8 business days",
        price: 4.9,
      },
      {
        id: "standard",
        name: "Standard",
        description: "3 to 4 business days",
        price: 6.9,
      },
    ],
    [],
  );

  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (user === undefined) return;
    if (selectedOption === null) {
      setSelectedOption(
        user?.shipping_method ?? shippingOptions[0]?.id ?? null,
      );
    }
  }, [user, selectedOption, shippingOptions]);

  const handleContinue = async () => {
    if (!selectedOption) {
      toast.warning("Choose a shipping method");
      return;
    }

    const option = shippingOptions.find((item) => item.id === selectedOption);
    if (!option) {
      toast.error("Selected shipping method is not available.");
      return;
    }

    try {
      setIsSaving(true);
      await saveShipping({
        method: option.id,
        price: option.price,
      });
      toast.success(`Shipping method set to ${option.name}`);
      router.push("/checkout/payment");
    } catch (error: any) {
      toast.error(error?.message || "Failed to save shipping method.");
    } finally {
      setIsSaving(false);
    }
  };
  return (
    <section className="flex flex-col gap-6">
      <h3 className="font-semibold text-foreground text-xl tracking-tight">
        Shipping Method
      </h3>

      <RadioGroup
        className="grid gap-3"
        onValueChange={setSelectedOption}
        value={selectedOption ?? undefined}
      >
        {shippingOptions.map((option) => (
          <Label
            className="flex cursor-pointer items-start justify-between gap-3 rounded-lg border p-3 hover:bg-accent/50 has-aria-checked:border-blue-600 has-aria-checked:bg-blue-50 dark:has-aria-checked:border-blue-900 dark:has-aria-checked:bg-blue-950"
            htmlFor={option.id}
            key={option.id}
            // onClick={() => setShippingAmount(option.id, option.price)}
          >
            <div className="flex items-start gap-3">
              <RadioGroupItem
                // checked={shipping.type.toLowerCase() === option.id}
                className="data-[state=checked]:border-blue-600 data-[state=checked]:bg-blue-600 data-[state=checked]:text-white dark:data-[state=checked]:border-blue-700 dark:data-[state=checked]:bg-blue-700"
                id={option.id}
                value={option.id}
              />
              <div className="space-y-1 font-normal">
                <p className="font-medium text-foreground text-sm leading-none">
                  {option.name}
                </p>
                <p className="text-muted-foreground text-sm">
                  {option.description}
                </p>
              </div>
            </div>

            <Price
              amount={option.price.toFixed(2)}
              className="text-right font-semibold text-foreground"
              currencyCode="RWF"
            />
          </Label>
        ))}
      </RadioGroup>

      <div className="flex w-full justify-between">
        <Button asChild size="lg" variant={"link"}>
          <Link href="/checkout/information">
            <ChevronLeftIcon />
            Return to Information
          </Link>
        </Button>
        <Button
          disabled={isSaving}
          onClick={handleContinue}
          size="lg"
          type="button"
        >
          Continue to Payment
        </Button>
      </div>
    </section>
  );
}
