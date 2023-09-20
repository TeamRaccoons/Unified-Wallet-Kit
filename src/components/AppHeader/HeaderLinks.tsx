import tw from 'twin.macro';

import SwapIcon from '../../icons/SwapIcon';
import RepoLogo from '../../icons/RepoLogo';
import DiscordIcon from '../../icons/DiscordIcon';

const HeaderLink = ({
  href,
  isActive,
  title,
  icon,
  external = false,
}: {
  href: string;
  isActive: boolean;
  title: string | React.ReactNode;
  icon: React.ReactNode;
  external?: boolean;
}) => {
  return (
    <a
      href={href}
      css={[
        tw`flex items-center font-semibold text-white/50 hover:text-white fill-current h-[60px] px-4`,
        isActive && tw`bg-v3-bg !text-v3-primary`,
      ]}
      {...(external
        ? {
            target: '_blank',
            rel: 'noopener noreferrer',
          }
        : {})}
    >
      <span tw="w-5">{icon}</span>
      <span tw="ml-2 whitespace-nowrap">{title}</span>
    </a>
  );
};

const HeaderLinks = () => {
  return (
    <div tw="flex-1 justify-center hidden md:!flex text-sm h-full">
      <HeaderLink href="/" isActive title={'Demo'} icon={<SwapIcon width="20" height="20" />} />
      <HeaderLink
        href="https://github.com/TeamRaccoons/wallet-kit"
        isActive={false}
        external
        title={'Repo'}
        icon={<RepoLogo width="20" height="20" />}
      />
      <HeaderLink
        href="https://discord.gg/jup"
        isActive={false}
        external
        title={'Discord'}
        icon={<DiscordIcon width="20" height="20" />}
      />
    </div>
  );
};

export default HeaderLinks;
