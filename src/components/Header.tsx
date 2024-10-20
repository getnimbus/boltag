import Bolt from "../assets/bolt.png";

export const Header = () => {
  return (
    <div className="max-w-[1600px] m-auto xl:w-[88%] w-[90%] py-2">
      <div className="flex items-center -ml-4">
        <img src={Bolt} alt="logo" className="w-12 h-12" />
        <div className="-ml-2 font-medium">Bolt</div>
      </div>
    </div>
  );
};
