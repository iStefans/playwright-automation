import type { User, UserData, CustomerInfo } from '../types/interfaces';
import credentials from '../test-data/credentials.json';
import customerInfo from '../test-data/customerInfo.json';

export function getUser(type: string): User {
  const allUsers = [...credentials.users, ...credentials.invalidUsers];
  const user = allUsers.find(u => u.type === type);
  if (!user) throw new Error(`User ${type} not found`);
  return user;
}

export function getValidUsers(): User[] {
  return [...credentials.users];
}

export function getInvalidUsers(): User[] {
  return [...credentials.invalidUsers];
}

export function getCustomerInfo(profile: string = 'default'): CustomerInfo {
  if (!customerInfo[profile]) {
    throw new Error(`Customer profile ${profile} not found`);
  }
  return customerInfo[profile];
}

export function getAllCustomerProfiles(): Record<string, CustomerInfo> {
  return customerInfo;
}