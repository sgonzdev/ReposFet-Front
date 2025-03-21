export interface Access {
  email: string,
  password: string,
  password_confirmation: string
}

export interface AccessResult {
  status: string,
  access_token: string,
  token_type: string,
  expires_in: number
}

export interface Me {
  user: {
    id: number;
    name: string;
    email: string;
  };
  roles: string[];
  permissions: string[];
}
