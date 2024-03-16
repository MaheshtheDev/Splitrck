export type User = {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  registration_status: string;
  picture: any;
  notifications_read: Date;
  notifications_count: number;
  notifications: any;
  default_currency: string;
  locale: string;
};
