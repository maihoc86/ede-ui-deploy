import { Product } from "./product.model";

export interface ProductSearch extends Product {
    priceMin: number
    priceMax: number
    image: string
}
