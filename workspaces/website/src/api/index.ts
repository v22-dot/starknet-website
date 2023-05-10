import { Router } from "itty-router";
import { error, json, missing } from "itty-router-extras";
import { createCors } from "itty-cors";

// now let's create a router (note the lack of "new")
export const router = Router();

const { preflight, corsify } = createCors({
  origins: [
    "https://starknet-website-cms.netlify.app",
    "http://127.0.0.1:1234",
    "http://localhost:1234",
    "https://*.starknet-netlify-cms.pages.dev",
  ],
});

// @ts-expect-error
router.all("*", preflight);

router.get(
  "/api/youtube",
  async (req, event: WorkerGlobalScopeEventMap["fetch"]) => {
    if (typeof req.query.id !== "string") {
      return corsify(error(422, { message: "Invalid id provided!" }));
    }

    const query = new URLSearchParams();

    query.set("version", "v3");
    query.set("key", YOUTUBE_API_KEY);
    query.set("id", req.query.id as string);
    query.set("part", "snippet");
    query.append("part", "contentDetails");

    const response = await fetch(
      `https://youtube.googleapis.com/youtube/v3/videos?${query}`
    );

    const data: any = await response.json();

    const item = data?.items?.[0];

    if (item == null) {
      return corsify(
        missing({
          message: "Video not found!",
        })
      );
    }

    return corsify(
      json({
        data: item,
      })
    );
  }
);
