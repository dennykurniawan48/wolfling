export type GoogleResponse = {
    iss: string,
    azp: string,
    aud: string,
    sub: string,
    email: string,
    email_verified: boolean,
    name: string,
    picture: string,
    given_name: string,
    family_name: string,
    locale: string,
    iat: string,
    exp: string,
    alg: string,
    kid: string,
    typ: String
  }

export type GoogleLogin = {
    success: boolean,
    data: GoogleResponse | null,
    err: string | null,
  };