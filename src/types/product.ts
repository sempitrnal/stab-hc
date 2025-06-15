export type ProductImageFormat = {
  name: string;
  hash: string;
  ext: string;
  mime: string;
  path: string | null;
  width: number;
  height: number;
  size: number;
  sizeInBytes: number;
  url: string;
};

export type ProductImage = {
  id: number;
  documentId: string;
  name: string;
  alternativeText: string | null;
  caption: string | null;
  width: number;
  height: number;
  formats: {
    thumbnail?: ProductImageFormat;
    small?: ProductImageFormat;
    medium?: ProductImageFormat;
    large?: ProductImageFormat;
  };
  hash: string;
  ext: string;
  mime: string;
  size: number;
  url: string;
  previewUrl: string | null;
  provider: string;
  provider_metadata: any;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
};

export type SizeOption = {
  label: string;
  width: number;
  length: number;
};
export type SizeKey =
  | "xs"
  | "sm"
  | "md"
  | "lg"
  | "xl"
  | "2xl"
  | "3xl"
  | "4xl"
  | "5xl"
  | "6xl";

export type SizeChart = {
  [key: string]: {
    label: string;
    width: number;
    length: number;
  };
};

export type Product = {
  id: number;
  documentId: string;
  name: string;
  price: number;
  description: string;
  size_chart: SizeChart;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
  slug: string;
  images: ProductImage[];
  preorder?: boolean;
  color: any;
  preorderRelease: string | null;
};
