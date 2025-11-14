import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useResponsiveModal } from "@/hooks/use-responsive-modal";
import { useDeleteLead } from "@/hooks/leads";
import { AlertTriangle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";

interface LeadDeleteDialogProps {
  leadId: number;
  children?: React.ReactNode;
}

export default function LeadDeleteDialog({
  leadId,
  children,
}: LeadDeleteDialogProps) {
  const { Root, Trigger, Content, Header, Title, Description, Footer } =
    useResponsiveModal();
  const [dialogOpen, setDialogOpen] = useState(false);

  const navigate = useNavigate();

  const { deleteLead, isPending } = useDeleteLead();

  const queryClient = useQueryClient();

  const handleDelete = () => {
    deleteLead(
      { leadId },
      {
        onSuccess: () => {
          setDialogOpen(false);
          navigate("/dashboard/lead-management");
          queryClient.invalidateQueries({ queryKey: ["analytics"] });
        },
      }
    );
  };

  return (
    <Root open={dialogOpen} onOpenChange={setDialogOpen}>
      <Trigger asChild>
        {children ?? (
          <Button variant="destructive" size="sm">
            Delete Lead
          </Button>
        )}
      </Trigger>

      <Content className="sm:max-w-[420px] p-4 md:p-6 gap-4">
        <Header>
          <div className="flex items-center gap-2">
            <AlertTriangle className="text-destructive" />
            <Title>Delete Lead</Title>
          </div>
          <Description className="text-start">
            Are you sure you want to delete this lead? This action cannot be
            undone.
          </Description>
        </Header>

        <Footer className="flex justify-end gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={() => setDialogOpen(false)}
          >
            Cancel
          </Button>
          <Button
            type="button"
            variant="destructive"
            onClick={handleDelete}
            disabled={isPending}
          >
            {isPending ? "Deleting..." : "Delete"}
          </Button>
        </Footer>
      </Content>
    </Root>
  );
}
