import { apiClient } from "./client";

export interface ReviewDto {
  id: number;
  productId: number;
  comment: string;
  rating: number;
  userId: string;
  userName: string;
  createdTime: string;
}

export const fetchProductReviews = async (productId: number): Promise<ReviewDto[]> => {
  const { data } = await apiClient.get<ReviewDto[]>(`/Reviews/product/${productId}`);
  return data;
};

export const createReview = async (productId: number, comment: string, rating: number): Promise<ReviewDto> => {
  const { data } = await apiClient.post<ReviewDto>("/Reviews", {
    productId,
    comment,
    rating,
  });
  return data;
};
