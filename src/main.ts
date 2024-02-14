import path from "node:path";
import { writeFile, mkdir } from "node:fs/promises";
import assert from "node:assert";
import { load } from "cheerio";

async function download(
  url: string,
  destDir: string | null = null
): Promise<void> {
  if (destDir === null) {
    destDir = path.join(process.cwd(), "downloads");
  }
  await mkdir(destDir, { recursive: true });
  const html = await fetch(url).then((res) => res.text());
  const doc = load(html);
  const objectName = doc("#reviewMdsDownloadObjectName")
    .attr("value")!
    .replaceAll(" ", "%20");
  assert(objectName !== undefined, "objectName is not found");

  const urlGenResponse = await fetch(
    "https://reviewmaydocsach.com/wp-json/reviewmds-download/v1/link?_locale=user",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ objectName }),
    }
  ).then((res) => res.json());

  const downloadUrl = urlGenResponse.url;
  const downloadResponse = await fetch(downloadUrl);
  const inferredFileNameFromUrl = decodeURIComponent(
    new URL(downloadUrl).pathname.split("/").pop()!
  );
  const targetFile = path.join(destDir, inferredFileNameFromUrl);
  const targetFileContent = Buffer.from(await downloadResponse.arrayBuffer());
  await writeFile(targetFile, targetFileContent);
}

async function main() {
  const targetUrl =
    "https://reviewmaydocsach.com/download-file/aq-chi-so-vuot-kho-paul-g-stoltz";
  await download(targetUrl);
}

main();
