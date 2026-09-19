/*
  Warnings:

  - The primary key for the `RolePermition` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `UserRole` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - A unique constraint covering the columns `[name]` on the table `AcademicYear` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[name,course_id]` on the table `Class` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[name]` on the table `Course` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[name]` on the table `Permition` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[name]` on the table `Role` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[role_id,permition_id]` on the table `RolePermition` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[name,class_id,course_id]` on the table `Subject` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[user_id,role_id]` on the table `UserRole` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Localization" ADD COLUMN     "id" SERIAL NOT NULL,
ADD CONSTRAINT "Localization_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "RolePermition" DROP CONSTRAINT "RolePermition_pkey",
ADD COLUMN     "id" SERIAL NOT NULL,
ADD CONSTRAINT "RolePermition_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "UserRole" DROP CONSTRAINT "UserRole_pkey",
ADD COLUMN     "id" SERIAL NOT NULL,
ADD CONSTRAINT "UserRole_pkey" PRIMARY KEY ("id");

-- CreateIndex
CREATE UNIQUE INDEX "AcademicYear_name_key" ON "AcademicYear"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Class_name_course_id_key" ON "Class"("name", "course_id");

-- CreateIndex
CREATE UNIQUE INDEX "Course_name_key" ON "Course"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Permition_name_key" ON "Permition"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Role_name_key" ON "Role"("name");

-- CreateIndex
CREATE UNIQUE INDEX "RolePermition_role_id_permition_id_key" ON "RolePermition"("role_id", "permition_id");

-- CreateIndex
CREATE UNIQUE INDEX "Subject_name_class_id_course_id_key" ON "Subject"("name", "class_id", "course_id");

-- CreateIndex
CREATE UNIQUE INDEX "UserRole_user_id_role_id_key" ON "UserRole"("user_id", "role_id");
