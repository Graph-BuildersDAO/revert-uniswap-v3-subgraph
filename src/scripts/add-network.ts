import { addNetwork } from "./common";

async function main() {
  const network = process.argv[2];
  if (!network) {
    console.error("no network parameter passed");
    process.exit(-1);
  }
  // console.log(`Adding network ${network}\n`, process.argv );
  await addNetwork(network);
}

main();