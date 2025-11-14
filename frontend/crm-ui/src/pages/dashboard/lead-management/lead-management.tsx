import { useMediaQuery } from "react-responsive";
import LeadManagementMobile from "./lead-management-mobile";
import LeadManagementDesktop from "./lead-management-desktop";

function Appointments() {
  const isMobile = useMediaQuery({ maxWidth: 768 });

  return (
    <div className="flex flex-col w-full">
      {isMobile ? <LeadManagementMobile /> : <LeadManagementDesktop />}
    </div>
  );
}

export default Appointments;
