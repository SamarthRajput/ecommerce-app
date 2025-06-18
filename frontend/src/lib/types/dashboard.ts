export type Product = {
  id: number;
  name: string;
  price: number;
  description: string;
  category: string;
  thumbnail: string;
  images: string[];
  rating: number;
  reviews: Review[];
  _count: {
    rfqs: number;
  };
};

export type Review = {
  id: number;
  user: {
    name: string;
  };
  rating: number;
  comment: string;
  createdAt: string;
};
