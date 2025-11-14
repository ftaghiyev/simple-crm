export const getStatusColor = (status: string) => {
  switch (status.toLowerCase()) {
    case "new":
      return "bg-blue-100 text-blue-800";
    case "contacted":
      return "bg-yellow-100 text-yellow-800";
    case "qualified":
      return "bg-green-100 text-green-800";
    case "negotiation":
      return "bg-purple-100 text-purple-800";
    case "closed":
      return "bg-emerald-100 text-emerald-800";
    case "lost":
      return "bg-red-100 text-red-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};
