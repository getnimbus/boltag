import Bolt from "../assets/bolt.png";

export const Header = () => {
  return (
    <div className="fixed top-0 left-0 z-30 w-full backdrop-blur-sm bg-white/30">
      <div className="max-w-[1600px] m-auto xl:w-[88%] w-[90%] py-2">
        <div className="flex items-center -ml-4">
          <img src={Bolt} alt="logo" className="w-12 h-12" />
          <div className="-ml-2 font-medium">Bolt</div>
        </div>
      </div>
    </div>
  );
};
