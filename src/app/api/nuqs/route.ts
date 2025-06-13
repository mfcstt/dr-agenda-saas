import { createParser } from "nuqs/server";

export const runtime = "edge";

export const GET = createParser({
  adapter: "next",
});
