import { z } from "zod";

//1. Schema for list names
const listNameSchema = z.string().trim().min(1).max(100);

//2. Validation
//2.1. for creating a new list.
export const createListSchema = z.strictObject({
  name: listNameSchema,
});

//2.2. for updating list
export const updateListSchema = z.strictObject({
  name: listNameSchema,
});

export type CreateListInput = z.infer<typeof createListSchema>;
export type UpdateListInput = z.infer<typeof updateListSchema>;
