-- CreateEnum
CREATE TYPE "StatusAcademic" AS ENUM ('activa', 'cancelada', 'concluida');

-- AlterEnum
ALTER TYPE "Status" ADD VALUE 'cancelada';

-- AlterTable
ALTER TABLE "AcademicRegister" ADD COLUMN     "status" "StatusAcademic" NOT NULL DEFAULT 'activa';

-- AlterTable
ALTER TABLE "AcademicYear" ADD COLUMN     "status" "StatusAcademic" NOT NULL DEFAULT 'activa';
