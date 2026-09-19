import { z } from 'zod';
import { Crud } from "./base/crud.repository.js";

export const createCourseSchema = z.object({
    name: z.string().min(4, "O nome deve ter pelo menos 4 caracteres")
});

export const updateCourseSchema = createCourseSchema.partial();

export type CreateCourseInput = z.infer<typeof createCourseSchema>;
export type UpdateCourseInput = z.infer<typeof updateCourseSchema>;

class CourseRepository extends Crud {
    constructor() {
        super("course", {
            create: createCourseSchema,
            update: updateCourseSchema
        });
    }
}

export const courseRepository = new CourseRepository();