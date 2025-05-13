import { deployStudio } from "./common";

async function main() {
  //yarn run deploy-studio <network> <slug> <version>
  // eg: yarn run deploy-studio base revert-subgraph 0.0.1
  //graph deploy revert-subgraph
  const network = process.argv[2];
  if (!network) {
    console.error("no network parameter passed");
    process.exit(-1);
  }
  const slug = process.argv[3];
  if (!slug) {
    console.error("no slug parameter passed");
    process.exit(-1);
  }
  const version = process.argv[4];
  if (!version) {
    console.error("no version parameter passed");
    process.exit(-1);
  }
  // console.log(`Deploying studio ${network} ${slug} ${version}\n`, process.argv);
  await deployStudio(network, slug, version);
}

main();