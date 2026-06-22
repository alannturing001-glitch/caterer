type Product = {
  id: string;
  title: string;
  price: number;
  mainImage: string;
  slug: string;
  inStock: number;
  description?: string;
  manufacturer?: string;
  category?: string;
};

type SingleProductBtnProps = {
  product: Product;
  quantityCount: number;
};
