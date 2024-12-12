import { createRouteHandler } from "uploadthing/next";
import { ourFileRouter } from "./core";

export const { GET, POST } = createRouteHandler({
  router: ourFileRouter,
  config: {
    //callbackUrl: "https://5q7n663k-3000.use.devtunnels.ms/api/uploadthing",
  },
});
