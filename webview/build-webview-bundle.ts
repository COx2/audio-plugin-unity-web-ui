#!/usr/bin/env -S deno run --allow-all

/*
This script requires the Deno runtime environment to execute.
Please refer to the official website for instructions on how to install Deno.
https://deno.com/
*/

import { $ } from "https://deno.land/x/dax/mod.ts";
import { fromFileUrl } from "https://deno.land/std/path/mod.ts";
import * as fs from "jsr:@std/fs";


//============================================
console.log("Deno.cwd(): " + Deno.cwd());

const __file_directory = fromFileUrl(new URL("./", import.meta.url));
const __root_directory = fromFileUrl(new URL("../", import.meta.url));
Deno.chdir(__file_directory);

console.log("Root directory: " + __root_directory);
console.log("Deno.cwd(): " + Deno.cwd());

await fs.copy("./source/juce-framework-frontend", "./dist/juce-framework-frontend", { overwrite: true });

await fs.copy("./source/binding", "./dist/binding", { overwrite: true });

await fs.copy("./source/unity_web_build/Build", "./dist/Build", { overwrite: true });
await fs.copy("./source/unity_web_build/TemplateData", "./dist/TemplateData", { overwrite: true });
await fs.copy("./source/unity_web_build/manifest.webmanifest", "./dist/manifest.webmanifest", { overwrite: true });
await fs.copy("./source/unity_web_build/ServiceWorker.js", "./dist/ServiceWorker.js", { overwrite: true });
await fs.copy("./source/unity_web_build/index.html", "./dist/index.html", { overwrite: true });

// Modify HTML to insert .js for binding
{
    const inputPath = "./source/unity_web_build/index.html";
    const outputPath = "./dist/index.html";
    
    const content = await Deno.readTextFile(inputPath);
    
    const scriptsToAdd = `
    <script src="./binding/unity-binding-lib.js"></script>
    <script type="module" src="./juce-framework-frontend/check_native_interop.js"></script>
    <script type="module" src="./juce-framework-frontend/index.js"></script>
    <script type="module" src="./binding/juce-binding-impl.js"></script>`;
    
    const modifiedContent = content.replace(
        /(<\/div>)\s*(<script>)/,
        `$1${scriptsToAdd}\n    $2`
    );

    await Deno.writeTextFile(outputPath, modifiedContent);
    console.log(`Modified HTML written to ${outputPath}`);
}

Deno.chdir(__file_directory + "dist");

const __bundle_file_path= __root_directory + "/cpp/audio_plugin/resources/WebViewBundle.zip";

if(await fs.exists(__bundle_file_path)) {
    await Deno.remove(__bundle_file_path);
}

await $`deno run --allow-write --allow-read --allow-net ${__root_directory}/tools/deno/mc-zip.ts ${__bundle_file_path} ./`

Deno.chdir(__file_directory);

await Deno.remove(__file_directory + "dist", { recursive: true });