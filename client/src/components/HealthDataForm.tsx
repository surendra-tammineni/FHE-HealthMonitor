import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { User } from "lucide-react";

const healthDataSchema = z.object({
  name: z.string().min(1, "Name is required"),
  age: z.coerce.number().int().positive("Age must be a positive number").max(150, "Please enter a valid age"),
  bloodPressure: z.string().min(1, "Blood pressure is required").regex(/^\d+\/\d+$/, "Format should be systolic/diastolic (e.g., 120/80)"),
  heartRate: z.coerce.number().int().positive("Heart rate must be a positive number").max(300, "Please enter a valid heart rate"),
  sugar: z.coerce.number().positive("Blood sugar must be a positive number"),
  bloodGroup: z.enum(["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"], {
    errorMap: () => ({ message: "Please select a valid blood group" }),
  }),
});

type HealthDataFormValues = z.infer<typeof healthDataSchema>;

interface HealthDataFormProps {
  onSubmit: (data: HealthDataFormValues) => Promise<void>;
  isPending?: boolean;
}

export function HealthDataForm({ onSubmit, isPending = false }: HealthDataFormProps) {
  const form = useForm<HealthDataFormValues>({
    resolver: zodResolver(healthDataSchema),
    defaultValues: {
      name: "",
      age: 0,
      bloodPressure: "",
      heartRate: 0,
      sugar: 0,
      bloodGroup: "O+",
    },
  });

  const handleSubmit = async (data: HealthDataFormValues) => {
    await onSubmit(data);
    form.reset();
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <User className="h-5 w-5" />
          Submit Health Information
        </CardTitle>
        <CardDescription>
          Securely record your private health data
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name *</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter your name"
                      {...field}
                      data-testid="input-name"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="age"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Age *</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="Enter your age"
                      {...field}
                      data-testid="input-age"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="bloodPressure"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Blood Pressure (BP) *</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="e.g., 120/80"
                      {...field}
                      data-testid="input-bp"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="heartRate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Heart Rate (bpm) *</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="e.g., 72"
                      {...field}
                      data-testid="input-heart-rate"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="sugar"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Blood Sugar (mg/dL) *</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="e.g., 90"
                      {...field}
                      data-testid="input-sugar"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="bloodGroup"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Blood Group *</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger data-testid="select-blood-group">
                        <SelectValue placeholder="Select blood group" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="A+">A+</SelectItem>
                      <SelectItem value="A-">A-</SelectItem>
                      <SelectItem value="B+">B+</SelectItem>
                      <SelectItem value="B-">B-</SelectItem>
                      <SelectItem value="AB+">AB+</SelectItem>
                      <SelectItem value="AB-">AB-</SelectItem>
                      <SelectItem value="O+">O+</SelectItem>
                      <SelectItem value="O-">O-</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button
              type="submit"
              className="w-full"
              disabled={isPending}
              data-testid="button-submit-health-data"
            >
              {isPending ? (
                <>
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent mr-2" />
                  Submitting...
                </>
              ) : (
                "Submit Securely"
              )}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
