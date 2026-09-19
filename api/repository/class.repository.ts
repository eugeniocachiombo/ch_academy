import { z } from 'zod';
import { Crud } from "./base/crud.repository.js";

export const createClassSchema = z.object({
    name: z.string().min(4, "O nome deve ter pelo menos 4 caracteres"),
    course_id: z.number().optional().nullish()
});

export const updateClassSchema = createClassSchema.partial();

export type CreateClassInput = z.infer<typeof createClassSchema>;
export type UpdateClassInput = z.infer<typeof updateClassSchema>;

class ClassRepository extends Crud {
    constructor() {
        super("class", {
            create: createClassSchema,
            update: updateClassSchema
        });
    }
}

export const classRepository = new ClassRepository();