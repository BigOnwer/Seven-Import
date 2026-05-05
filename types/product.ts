export type MidiaType = 'image' | 'video';

export interface CreateProductRequest {
  caption?: string;
  mediaUrl: string;
  userId: string;
}

export interface ProductData {
  file: File;
  caption: string;
  fileType: MidiaType;
}

export interface Product {
    caption?: string;
    id: string;
    name: string;
    price: number;
    description: string;
    details: string;
    stock: number;
    size: number;
    midiaType: MidiaType;
    midiaUrl: string;
    createdAt: Date;
    updatedAt: Date;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}



export interface UploadResponse {
  url: string;
  mediaType: MidiaType;
}