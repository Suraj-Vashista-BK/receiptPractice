
// Define the types for the data we are working with. Used for static typechecking

export interface Receipt {
  retailer: string;
  purchaseDate: string;
  purchaseTime: string;
  items: Item[];
  total: string;
}
  
export interface Item {
  shortDescription: string;
  price: string;
}

export interface Cache {
  [key: string]: number;
}