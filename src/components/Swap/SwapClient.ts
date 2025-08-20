interface SwapInfo {
  inputMint: string;
  outputMint: string;
  inAmount: string;
  outAmount: string;
  ammKey: string;
  label: string;
  feeAmount: string;
  feeMint: string;
}

interface RoutePlan {
  swapInfo: SwapInfo;
  percent: number;
}

export interface SwapQuoteResponse {
  mode: string;
  swapMode: string;
  inputMint: string;
  outputMint: string;
  inAmount: string;
  outAmount: string;
  otherAmountThreshold: string;
  slippageBps: number;
  priceImpactPct: string;
  routePlan: RoutePlan[];
  feeMint: string;
  feeBps: number;
  prioritizationFeeLamports: number;
  swapType: string;
  router: string;
  transaction: string | null;
  gasless: boolean;
  requestId: string;
  taker: string | null;
  inUsdValue: number;
  outUsdValue: number;
  priceImpact: number;
  swapUsdValue: number;
  totalTime: number;
}

interface ExecuteResponse {
  success: boolean;
  signature: string;
  slot: string;
}

class SwapClient {
  async getSwapQuote(inputMint: string, outputMint: string, amount: number, owner: string): Promise<SwapQuoteResponse | undefined> {
    try {
      const quoteResponse = await fetch(
        `https://ultra-api.jup.ag/order?inputMint=${inputMint}&outputMint=${outputMint}&amount=${amount}&swapMode=ExactIn&slippageBps=10&broadcastFeeType=maxCap&priorityFeeLamports=1000000&useWsol=false&asLegacyTransaction=false&excludeDexes=&excludeRouters=&taker=${owner}`,
        {
          headers: {
            accept: '*/*',
            'Referrer-Policy': 'strict-origin-when-cross-origin',
          },
        },
      );

      const result: SwapQuoteResponse = await quoteResponse.json();
      return result;
    } catch (error) {
      console.log({ error });
    }
  }

  async swap(
    signedTransaction: string,
    requestId: string,
  ): Promise<ExecuteResponse> {
    const result = await (
      fetch("https://ultra-api.jup.ag/execute", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          signedTransaction: signedTransaction,
          requestId: requestId,
        }),
      })
    );

    return await result.json();
  }
}

const swapClient = new SwapClient();

export default swapClient;
