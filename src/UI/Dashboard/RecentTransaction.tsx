import { useQuery } from "@tanstack/react-query";
import { nimbus } from "../../lib/network";

export const RecentTransaction = ({ userAddress }: { userAddress: string }) => {
  const getRecentTrx = async (address: string) => {
    const response = await nimbus.get(`/swap/${address}/transaction-ref`);
    return response;
  };

  // query recent trx
  const { isLoading, error, data } = useQuery({
    queryKey: ["recent-tx", userAddress],
    queryFn: () => getRecentTrx(userAddress),
    enabled: Boolean(userAddress.length !== 0),
  });

  console.log("userAddress: ", userAddress);

  console.log("data: ", data);

  return (
    <div className="flex flex-col gap-4">
      <div className="text-xl font-medium">Recent Transaction with Ref</div>
      <div>table</div>
    </div>
  );
};
