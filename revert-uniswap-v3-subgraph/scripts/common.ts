const util = require("util");
const exec = util.promisify(require("child_process").exec);
import 'dotenv/config'
import * as fs from 'fs';


const GRAFTING_SUBGRAPH_ID=process.env.GRAFTING_SUBGRAPH_ID || "";
const GRAFTING_START_BLOCK=process.env.GRAFTING_START_BLOCK || "";
const FACTORY_STARTBLOCK=process.env.FACTORY_STARTBLOCK!;
const FACTORY_CONTRACT_ADDRESS=process.env.FACTORY_CONTRACT_ADDRESS!;
const NONFUNGIBLEPOSITIONMANAGER_STARTBLOCK=process.env.NONFUNGIBLEPOSITIONMANAGER_STARTBLOCK!;
const NONFUNGIBLEPOSITIONMANAGER_CONTRACT=process.env.NONFUNGIBLEPOSITIONMANAGER_CONTRACT!;
const SUBGRAPH_STUDIO_DEPLOY_KEY = process.env.SUBGRAPH_STUDIO_DEPLOY_KEY!



const executeCommand = async (command:any) => {
  try {
    const { stdout, stderr } = await exec(command);
    if (stderr) {
      console.log(`stderr: ${stderr}`);
    }
    console.log("stdout:", stdout);
  } catch (e) {
    // should contain code (exit code) and signal (that caused the termination).
    console.error(`exec error: ${e}`);
  }
};

// Dynamically find the correct Graph CLI to use
const findGraphCli = async () => {
  try {
    const isWindows = process.platform === 'win32';
    const findCommand = isWindows ? 'where' : 'which';
    
   
    const { stdout } = await exec(`${findCommand} graph`);
    const paths = stdout.trim().split('\n').map((p: string) => p.trim());
    
    if (paths.length === 0) {
      console.log('No Graph CLI found, falling back to "graph" command');
      return 'graph';
    }
    
    let globalPath = null;
    
    if (isWindows) {
      globalPath = paths.find((p: string | string[]) => p.includes('Program Files'));
    } else {
      globalPath = paths.find((p: string) => 
        p.startsWith('/usr/local/bin/') || 
        p.startsWith('/usr/bin/') || 
        p.startsWith('/opt/') ||
        p.includes('/.nvm/') ||
        p.includes('/n/bin/')
      );
    }
    
    if (globalPath) {
      console.log(`Using global Graph CLI at: ${globalPath}`);
      return isWindows ? `"${globalPath}"` : globalPath.includes(' ') ? `"${globalPath}"` : globalPath;
    }
    
    console.log(`Using Graph CLI at: ${paths[0]}`);
    return isWindows || paths[0].includes(' ') ? `"${paths[0]}"` : paths[0];
  } catch (error) {
    console.log('Error finding Graph CLI:', error);
    console.log('Falling back to default "graph" command');
    return 'graph';
  }
};

const graphCodegen = async () => {
  console.log("\n Running codegen...");
  const graphCliPath = await findGraphCli();

  await executeCommand(`${graphCliPath} codegen --output-dir ./src/types/`);
};


const graphBuild = async () => {
  const graphCliPath = await findGraphCli();
  await executeCommand(`${graphCliPath} build`);
};

/**
 * Authenticate with The Graph using deploy key
 */
const graphAuth = async (): Promise<void> => {
  console.log("\n Authenticating with The Graph...");
  
  if (!SUBGRAPH_STUDIO_DEPLOY_KEY) {
    throw new Error(
      "Missing access token in SUBGRAPH_STUDIO_DEPLOY_KEY env. You can get a token from https://thegraph.com/studio/"
    );
  }
  
  // Using the @graphprotocol/graph-cli directly would be better, but for now let's fix the command execution
  try {
    // Instead of just passing the key to graph auth, we'll use the full command format
    const authOutput = await executeCommand(`graph auth --studio ${SUBGRAPH_STUDIO_DEPLOY_KEY}`);
    console.log("Authentication successful:", authOutput);
  } catch (error) {
    console.error("Authentication failed:", error);
    throw error;
  }
};

/**
 * Deploy the subgraph to Graph Studio
 */
const graphDeployStudio = async (slug: string, version: string): Promise<void> => {
  console.log(`\n Deploying ${slug}/${version} to Graph Studio...`);
  
  try {
  
    await graphAuth();

    await executeCommand(`graph deploy ${slug}`);
    console.log(`Successfully deployed ${slug}/${version} to Graph Studio`);
  } catch (error) {
    console.error("Deployment failed:", error);
    throw error;
  }
};



// const graphDeployStudio = async (slug:string, version:string) => {
//  await graphAuth();
  
//   await executeCommand(`graph deploy ${slug} -l=${version}`);
// };

export const addNetwork = async (network:string) => {
  if (fs.existsSync(`../config/${network}`) ){
    console.log(`Configuration for ${network} already exists`);
    return;
  }
  await executeCommand(
    `cross-env mkdir  ../config/${network}`,
  );
  await executeCommand(
    `cross-env touch ../config/${network}/configurations.json`,
  );

   console.log(GRAFTING_SUBGRAPH_ID && GRAFTING_START_BLOCK)
  const config = {
    graftEnabled: (GRAFTING_SUBGRAPH_ID && GRAFTING_START_BLOCK) ?  true : false,
    subgraphId: GRAFTING_SUBGRAPH_ID ? GRAFTING_SUBGRAPH_ID : "",
    graftStartBlock: GRAFTING_START_BLOCK ? parseInt(GRAFTING_START_BLOCK) : "",
    network: network,
    factory_startBlock: parseInt(FACTORY_STARTBLOCK),
    factory_contract_address: FACTORY_CONTRACT_ADDRESS,
    nfpm_startBlock: parseInt(NONFUNGIBLEPOSITIONMANAGER_STARTBLOCK),
    nfpm_contract_address: NONFUNGIBLEPOSITIONMANAGER_CONTRACT
  };

  const filePath = `../config/${network}/configurations.json`;

  fs.mkdirSync(`../config/${network}`, { recursive: true });
  fs.writeFileSync(filePath, JSON.stringify(config));

  console.log(`Created configuration files for ${network}`);
};

export const build = async (network:string) => {
  console.log(`Building subgraph for ${network}`);
  console.log(`\n Copying constants & templates for ${network} \n`);
  console.log(`\n Generating manifest for ${network} \n`);
  await executeCommand(
    `cross-env mustache ../config/${network}/configurations.json subgraph.template.yaml > subgraph.yaml`,
  );
  
  await graphCodegen();
  await graphBuild();
};



export const deployStudio = async (network:string, slug:string, version:string) => {
  // build(network);
  console.log(`Deploying ${slug}/${version} for ${network}`);
  await graphDeployStudio(slug, version);
};