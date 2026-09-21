import { z } from 'zod';
import { Crud } from "./base/crud.repository.js";

export const createClassRoomSchema = z.object({
    name: z.string().min(1, "O nome é obrigatório")
});

export const updateClassRoomSchema = createClassRoomSchema.partial();

export type CreateClassRoomInput = z.infer<typeof createClassRoomSchema>;
export type UpdateClassRoomInput = z.infer<typeof updateClassRoomSchema>;

class ClassRoomRepository extends Crud {
    constructor() {
        super("classRoom", {
            create: createClassRoomSchema,
            update: updateClassRoomSchema
        });
    }
}

export const classRoomRepository = new ClassRoomRepository();