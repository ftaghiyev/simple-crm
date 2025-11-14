import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useResponsiveModal } from "@/hooks/use-responsive-modal";
import { FiPlus } from "react-icons/fi";
import { useCreateLead } from "@/hooks/leads";
import { useQueryClient } from "@tanstack/react-query";

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const leadSchema = z.object({
  first_name: z.string().min(1, "First name is required"),
  last_name: z.string().min(1, "Last name is required"),
  email: z
    .string()
    .min(1, "Email is required")
    .regex(emailRegex, "Invalid email address"),
  phone: z.string().optional(),
  status: z.string().min(1, "Status is required"),
  source: z.string().optional(),
  budget_min: z.coerce
    .number<number>()
    .transform((v) => (isNaN(v) ? undefined : v))
    .optional(),
  budget_max: z.coerce
    .number<number>()
    .transform((v) => (isNaN(v) ? undefined : v))
    .optional(),
  property_interest: z.string().optional(),
});

type LeadFormValues = z.infer<typeof leadSchema>;

interface LeadCreateDialog {
  children?: React.ReactNode;
}

function LeadCreateDialog({ children }: LeadCreateDialog) {
  const { Root, Trigger, Content, Header, Title, Description, Footer } =
    useResponsiveModal();
  const [dialogOpen, setDialogOpen] = useState(false);
  const { create, isPending } = useCreateLead();

  const { register, handleSubmit, setValue } = useForm<LeadFormValues>({
    resolver: zodResolver(leadSchema),
  });

  const queryClient = useQueryClient();

  const onSubmit = (values: LeadFormValues) => {
    create(
      {
        ...values,
        budget_min: values.budget_min ? values.budget_min : undefined,
        budget_max: values.budget_max ? values.budget_max : undefined,
      },
      {
        onSuccess: () =>
          queryClient.invalidateQueries({ queryKey: ["analytics"] }),
      }
    );
  };

  return (
    <Root open={dialogOpen} onOpenChange={setDialogOpen}>
      <Trigger asChild>
        {children ?? (
          <Button className="text-sm text-secondary">
            <FiPlus /> Add Lead
          </Button>
        )}
      </Trigger>

      <Content className="sm:max-w-[500px] p-4 md:p-6 gap-4">
        <Header>
          <Title>Add New Lead</Title>
          <Description>
            Fill in the details below to create a new lead.
          </Description>
        </Header>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col gap-4 overflow-y-auto"
        >
          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-2">
              <Label>First Name</Label>
              <Input placeholder="John" {...register("first_name")} />
            </div>
            <div className="flex flex-col gap-2">
              <Label>Last Name</Label>
              <Input placeholder="Doe" {...register("last_name")} />
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <Label>Email</Label>
            <Input placeholder="john.doe@example.com" {...register("email")} />
          </div>

          <div className="flex flex-col gap-2">
            <Label>Phone</Label>
            <Input placeholder="+1 555 123 4567" {...register("phone")} />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-2">
              <Label>Status</Label>
              <Select onValueChange={(val) => setValue("status", val)}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="new">New</SelectItem>
                  <SelectItem value="contacted">Contacted</SelectItem>
                  <SelectItem value="qualified">Qualified</SelectItem>
                  <SelectItem value="negotiation">Negotiation</SelectItem>
                  <SelectItem value="closed">Closed</SelectItem>
                  <SelectItem value="lost">Lost</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex flex-col gap-2">
              <Label>Source</Label>
              <Input
                placeholder="e.g. Website, Referral"
                {...register("source")}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-2">
              <Label>Budget Min</Label>
              <Input
                type="number"
                placeholder="e.g. 100000"
                {...register("budget_min")}
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label>Budget Max</Label>
              <Input
                type="number"
                placeholder="e.g. 500000"
                {...register("budget_max")}
              />
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <Label>Property Interest</Label>
            <Input
              placeholder="e.g. 2-bedroom apartment"
              {...register("property_interest")}
            />
          </div>

          <Footer className="flex justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isPending}>
              {isPending ? "Saving..." : "Create Lead"}
            </Button>
          </Footer>
        </form>
      </Content>
    </Root>
  );
}

export default LeadCreateDialog;
