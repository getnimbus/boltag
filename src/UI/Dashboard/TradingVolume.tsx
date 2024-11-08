import { nimbus } from "../../lib/network";
import { useQuery } from "@tanstack/react-query";

export const TradingVolume = ({ userAddress }: { userAddress: string }) => {
  const getTradingVolume = async (address: string) => {
    const response = await nimbus.get(`/swap/${address}/trading-volume-ref`);
    return response;
  };

  // query user profile
  const { isLoading, error, data } = useQuery({
    queryKey: ["trading-volume"],
    queryFn: () => getTradingVolume(userAddress),
    enabled: Boolean(userAddress.length !== 0),
  });

  return (
    <div className="flex flex-col gap-4">
      <div className="text-xl font-medium">Trading Volume with Ref</div>
      <div>chart</div>
    </div>
  );
};
