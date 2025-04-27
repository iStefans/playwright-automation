//User credentials for authentication
export interface User {
  type: string;
  username: string;
  password: string;
  expectedError?: string;
}

//Collection of user credentials
export interface UserData {
  users: User[];
  invalidUsers: User[];
}


 // Customer information for checkout
export interface CustomerInfo {
  firstName: string;
  lastName: string;
  zipCode: string;
}

//Product information
export interface Product {
  name: string;
  description: string;
  price: string;
  image: string;
}

//Cart item information
export interface CartItem {
  name: string;
  price: string;
  quantity: number;
}