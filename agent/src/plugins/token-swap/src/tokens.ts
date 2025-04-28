/**
 * Dictionary of top tokens on Rootstock with their addresses
 */

export type RootstockTokenName =
  | "RBTC"
  | "DOC"
  | "RIF"
  | "SOV"
  | "BPRO"
  | "RUSDT";
export type TokenName = RootstockTokenName;

/**
 * Dictionary of top tokens on Rootstock with their addresses
 */
export const ROOTSTOCK_TOKENS: Record<RootstockTokenName, string> = {
  // Native RBTC token (Rootstock's native token)
  RBTC: "0x542fDA317318eBF1d3DEAf76E0b632741A7e677d", // Native token

  // Dollar on Chain (DOC) - Rootstock stablecoin
  DOC: "0xe700691dA7b9851F2F35f8b8182c69c53CcaD9Db",

  // RIF Token - RSK Infrastructure Framework
  RIF: "0x2aCC95758f8b5F583470bA265Eb685a8f45fC9D5",

  // Sovryn Token
  SOV: "0xEFc78fc7d48b64958315949279Ba181c2114ABBd",

  // BitPRO - Rootstock stability token
  BPRO: "0x440bBd6a888a36DE6e2F6A25f65bc4e16874faa9",

  // RUSDT - Rootstock USDT
  RUSDT: "0xEf213441a85DF4d7acBdAe0Cf78004E1e486BB96",
};

/**
 * Function to get token address by name
 * @param tokenName The name of the token
 * @returns The address of the token or undefined if not found
 */
export function getTokenAddress(
  tokenName: string
): string | undefined {
  const normalizedName = tokenName.toUpperCase() as TokenName;
  return ROOTSTOCK_TOKENS[normalizedName as RootstockTokenName];
}

/**
 * Function to get token name by address
 * @param address The address of the token
 * @returns The name of the token or undefined if not found
 */
export function getTokenName(
  address: string
): TokenName | undefined {
  const normalizedAddress = address.toLowerCase();

  for (const [name, tokenAddress] of Object.entries(ROOTSTOCK_TOKENS)) {
    if (tokenAddress.toLowerCase() === normalizedAddress) {
      return name as TokenName;
    }
  }

  return undefined;
}