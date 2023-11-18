import { type NextRequest, NextResponse } from "next/server";
export interface EtherscanContractCreationResponse {
  status: string;
  message: string;
  result: EtherscanContractCreationResult[];
}

export interface EtherscanContractCreationResult {
  contractAddress: string;
  contractCreator: string;
  txHash: string;
}
export type ChainIds =
  | "1"
  | "5"
  | "42161"
  | "10"
  | "137"
  | "42220"
  | "56"
  | "8453"
  | "250"
  | "43114"
  | "11155111";
export async function GET(req: NextRequest) {
  req.headers.set("Access-Control-Allow-Origin", "*");
  req.headers.set(
    "Access-Control-Allow-Methods",
    "GET,OPTIONS,PATCH,DELETE,POST,PUT"
  );
  req.headers.set("Access-Control-Allow-Headers", "Content-Type");
  let chainId: ChainIds = req.nextUrl.searchParams.get("chainId") as ChainIds;
  let address: string = req.nextUrl.searchParams.get("address") as string;
  let apiUrl = "https://api.etherscan.io/api";
  let apiKey = process.env.API_KEY;
  switch (chainId) {
    case "1":
      break;
    case "42161":
      apiUrl = "https://api.arbiscan.io/api";
      apiKey = process.env.ARBI_API_KEY;
      break;
    case "10":
      apiUrl = "https://api-optimistic.etherscan.io/api";
      apiKey = process.env.OP_API_KEY;
      break;
    case "137":
      apiUrl = "https://api.polygonscan.com/api";
      apiKey = process.env.POLYGON_API_KEY;
      break;
    case "250":
      apiUrl = "https://api.ftmscan.com/api";
      apiKey = process.env.FTM_API_KEY;
      break;
    case "43114":
      apiUrl = "https://api.snowtrace.io/api";
      apiKey = process.env.AVAX_API_KEY;
      break;
    case "10":
      apiUrl = "https://api.basescan.org/api";
      apiKey = process.env.BASE_API_KEY;
      break;
    default:
      apiUrl = "nooption";
      break;
  }
  if (apiUrl === "nooption") {
    return NextResponse.json({ nooption: true, apiKey });
  }
  let fetchUrl =
    `${apiUrl}` +
    `?module=contract` +
    `&action=getcontractcreation` +
    `&contractaddresses=${address}` +
    `&apikey=${apiKey}`;
  try {
    let contractCreatorAddressResponse = await fetch(fetchUrl);
    const json =
      (await contractCreatorAddressResponse.json()) as EtherscanContractCreationResponse;
    console.log("json", json);
    console.log("yes results 0", json?.result[0]);
    return NextResponse.json(json);
  } catch (error) {
    return NextResponse.json({ nooption: true, error });
  }
}
function daysSinceTimestampInSeconds(timestampInSeconds: number): number {
  // Convert seconds to milliseconds
  const timestampInMillis = timestampInSeconds * 1000;

  // Get the current timestamp in milliseconds
  const currentTimestamp = new Date().getTime();

  // Calculate the time difference in milliseconds
  const timeDifference = currentTimestamp - timestampInMillis;

  // Convert milliseconds to days
  const daysDifference = Math.floor(timeDifference / (1000 * 60 * 60 * 24));

  return daysDifference;
}
