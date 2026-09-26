export interface Property {
  id: number;
  title: string;
  address: string;
  city: string;
  price: number;
  bedrooms: number;
  bathrooms: number;
  imageUrl: string;
}

export interface Sponsor {
  id: number;
  name: string;
  message: string;
  url: string;
}