export interface User {
  id: number;
  username: string;
  password: string;
  salt: string;
  firstName: string;
  lastName: string;
  secondSurName: string;
  email: string;
  roleId: number;
  profileImage: string;
}
