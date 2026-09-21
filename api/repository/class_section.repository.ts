import { z } from 'zod';
import { Crud } from "./base/crud.repository.js";

export const createClassSectionSchema = z.object({
    name: z.string().min(1, "O nome é obrigatório")
});

export const updateClassSectionSchema = createClassSectionSchema.partial();

export type CreateClassSectionInput = z.infer<typeof createClassSectionSchema>;
export type UpdateClassSectionInput = z.infer<typeof updateClassSectionSchema>;

class ClassSectionRepository extends Crud {
    constructor() {
        super("classSection", {
            create: createClassSectionSchema,
            update: updateClassSectionSchema
        });
    }
}

export const classSectionRepository = new ClassSectionRepository();