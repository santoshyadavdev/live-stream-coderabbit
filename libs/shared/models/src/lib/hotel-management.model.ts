export enum EmployeeRole {
  Manager = 'Manager',
  Receptionist = 'Receptionist',
  Housekeeping = 'Housekeeping',
  Maintenance = 'Maintenance',
  Security = 'Security',
}

export interface Employee {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: EmployeeRole;
  hireDate: string;
  status: 'active' | 'inactive';
}

export interface Shift {
  id: string;
  employeeId: string;
  date: string;
  startTime: string;
  endTime: string;
  notes: string;
}

export interface HMRoom {
  id: string;
  hotelId: string;
  roomNumber: string;
  type: string;
  ratePerNight: number;
  status: 'available' | 'occupied' | 'maintenance';
}

export interface Booking {
  id: string;
  hotelId: string;
  roomId: string;
  guestName: string;
  checkIn: string;
  checkOut: string;
  totalAmount: number;
  status: 'confirmed' | 'checked-in' | 'checked-out' | 'cancelled';
}

export interface OccupancyMetrics {
  date: string;
  totalRooms: number;
  occupiedRooms: number;
  occupancyRate: number;
}

export interface RevenueMetrics {
  date: string;
  totalRevenue: number;
  adr: number;
  revpar: number;
  bookingsCount: number;
}

export interface FinancialReport {
  period: 'monthly' | 'quarterly';
  startDate: string;
  endDate: string;
  metrics: RevenueMetrics[];
  totals: {
    totalRevenue: number;
    totalBookings: number;
    averageOccupancyRate: number;
    averageAdr: number;
    averageRevpar: number;
  };
}
