import mongoose, { type InferSchemaType } from "mongoose";

const listItemSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Item name is required"],
      trim: true,
      minlength: 1,
      maxlength: 100,
    },
    checked: {
      type: Boolean,
      default: false,
    },
  },
  {
    _id: true,
    timestamps: true,
  },
);

const listSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "List name is required"],
      trim: true,
      minlength: 1,
      maxlength: 100,
    },
    //Referencing to user
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "List owner is required"],
      index: true,
    },
    items: {
      type: [listItemSchema],
      default: [],
    },
  },
  {
    timestamps: true,
  },
);

listSchema.index({ owner: 1 });

export type ListItem = InferSchemaType<typeof listItemSchema>;
export type GroceryList = InferSchemaType<typeof listSchema>;

export const ListModel = mongoose.model<GroceryList>("List", listSchema);
