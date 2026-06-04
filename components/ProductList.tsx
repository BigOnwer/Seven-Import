import { prisma } from "@/lib/prisma";
import Products from "./Products";

export async function ProductList() {
  const products = await prisma.product.findMany({
    orderBy: { createdAt: "desc" },
    take: 8,
  });

  return <Products />;
}