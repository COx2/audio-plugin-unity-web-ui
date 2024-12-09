#!/usr/bin/env -S deno run --allow-all

/*
This script requires the Deno runtime environment to execute.
Please refer to the official website for instructions on how to install Deno.
https://deno.com/
*/

import {$, CommandBuilder} from "https://deno.land/x/dax/mod.ts";
import { fromFileUrl } from "https://deno.land/std/path/mod.ts";

//============================================
console.log("Deno.cwd(): " + Deno.cwd());

const __file_directory = fromFileUrl(new URL("./", import.meta.url));
const __web_directory = fromFileUrl(new URL("../../", import.meta.url));
const __root_directory = fromFileUrl(new URL("../../../", import.meta.url));
Deno.chdir(__file_directory);

console.log("Root directory: " + __root_directory);
console.log("Deno.cwd(): " + Deno.cwd());

await Deno.copyFile("./binding/juce-framework-frontend", "./dist/juce-framework-frontend");
await Deno.copyFile("./binding/page/*", "./dist/*");
await Deno.copyFile("./binding/page/juce-binding-impl.js", "./dist/juce-binding-impl.js");
await Deno.copyFile("./binding/page/index.html", "./dist/index.html");

Deno.chdir(__file_directory + "dist");

await $`deno run --allow-write --allow-read --allow-net ${__root_directory}/tools/deno/mc-zip.ts ${__root_directory}/cpp/audio_plugin/resources/WebViewBundle.zip ./`
