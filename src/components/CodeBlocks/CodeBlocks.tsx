import React, { useMemo } from 'react';
import 'twin.macro';
import { useEffect, useState } from 'react';
import SyntaxHighlighter from 'react-syntax-highlighter';
import { vs2015 } from 'react-syntax-highlighter/dist/cjs/styles/hljs';
import Collapse from '../Collapse';
import tw from 'twin.macro';
import ChevronDownIcon from '../icons/ChevronDownIcon';
import ChevronUpIcon from '../icons/ChevronUpIcon';
import { UnifiedWalletProvider } from '../../contexts/UnifiedWalletProvider';

import prettier from 'prettier/standalone';
import prettierPluginBabel from 'prettier/plugins/babel';
import prettierPluginEstree from 'prettier/plugins/estree';
import prettierPluginTypescript from 'prettier/plugins/typescript';

const CodeBlocks: React.FC<{ params: Omit<Parameters<typeof UnifiedWalletProvider>[0], 'children'>, unparsedWalletDeclarationString: string, unparsedWalletPropsString: string }> = ({
  params,
  unparsedWalletDeclarationString,
  unparsedWalletPropsString,
}) => {
  const USE_WALLET_SNIPPET = useMemo(() => `import { UnifiedWalletProvider } from '@jup-ag/wallet-adapter';
  const App = () => {
    ${unparsedWalletDeclarationString || ''}
    return (
      <UnifiedWalletProvider
        ${unparsedWalletPropsString}
        ${Object.keys(params)
          .filter((key) => key !== 'wallets')
          .map((key) => {
            const value = JSON.stringify(params[key], null, 2);
            return `${key}={${value}}`;
          })
          .join('\n\t\t')}
      >
        <UnifiedWalletButton />
      </UnifiedWalletProvider>
    )
  }
`, [params]);

  const [snippet, setSnippet] = useState(``);

  useEffect(() => {
    prettier
      .format(USE_WALLET_SNIPPET, { parser: 'typescript', plugins: [prettierPluginBabel, prettierPluginEstree, prettierPluginTypescript] })
      .then((res) => {
        setSnippet(res);
      });
  }, [USE_WALLET_SNIPPET])

  const [isCopied, setIsCopied] = useState(false);

  useEffect(() => {
    setTimeout(() => {
      setIsCopied(false);
    }, 2000);
  }, [isCopied]);

  const copyToClipboard = () => {
    if (isCopied) return;
    navigator.clipboard.writeText(snippet);
    setIsCopied(true);
  };

  const [expanded, setExpanded] = useState(false);

  return (
    <>
      <Collapse height={0} maxHeight={'auto'} expanded={expanded}>
        <div className='hideScrollbar' tw="flex flex-col items-center justify-center mt-4 text-white overflow-scroll">
          <div tw="relative w-full max-w-3xl px-4 md:px-0">
            <div tw="flex w-full justify-between ">
              <p tw="text-white self-start pb-2 font-semibold">Code snippet</p>
              <button
                css={[
                  tw`text-xs text-white border rounded-xl px-2 py-1 opacity-50 hover:opacity-100`,
                  isCopied ? tw`opacity-100 cursor-wait` : '',
                ]}
                onClick={copyToClipboard}
              >
                {isCopied ? 'Copied!' : 'Copy to clipboard'}
              </button>
            </div>

            <SyntaxHighlighter wrapLines language="typescript" showLineNumbers style={vs2015}>
              {snippet}
            </SyntaxHighlighter>
          </div>
        </div>
      </Collapse>

      <div tw="mt-2 w-full text-white font-semibold">
        <button
          type="button"
          tw="w-full text-sm text-white p-2 opacity-50 hover:opacity-100"
          onClick={() => setExpanded(!expanded)}
        >
          {expanded ? `Hide Snippet` : `Show snippet`}
          {expanded ? <ChevronUpIcon tw="inline-block ml-2" /> : <ChevronDownIcon tw="inline-block ml-2" />}
        </button>
      </div>
    </>
  );
};

export default CodeBlocks;
