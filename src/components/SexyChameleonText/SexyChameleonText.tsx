import { ReactNode } from 'react';
import 'twin.macro'

const SexyChameleonText = ({ children }: { children: ReactNode; }) => {
  return <span tw="text-transparent bg-clip-text bg-gradient-to-r from-[rgba(252,192,10,1)] to-[rgba(78,186,233,1)]">{children}</span>;
};

export default SexyChameleonText;
