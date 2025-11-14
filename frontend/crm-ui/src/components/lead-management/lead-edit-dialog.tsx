import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useUpdateLead } from "@/hooks/leads";
import type { LeadFormValues } from "@/types/leads";
import { useResponsiveModal } from "@/hooks/use-responsive-modal";
import { useQueryClient } from "@tanstack/react-query";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const leadSchema = z.object({
  first_name: z.string().min(1, "First name is required"),
  last_name: z.string().min(1, "Last name is required"),
  email: z
    .string()
    .min(1, "Email is required")
    .regex(emailRegex, "Invalid email address"),
  phone: z.string().optional(),
  status: z.string().min(1),
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

type LeadEditDialogProps = {
  lead: LeadFormValues & { id: number };
  children?: React.ReactNode;
};

export default function LeadEditDialog({
  lead,
  children,
}: LeadEditDialogProps) {
  const [open, setOpen] = useState(false);
  const { updateLead, isPending } = useUpdateLead();

  const form = useForm<LeadFormValues>({
    resolver: zodResolver(leadSchema),
    defaultValues: {
      ...lead,
      budget_min: lead.budget_min ?? undefined,
      budget_max: lead.budget_max ?? undefined,
    },
  });

  const queryClient = useQueryClient();

  useEffect(() => {
    form.reset({
      ...lead,
      budget_min: lead.budget_min ?? undefined,
      budget_max: lead.budget_max ?? undefined,
    });
  }, [lead, form]);

  const onSubmit = async (values: LeadFormValues) => {
    await updateLead(
      {
        leadId: lead.id,
        data: {
          ...values,
          budget_min: values.budget_min ? values.budget_min : undefined,
          budget_max: values.budget_max ? values.budget_max : undefined,
        },
      },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: ["lead", lead.id] });
          queryClient.invalidateQueries({ queryKey: ["analytics"] });
        },
      }
    );
  };

  const { Root, Trigger, Content, Header, Title, Description } =
    useResponsiveModal();

  return (
    <Root open={open} onOpenChange={setOpen}>
      <Trigger asChild>
        {children ?? <Button variant="outline">Edit Lead</Button>}
      </Trigger>
      <Content className="sm:max-w-[500px] p-4 md:p-6 gap-">
        <Header>
          <Title>Edit Lead</Title>
          <Description> </Description>
        </Header>

        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-col gap-4 overflow-y-auto"
        >
          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1.5">
              <Label>First Name</Label>
              <Input {...form.register("first_name")} />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label>Last Name</Label>
              <Input {...form.register("last_name")} />
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <Label>Email</Label>
            <Input {...form.register("email")} />
          </div>

          <div className="flex flex-col gap-1.5">
            <Label>Phone</Label>
            <Input {...form.register("phone")} />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1.5">
              <Label>Status</Label>
              <Select
                defaultValue={lead.status}
                onValueChange={(val) => form.setValue("status", val)}
              >
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

            <div className="flex flex-col gap-1.5">
              <Label>Source</Label>
              <Input {...form.register("source")} />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1.5">
              <Label>Budget Min</Label>
              <Input type="number" {...form.register("budget_min")} />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label>Budget Max</Label>
              <Input type="number" {...form.register("budget_max")} />
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <Label>Property Interest</Label>
            <Input {...form.register("property_interest")} />
          </div>

          <div className="flex md:flex-row flex-col justify-end gap-2 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isPending}>
              {isPending ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </form>
      </Content>
    </Root>
  );
}
