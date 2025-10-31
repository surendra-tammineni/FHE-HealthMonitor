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
import { Activity, Heart, Droplet, Footprints, Weight, Moon } from "lucide-react";

const healthDataSchema = z.object({
  dataType: z.enum(["heartRate", "bloodPressure", "glucose", "steps", "weight", "sleep"]),
  value: z.coerce.number().int().positive("Value must be a positive number"),
  unit: z.string(),
});

type HealthDataFormValues = z.infer<typeof healthDataSchema>;

interface HealthDataFormProps {
  onSubmit: (data: HealthDataFormValues) => Promise<void>;
  isPending?: boolean;
}

const dataTypeOptions = [
  { value: "heartRate", label: "Heart Rate", unit: "bpm", icon: Heart },
  { value: "bloodPressure", label: "Blood Pressure", unit: "mmHg", icon: Activity },
  { value: "glucose", label: "Blood Glucose", unit: "mg/dL", icon: Droplet },
  { value: "steps", label: "Steps", unit: "steps", icon: Footprints },
  { value: "weight", label: "Weight", unit: "lbs", icon: Weight },
  { value: "sleep", label: "Sleep Duration", unit: "hours", icon: Moon },
];

export function HealthDataForm({ onSubmit, isPending = false }: HealthDataFormProps) {
  const form = useForm<HealthDataFormValues>({
    resolver: zodResolver(healthDataSchema),
    defaultValues: {
      dataType: "heartRate",
      value: 0,
      unit: "bpm",
    },
  });

  const selectedDataType = form.watch("dataType");
  const selectedOption = dataTypeOptions.find((opt) => opt.value === selectedDataType);

  const handleDataTypeChange = (value: string) => {
    const option = dataTypeOptions.find((opt) => opt.value === value);
    if (option) {
      form.setValue("unit", option.unit);
    }
  };

  const handleSubmit = async (data: HealthDataFormValues) => {
    await onSubmit(data);
    form.reset();
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Submit Health Data</CardTitle>
        <CardDescription>
          Record your health metrics to the blockchain
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="dataType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Data Type *</FormLabel>
                  <Select
                    onValueChange={(value) => {
                      field.onChange(value);
                      handleDataTypeChange(value);
                    }}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger data-testid="select-data-type">
                        <SelectValue placeholder="Select health metric" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {dataTypeOptions.map((option) => {
                        const Icon = option.icon;
                        return (
                          <SelectItem key={option.value} value={option.value}>
                            <div className="flex items-center gap-2">
                              <Icon className="h-4 w-4" />
                              {option.label}
                            </div>
                          </SelectItem>
                        );
                      })}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="value"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Value *</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="Enter value"
                      {...field}
                      data-testid="input-value"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="unit"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Unit</FormLabel>
                  <FormControl>
                    <Input {...field} disabled data-testid="input-unit" />
                  </FormControl>
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
                "Submit to Blockchain"
              )}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
