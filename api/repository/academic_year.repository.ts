import { z } from 'zod';
import { Crud } from "./base/crud.repository.js";

export const createAcademicYearSchema = z.object({
  name: z.string().min(4, "O nome deve ter pelo menos 6 caracteres")
});

export const updateAcademicYearSchema = createAcademicYearSchema.partial();

export type CreateAcademicYearInput = z.infer<typeof createAcademicYearSchema>;
export type UpdateAcademicYearInput = z.infer<typeof updateAcademicYearSchema>;

class AcademicYearRepository extends Crud {
    constructor() {
        super("academicYear", {
            create: createAcademicYearSchema,
            update: updateAcademicYearSchema
        });
    }
}

export const academicYearRepository = new AcademicYearRepository();