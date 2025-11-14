import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { useState } from "react";
import { toast } from "sonner";
import { useCreateActivity } from "@/hooks/activities";
import { useQueryClient } from "@tanstack/react-query";

const activitySchema = z.object({
  activity_type: z
    .enum(["call", "email", "meeting", "note"])
    .refine((val) => !!val, {
      message: "Select activity type",
    }),

  title: z.string().min(1, "Title is required"),

  notes: z.string().optional(),

  duration: z
    .number()
    .optional()
    .refine((val) => val === undefined || val >= 0, {
      message: "Duration must be positive",
    }),

  activity_date: z.date().refine((val) => val instanceof Date, {
    message: "Activity date is required",
  }),
});

export type ActivityFormValues = z.infer<typeof activitySchema>;

interface LeadActivityFormProps {
  leadId: number;
}

export default function LeadActivityForm({ leadId }: LeadActivityFormProps) {
  const [open, setOpen] = useState(false);
  const { create, isPending } = useCreateActivity(leadId);

  const form = useForm<ActivityFormValues>({
    resolver: zodResolver(activitySchema),
    defaultValues: {
      activity_type: "note",
      title: "",
      notes: "",
      duration: undefined,
      activity_date: new Date(),
    },
  });

  const queryClient = useQueryClient();

  const activityType = form.watch("activity_type");

  const onSubmit = (values: ActivityFormValues) => {
    const formattedDate = values.activity_date
      ? values.activity_date.toISOString().split("T")[0]
      : "";

    if (!formattedDate) {
      toast.error("Date should be specified.");
      return;
    }

    create(
      {
        ...values,
        activity_date: formattedDate,
        duration: activityType === "call" ? values.duration : undefined,
      },
      {
        onSuccess: () => {
          form.reset({ ...values, title: "", notes: "" });
          queryClient.invalidateQueries({ queryKey: ["analytics"] });
        },
      }
    );
  };

  return (
    <form
      onSubmit={form.handleSubmit(onSubmit)}
      className="flex flex-col gap-4 border border-border rounded-xl p-4"
    >
      <h4 className="font-medium text-base">Add New Activity</h4>

      <div className="flex flex-col gap-2">
        <Label>Activity Type</Label>
        <Select
          value={form.watch("activity_type")}
          onValueChange={(v) =>
            form.setValue(
              "activity_type",
              v as ActivityFormValues["activity_type"]
            )
          }
        >
          <SelectTrigger className="w-full md:w-fit">
            <SelectValue placeholder="Select type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="call">Call</SelectItem>
            <SelectItem value="email">Email</SelectItem>
            <SelectItem value="meeting">Meeting</SelectItem>
            <SelectItem value="note">Note</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="flex flex-col gap-2">
        <Label>Title</Label>
        <Input placeholder="Follow-up discussion" {...form.register("title")} />
        {form.formState.errors.title && (
          <p className="text-xs text-red-500">
            {form.formState.errors.title.message}
          </p>
        )}
      </div>

      <div className="flex flex-col gap-2">
        <Label>Notes</Label>
        <Textarea
          placeholder="Add details about the interaction..."
          {...form.register("notes")}
        />
      </div>

      {activityType === "call" && (
        <div className="flex flex-col gap-2">
          <Label>Duration (minutes)</Label>
          <Input
            type="number"
            placeholder="e.g. 15"
            {...form.register("duration", { valueAsNumber: true })}
          />
        </div>
      )}

      <div className="flex flex-col gap-2">
        <Label>Date</Label>
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className={cn(
                "justify-start text-left font-normal",
                !form.watch("activity_date") && "text-muted-foreground"
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {form.watch("activity_date")
                ? format(form.watch("activity_date"), "PPP")
                : "Pick a date"}
            </Button>
          </PopoverTrigger>
          <PopoverContent align="start" className="w-auto p-0">
            <Calendar
              mode="single"
              selected={form.watch("activity_date")}
              onSelect={(date) => {
                form.setValue("activity_date", date ?? new Date());
                setOpen(false);
              }}
            />
          </PopoverContent>
        </Popover>
      </div>

      <div className="flex justify-end pt-2">
        <Button type="submit" disabled={isPending}>
          {isPending ? "Adding..." : "Add Activity"}
        </Button>
      </div>
    </form>
  );
}
