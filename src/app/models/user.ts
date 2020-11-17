export interface User {
  id: number;
  username: string;
  password: string;
  salt: string;
  firstName: string;
  lastName: string;
  secondSurname: string;
  email: string;
  roleId: number;
  status: boolean;
}
