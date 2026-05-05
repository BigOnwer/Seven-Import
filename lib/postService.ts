
import { ApiResponse, CreateProductRequest, Product, ProductData, UploadResponse } from "@/types/product";


class ProductService {
    private baseUrl = '/api';
    async uploadFile(file: File): Promise<UploadResponse> {
        const formData = new FormData();
        formData.append('file', file);

        const response = await fetch(`${this.baseUrl}/upload`, {
            method: 'POST',
            body: formData
        });

        const result: ApiResponse<UploadResponse> = await response.json();

        if (!result.success) {
        throw new Error(result.error || 'Erro no upload');
        }

        return result.data!;
    }

    async createProduct(postData: ProductData, userId: string): Promise<Product> {
        try{
            const uploadResult = await this.uploadFile(postData.file)
            const createProductData = {
                caption: postData.caption,
                mediaType: uploadResult.mediaType,
                mediaUrl: uploadResult.url,
                userId
            };

            const response = await fetch(`${this.baseUrl}/products`, {
                method: 'POST',
                headers: {
                'Content-Type': 'application/json'
                },
                body: JSON.stringify(createProductData)
            });

            const result: ApiResponse<Product> = await response.json();

             if (!result.success) {
                throw new Error(result.error || 'Erro ao criar produto');
            }

            return result.data!;
        } catch (error) {
            console.error("Erro ao criar produto:", error);
            throw error;
        }
    }
}

export const productService = new ProductService();

export function useProductService() {
  return {
    createProduct: productService.createProduct.bind(productService),
  };
}