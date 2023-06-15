import { defaultLocale } from "./i18n/config";
import { Meta, getFirst } from "@starknet-io/cms-utils/src/index";
import fs from "fs/promises";
import path from "path";
import { TopLevelBlock } from "./pages";

export interface RoadmapPost extends Meta {
  readonly id: string;
  readonly slug: string;
  readonly title: string;
  readonly version: string;
  readonly stage: string;
  readonly availability: string;
  readonly blocks: readonly TopLevelBlock[];
}

export interface RoadmapVersion extends Meta {
  readonly id: string;
  readonly version: string;
  readonly impact: string;
  readonly color: string;
}

export async function getRoadmapPosts(
  locale: string
): Promise<readonly RoadmapPost[]> {
  try {
    const roadmapPosts: RoadmapPost[] = [];
    const filesPath = path.join(process.cwd(), "../../public/data/roadmap-posts", locale)
    const filesInDir = await fs.readdir(filesPath);

    const jsonFilesInDir = filesInDir.filter((file) => file.endsWith(".json"));

    for (const fileName of jsonFilesInDir) {
      const fileData = await fs.readFile(
        path.join(
          process.cwd(),
          "../../public/data/roadmap-posts",
          locale,
          fileName
        ),
        "utf8"
      );
      const jsonData = JSON.parse(fileData.toString());
      roadmapPosts.push(jsonData);
    }

    return roadmapPosts;
  } catch (cause) {
    throw new Error("getRoadmapPosts failed!", {
      cause,
    });
  }
}

export async function getRoadmapPostBySlug(
  slug: string,
  locale: string
): Promise<RoadmapPost> {
  try {
    return await getFirst(
      ...[locale, defaultLocale].map(
        (value) => async () =>
          JSON.parse(
            await fs.readFile(
              path.join(
                process.cwd(),
                "../../public/data/roadmap-posts",
                value,
                slug + ".json"
              ),
              "utf8"
            )
          )
      )
    );
  } catch (cause) {
    throw new Error(`Roadmap Post not found! ${slug}`, {
      cause,
    });
  }
}

export async function getRoadmapVersions(
  locale: string
): Promise<readonly RoadmapVersion[]> {
  try {
    return await getFirst(
      ...[locale, defaultLocale].map(
        (value) => async () =>
          JSON.parse(
            await fs.readFile(
              path.join(
                process.cwd(),
                "../../public/data/roadmap-versions",
                value + ".json"
              ),
              "utf8"
            )
          )
      )
    );
  } catch (cause) {
    throw new Error("getRoadmapVersions failed!", {
      cause,
    });
  }
}
