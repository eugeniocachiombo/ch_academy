import { z } from 'zod';
import { Crud } from "./base/crud.repository.js";

export const createRolePermitionSchema = z.object({
    permition_id: z.number("A permissão é obrigatória"),
    role_id: z.number("A função é obrigatória")
});

export const updateRolePermitionSchema = createRolePermitionSchema.partial();

export type CreateRolePermitionInput = z.infer<typeof createRolePermitionSchema>;
export type UpdateRolePermitionInput = z.infer<typeof updateRolePermitionSchema>;

class RolePermitionRepository extends Crud {
    constructor() {
        super("rolePermition", {
            create: createRolePermitionSchema,
            update: updateRolePermitionSchema
        });
    }
}

export const rolePermitionRepository = new RolePermitionRepository();