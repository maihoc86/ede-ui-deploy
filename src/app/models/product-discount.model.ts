export interface ProductDiscount {
    id: string;
    productdiscount: string;
    discount: ProductDiscount;
    startdate: Date;
    enddate: Date;
    status: Boolean;
}