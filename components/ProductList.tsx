import { API } from "@/lib/axios";
import Products from "./Products";

async function getProducts() {
  const res = await API.get('/products/');

  if (!res) throw new Error("Erro ao buscar produtos");

  const data = res.data;
  console.log(data)
  return data.data;
}

export async function ProductList() {
  const products = await getProducts();

  return (
    <>
      {products.map((product: any) => (
        <Products key={product.id} />
      ))}
    </>
  );
}