/* tslint:disable */
/* eslint-disable */
import { BusinessCategory } from './business-category';
export interface CreateUserWithBusinessReq {
  businessName: string;
  category?: BusinessCategory;
  email: string;
  name: string;
  password: string;
}
