import { gitConfigure, gitClone, gitPush } from "./git.ts";
// https://cdn.jsdelivr.net/gh/mborejdo/profile-update/data/git.ts
import { exists, move } from "https://deno.land/std@0.129.0/fs/mod.ts";

const { run, writeTextFile, env } = Deno;
const API_TOKEN_GITHUB = env.get("API_TOKEN_GITHUB") || "";
const REPO = env.get("REPO") || "mborejdo";

const BASEFOLDER = "/github/workspace/data";
const DESTFOLDER = `${BASEFOLDER}/${REPO}`;

const twitterUrl = "https://www.twitter.com/mediacoder";
const linkedInUrl = "https://www.linkedin.com/in/michael-borejdo-a7367928/";
const instagramUrl = "https://www.instagram.com/mediacoder/";
const badgeHeight = "20";


/**
 * 
 * @returns 
 */
function patchReadme() {
  return new Promise(async (resolve: (value: boolean) => void) => {
    await move(`${DESTFOLDER}/../images/cloud.png`, `${DESTFOLDER}/cloud.png`, { overwrite: true });

    const headerImage = `![me](cloud.png "Cloud")`;
    const twitterBadge = `[<img src="https://img.shields.io/badge/twitter-%231DA1F2.svg?&style=for-the-badge&logo=twitter&logoColor=white" height=${badgeHeight}>](${twitterUrl})`;
    const linkedInBadge = `[<img src="https://img.shields.io/badge/linkedin-%230077B5.svg?&style=for-the-badge&logo=linkedin&logoColor=white" height=${badgeHeight}>](${linkedInUrl})`;
    const instagramBadge = `[<img src="https://img.shields.io/badge/instagram-%23E4405F.svg?&style=for-the-badge&logo=instagram&logoColor=white" height=${badgeHeight}>](${instagramUrl})`;

    const text = `${headerImage}\n\n${twitterBadge} ${linkedInBadge} ${instagramBadge}\n\n`;

    await writeTextFile(`${DESTFOLDER}/README.md`, text);
    resolve(true);
  });
}


await gitConfigure(API_TOKEN_GITHUB);
await gitClone(`https://${API_TOKEN_GITHUB}@github.com/mborejdo/mborejdo.git`, DESTFOLDER);

await patchReadme();

await gitPush(DESTFOLDER);