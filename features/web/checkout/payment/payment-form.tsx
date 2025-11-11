"use client";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { api } from "@/convex/_generated/api";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery } from "convex/react";
import { ChevronLeftIcon } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

const formSchema = z.object({
  phone: z.string().max(10, {
    message: "phone number must be 10 didgits.",
  }),
});

export function PaymentForm() {
  const router = useRouter();
  const payWithPhone = useMutation(api.checkout.paywithPhoneNumber);
  const [isSaving, setIsSaving] = useState(false);
  const session = useQuery(api.checkout.getSession);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      phone: "",
    },
  });

  useEffect(() => {
    if (session === undefined) return;
    form.reset({
      phone: session?.contactPhone || "",
    });
  }, [session, form]);

  // 2. Define a submit handler.
  async function onSubmit(data: z.infer<typeof formSchema>) {
    try {
      setIsSaving(true);
      await payWithPhone({
        phone: data.phone,
      });
      toast.success("Check your phone for payment");
      router.push("/checkout/success");
    } catch (error: any) {
      toast.error(error?.message || "Failed to save shipping method.");
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <Form {...form}>
      <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
        <div className="space-y-3">
          <FormField
            control={form.control}
            name="phone"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel className="sr-only text-xl tracking-tight">
                  Apartment
                </FormLabel>
                <FormControl>
                  <Input
                    className="min-h-12 dark:bg-transparent"
                    placeholder="079XXXXXXX"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className="flex w-full justify-between">
          <Button asChild size="lg" variant={"link"}>
            <Link href="/checkout/shipping">
              <ChevronLeftIcon />
              Return to Shipping
            </Link>
          </Button>
          <Button size="lg" type="submit">
            Pay
          </Button>
        </div>
      </form>
    </Form>
  );
}
