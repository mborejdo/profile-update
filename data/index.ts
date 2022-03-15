import { exists, move } from "https://deno.land/std@0.129.0/fs/mod.ts";
import { join } from "https://deno.land/std@0.129.0/path/mod.ts";

const { run, writeTextFile, env } = Deno;
const API_TOKEN_GITHUB = env.get("API_TOKEN_GITHUB");
const DESTFOLDER = "/github/workspace/data/mborejdo";

/**
 * 
 * @returns 
 */
function gitConfigure(): Promise<boolean> {
  return new Promise((resolve: (value: boolean) => void) => {
    const config1 = run({
      cmd: ["git", "config", "--global", "user.email", "mborejdo+github@gmail.com"],
    });
    config1.status().then((configResult) => {
      if (configResult.success) {
        const config2 = run({
          cmd: ["git", "config", "--global", "user.name", "Michael Borejdo"],
        });
        config2.status().then((configResult2) => {
          if (configResult2.success) {
            const config3 = run({
              cmd: ["git", "config", "--global", "user.password", API_TOKEN_GITHUB || ""],
            });
            config3.status().then((configResult3) => {
              resolve(configResult3.success);
            });
          } else {
            resolve(false);
          }
        });
      } else {
        resolve(false);
      }
    });
  });
}

/**
 * 
 * @param source 
 * @param dest 
 * @returns 
 */
function gitClone(source: string, dest: string): Promise<boolean> {
  return new Promise(async (resolve: (value: boolean) => void) => {
    const isCloned = await exists(join(dest, ".git"));

    if (isCloned) {
      console.log(`Repo '${source}' already exists`);
      resolve(false)
      return;
    }

    console.log(`Cloning '${source}' into '${dest}'...`);

    const clone = run({
      cmd: ["git", "clone", source, dest],
    });
    const cloneResult = await clone.status();

    resolve(cloneResult.success)
  });
}

/**
 * 
 * @returns 
 */
function gitPush() {
  return new Promise(async (resolve: (value: boolean) => void) => {
    const add = run({
      cmd: ["git", "-C", DESTFOLDER, "add", "."],
    });
    const addResult = await add.status();
    const commit = run({
      cmd: ["git", "-C", DESTFOLDER, "commit", "-a", "-m", "Update Repo"],
    });
    const commitResult = await commit.status();
    console.log("PUSHING", commitResult)
    if (commitResult.success) {
      const commit = run({
        cmd: ["git", "-C", DESTFOLDER, "push", "--force"],
      });
      const commitResult = await commit.status();
    }
    resolve(true)
  });
}

/**
 * 
 * @returns 
 */
function patchReadme() {
  return new Promise(async (resolve: (value: boolean) => void) => {
    await move(`${DESTFOLDER}/../images/cloud.png`, `${DESTFOLDER}/cloud.png`, { overwrite: true });
    await writeTextFile(`${DESTFOLDER}/README.md`, '![me](cloud.png "Cloud")');
    resolve(true);
  });
}


await gitConfigure();
await gitClone(`https://${API_TOKEN_GITHUB}@github.com/mborejdo/mborejdo.git`, DESTFOLDER);
await patchReadme();
await gitPush();