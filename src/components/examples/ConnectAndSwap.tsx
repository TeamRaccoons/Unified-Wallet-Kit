import 'twin.macro';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { JupiterSwap } from '../Swap';
import { UnifiedWalletButton } from '../UnifiedWalletButton';
import { UnifiedWalletProvider } from 'src/contexts/UnifiedWalletProvider';
import CodeBlocks from '../CodeBlocks/CodeBlocks';

interface ConnectAndSwapProps {
  unparsedWalletDeclarationString: string;
  unparsedWalletPropsString: string;
  params: Omit<Parameters<typeof UnifiedWalletProvider>[0], 'children'>;
}

const ConnectAndSwap = ({ params, unparsedWalletDeclarationString, unparsedWalletPropsString }: ConnectAndSwapProps) => {
  const queryClient = new QueryClient();

  return (
    <div tw="flex flex-col items-center w-full">
      <div tw="flex flex-1 items-center justify-center gap-6 w-full">
        <QueryClientProvider client={queryClient}>
          <UnifiedWalletProvider {...params}>
            <UnifiedWalletButton />
            <JupiterSwap />
          </UnifiedWalletProvider>
        </QueryClientProvider>
      </div>

      <div tw="w-full overflow-x-auto">
        <CodeBlocks
          params={params}
          unparsedWalletDeclarationString={unparsedWalletDeclarationString}
          unparsedWalletPropsString={unparsedWalletPropsString}
        />
      </div>
    </div>
  );
};

export default ConnectAndSwap;
