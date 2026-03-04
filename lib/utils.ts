export const getStatusColor = (status: string) => {
  if (status === "online") return "bg-green-500";
  if (status === "away") return "bg-yellow-400";
  return "bg-slate-400";
};

export const getShieldColor = (rank: string) => {
  if (rank === "Gold") return "text-[#d9a321]";
  if (rank === "Silver") return "text-slate-400";
  return "text-amber-700"; // Bronze
};
