import { BubbleAnimateBg } from "../components/BubbleAnimateBg";

function Dashboard() {
  return (
    <div className="relative overflow-hidden lg:pt-20 pt-[104px] pb-[144px] min-h-screen flex justify-center items-center">
      <div
        className="relative z-20 max-w-[1600px] m-auto xl:w-[88%] w-[90%] py-2 bg-white rounded-[20px] p-6 min-h-screen"
        style={{ boxShadow: "0px 0px 40px 0px rgba(0, 0, 0, 0.1)" }}
      >
        Dashboard
      </div>

      <BubbleAnimateBg isMainPage={false} />
    </div>
  );
}

export default Dashboard;
