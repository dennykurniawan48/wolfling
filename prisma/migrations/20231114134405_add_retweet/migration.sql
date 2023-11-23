-- AlterTable
ALTER TABLE "Post" ADD COLUMN     "retweetFrom" STRING;

-- AddForeignKey
ALTER TABLE "Post" ADD CONSTRAINT "Post_retweetFrom_fkey" FOREIGN KEY ("retweetFrom") REFERENCES "Post"("id") ON DELETE SET NULL ON UPDATE CASCADE;
