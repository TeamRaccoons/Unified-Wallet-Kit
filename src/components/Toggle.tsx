import tw from "twin.macro";

type Props = {
  active: boolean;
  onClick: (active: boolean) => void;
  className?: string;
  dotClassName?: string;
};

const Toggle = ({ active, onClick, className, dotClassName }: Props) => {
  const activeClass = tw`bg-white transform translate-x-full`;
  const inactiveClass = tw`bg-white`;
  return (
    <button
      type="button"
      css={[
        tw`w-10 h-[22px] flex items-center rounded-full p-[1px] cursor-pointer`,
        className,
        active ? tw`bg-jupiter-jungle-green`: tw`bg-[#010101]`
      ]}
      onClick={() => onClick(!active)}
    >
      <div
        css={[
          tw`w-[18px] h-[18px] rounded-full shadow-md transform duration-300 ease-in-out`,
          active ? activeClass : inactiveClass,
          dotClassName
        ]}
      ></div>
    </button>
  );
};

export default Toggle;
