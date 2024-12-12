import { createUploadthing, type FileRouter } from "uploadthing/next";
import { auth } from "../../../server/auth/index";

const f = createUploadthing();

export const ourFileRouter = {
  imageUploader: f({
    image: {
      maxFileSize: "4MB",
      maxFileCount: 1
    },
  })
    .middleware(async () => {
      const session = await auth();

      if (!session) {
        throw new Error("Unauthorized");
      }

      if (!session?.user?.email) {
        throw new Error("No user email");
      }

      return { userEmail: session.user.email };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      console.log("Upload complete for userId:", metadata.userEmail);
      console.log("file url", file.url);

      return { uploadedBy: metadata.userEmail };
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;