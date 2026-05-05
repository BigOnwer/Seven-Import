import { Product, ProductData } from "@/types/product";
import { ChangeEvent, useRef, useState } from "react";
import { useToast } from "@/components/ui/Toast";
import { useProductService } from "@/lib/postService";
import { Image, Upload, Video } from "lucide-react";
import { Button } from "@/components/ui/button";

interface CreateProductProps{
    userId: string;
}

export function ProductForm({ userId }: CreateProductProps) {
    const { createProduct } = useProductService();
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [preview, setPreview] = useState<string | null>(null);
    const [caption, setCaption] = useState('');
    const [fileType, setFileType] = useState<string>('');
    const [isLoading, setIsLoading] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const { showToast } = useToast();

    const handleFileSelect = (event: ChangeEvent<HTMLInputElement>): void => {
        const file = event.target.files?.[0];
        if (file) {
        setSelectedFile(file);
        setFileType(file.type.startsWith('video/') ? 'video' : 'image');

        const previewUrl = URL.createObjectURL(file);
        setPreview(previewUrl);
        }
    };

    const handleUploadClick = (): void => {
        fileInputRef.current?.click();
    };

    const resetForm = (): void => {
      setSelectedFile(null);
      setPreview(null);
      setCaption('');
      setFileType('');
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
      // Clean up preview URL
      if (preview) {
        URL.revokeObjectURL(preview);
      }
    };

    const removeFile = (): void => {
      setSelectedFile(null);
      setPreview(null);
      setFileType('');
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
      if (preview) {
        URL.revokeObjectURL(preview);
      }
    };

    const handleCaptionChange = (event: ChangeEvent<HTMLTextAreaElement>): void => {
      setCaption(event.target.value);
    };

    const maxCaptionLength = 500;
    const isSubmitDisabled = !selectedFile || isLoading;

    const handleSubmit = async (): Promise<void> => {
      if (!selectedFile) {
        alert('Por favor, selecione uma foto ou vídeo');
        return;
      }

      setIsLoading(true);

      try {
        const productData: ProductData = {
          file: selectedFile,
          caption,
          fileType: fileType as 'image' | 'video'
        };

        await createProduct(productData, userId);
        
        showToast(`Produto adicionado com sucesso!`)
        
        // Reset form
        resetForm();
      } catch (error) {
        console.error('Erro ao criar post:', error);
        showToast(`Erro ao criar produto: ${error instanceof Error ? error.message : 'Erro desconhecido'}`)
      } finally {
        setIsLoading(false);
      }
    };
    return (
        <div className="">
            <h1 className="text-3xl font-bold text-center">Bem-vindo ao painel administrativo!</h1>

            <form className="w-1/3 flex flex-col justify-center mx-auto mt-8">
                <input type="text" placeholder="Nome do produto" className="border p-2 rounded mb-4 w-full" />
                <input type="number" placeholder="Preço" className="border p-2 rounded mb-4 w-full" />
                <textarea placeholder="Descrição" className="border p-2 rounded mb-4 w-full"></textarea>
                <textarea placeholder="Detalhes" className="border p-2 rounded mb-4 w-full"></textarea>
                <input type="number" placeholder="Estoque" className="border p-2 rounded mb-4 w-full" />
                {!selectedFile ? (
                  <div
                  onClick={handleUploadClick}
                  className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center cursor-pointer hover:border-purple-400 hover:bg-purple-50/50 transition-all duration-200"
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {if (e.key === 'Enter' || e.key === ' ') {
                    handleUploadClick();
                  }}}
                  >
                    <Upload className="mx-auto mb-4 h-12 w-12 text-gray-400" />
                    <p className="text-gray-500">Clique para selecionar uma foto ou vídeo</p>
                  </div>
                  ) : (
                  <div className="relative rounded-xl overflow-hidden bg-gray-100">
                    {fileType === 'image' ? (
                      <img 
                        src={preview || ''} 
                        alt="Preview da mídia selecionada" 
                        className="w-full h-64 object-cover"
                      />
                    ) : (
                      <video 
                        src={preview || ''} 
                        className="w-full h-64 object-cover"
                        controls
                        aria-label="Preview do vídeo selecionado"
                      />
                    )}
                    
                    <div className="absolute top-2 right-2 flex gap-2">
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={handleUploadClick}
                        className="bg-white/90 hover:bg-white"
                        aria-label="Alterar mídia"
                        disabled={isLoading}
                      >
                        {fileType === 'image' ? 
                          <Image className="h-4 w-4" /> : 
                          <Video className="h-4 w-4" />
                        }
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={removeFile}
                        className="bg-red-500/90 hover:bg-red-500"
                        aria-label="Remover mídia"
                        disabled={isLoading}
                      >
                        ✕
                      </Button>
                    </div>
                  </div>
                )}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*,video/*"
                  onChange={handleFileSelect}
                  className="hidden"
                  aria-label="Selecionar arquivo de mídia"
                  disabled={isLoading}
                />
                <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">Adicionar Produto</button>
            </form>
        </div>
    )
}