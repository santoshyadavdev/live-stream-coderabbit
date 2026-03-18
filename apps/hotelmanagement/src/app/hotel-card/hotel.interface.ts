export interface HotelData {
  id: string;
  name: string;
  location: string;
  rating: number;
  pricePerNight: number;
  amenities: string[];
  availableRooms: number;
  imageUrl: string;
}

export interface HotelAPIResponse {
  data: HotelData[] | null;
  success: boolean;
}
