import Logo from "../assets/logo.svg";

export const Footer = () => {
  return (
    <div
      className="fixed bottom-0 left-0 z-8 w-full bg-white py-1"
      style={{ boxShadow: "rgba(0, 0, 0, 0.1) 0px 0px 40px" }}
    >
      <div className="flex items-center gap-1 max-w-[1600px] m-auto xl:w-[88%] w-[90%]">
        <div className="text-sm">Powered by</div>
        <img
          src={Logo}
          alt="logo"
          loading="lazy"
          decoding="async"
          className="xl:w-[167px] w-[127px] xl:h-[50px] h-[80px] xl:-ml-8"
        />
      </div>
    </div>
  );
};
