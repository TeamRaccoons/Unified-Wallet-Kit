import classNames from 'classnames';
import SwapIcon from '../../icons/SwapIcon';
import RepoLogo from '../../icons/RepoLogo';
import DiscordIcon from '../../icons/DiscordIcon';
import tw from 'twin.macro';


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
        tw`flex items-center font-semibold hover:text-white`,
        isActive && tw`!text-white`,
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
    <div tw="flex-1 justify-center hidden md:!flex text-sm text-white/[.35] space-x-10 fill-current">
      <HeaderLink href="/" isActive title={'Demo'} icon={<SwapIcon width="20" height="20" />} />
      <HeaderLink
        href="https://github.com/jup-ag/terminal"
        isActive={false}
        external
        title={'Repo'}
        icon={<RepoLogo width="20" height="20" />}
      />
      <HeaderLink
        href="https://docs.jup.ag/integrating-jupiter/web-app-integration/jupiter-terminal"
        isActive={false}
        external
        title={'Docs'}
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
