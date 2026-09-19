-- DropForeignKey
ALTER TABLE "Class" DROP CONSTRAINT "Class_course_id_fkey";

-- AlterTable
ALTER TABLE "Class" ALTER COLUMN "course_id" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Class" ADD CONSTRAINT "Class_course_id_fkey" FOREIGN KEY ("course_id") REFERENCES "Course"("id") ON DELETE SET NULL ON UPDATE CASCADE;
