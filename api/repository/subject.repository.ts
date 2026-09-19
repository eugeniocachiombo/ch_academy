import { z } from 'zod';
import { Crud } from "./base/crud.repository.js";

export const createSubjectSchema = z.object({
    name: z.string().min(4, "O nome deve ter pelo menos 4 caracteres"),
    class_id: z.number("A classe é obrigatória"),
    course_id: z.number().optional().nullish()
});

export const updateSubjectSchema = createSubjectSchema.partial();

export type CreateSubjectInput = z.infer<typeof createSubjectSchema>;
export type UpdateSubjectInput = z.infer<typeof updateSubjectSchema>;

class SubjectRepository extends Crud {
    constructor() {
        super("subject", {
            create: createSubjectSchema,
            update: updateSubjectSchema
        });
    }
}

export const subjectRepository = new SubjectRepository();