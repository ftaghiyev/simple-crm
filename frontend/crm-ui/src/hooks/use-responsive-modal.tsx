import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useMediaQuery } from "react-responsive";

export function useResponsiveModal() {
  const isMobile = useMediaQuery({ maxWidth: 768 });

  return {
    Root: isMobile ? Drawer : Dialog,
    Trigger: isMobile ? DrawerTrigger : DialogTrigger,
    Content: isMobile ? DrawerContent : DialogContent,
    Header: isMobile ? DrawerHeader : DialogHeader,
    Title: isMobile ? DrawerTitle : DialogTitle,
    Description: isMobile ? DrawerDescription : DialogDescription,
    Footer: isMobile ? DrawerFooter : DialogFooter,
  };
}
