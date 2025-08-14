import { defineField, defineType } from "sanity";
import { StarIcon } from "@sanity/icons";

export const reviewType = defineType({
  name: "review",
  title: "Review",
  type: "document",
  icon: StarIcon,
  fields: [
    defineField({
      name: "product",
      title: "Product",
      type: "reference",
      to: [{ type: "product" }],
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "rating",
      title: "Rating",
      type: "number",
      validation: (Rule) => Rule.required().min(1).max(5),
    }),
    defineField({
      name: "comment",
      title: "Comment",
      type: "text",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "userEmail",
      title: "User Email",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "userName",
      title: "User Name",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "userImage",
      title: "User Image",
      type: "url",
    }),
    defineField({
      name: "createdAt",
      title: "Created At",
      type: "datetime",
      initialValue: () => new Date().toISOString(),
    }),
  ],
  preview: {
    select: {
      title: "userName",
      subtitle: "comment",
      rating: "rating",
    },
    prepare({ title, subtitle, rating }) {
      return {
        title: `${title} (${rating}⭐)`,
        subtitle,
      };
    },
  },
});