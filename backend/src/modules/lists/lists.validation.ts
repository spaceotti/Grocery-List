import { z } from "zod";

//1. Schema for list names
const listNameSchema = z.string().trim().min(1).max(100);
//1.2. Schema for list item names
const itemNameSchema = z.string().trim().min(1).max(100);

//2. Validation
//2.1. for creating a new list.
export const createListSchema = z.strictObject({
  name: listNameSchema,
});
//2.2. for updating list
export const updateListSchema = z.strictObject({
  name: listNameSchema,
});
//2.3. for creating list item
export const createItemSchema = z.strictObject({
  name: itemNameSchema,
});
//2.4. for updating list item
export const updateItemSchema = z
  .strictObject({
    name: itemNameSchema.optional(),
    checked: z.boolean().optional(),
  })
  .refine((data) => data.name !== undefined || data.checked !== undefined, {
    message: "At least one field must be provided",
  });

export type CreateListInput = z.infer<typeof createListSchema>;
export type UpdateListInput = z.infer<typeof updateListSchema>;
export type CreateItemInput = z.infer<typeof createItemSchema>;
export type UpdateItemInput = z.infer<typeof updateItemSchema>;
