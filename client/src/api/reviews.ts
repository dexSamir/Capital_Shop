import { apiClient } from "./client";

export interface ReviewDto {
  id: number;
  productId: number;
  comment: string;
  rating: number;
  userId: string;
  userName: string;
  createdTime: string;
  likes: number;
  dislikes: number;
  images?: string[];
}

export const fetchProductReviews = async (productId: number): Promise<ReviewDto[]> => {
  const { data } = await apiClient.get<ReviewDto[]>(`/Reviews/product/${productId}`);
  return data;
};

export const createReview = async (productId: number, comment: string, rating: number, images?: File[]): Promise<ReviewDto> => {
  const formData = new FormData();
  formData.append('ProductId', productId.toString());
  formData.append('Comment', comment);
  formData.append('Rating', rating.toString());
  
  if (images && images.length > 0) {
    images.forEach(img => formData.append('Images', img));
  }

  const { data } = await apiClient.post<ReviewDto>('/Reviews', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return data;
};

export const likeReview = async (id: number): Promise<void> => {
  await apiClient.put(`/Reviews/${id}/like`);
};

export const dislikeReview = async (id: number): Promise<void> => {
  await apiClient.put(`/Reviews/${id}/dislike`);
};
