export interface User {
  _id: string,
  name: string,
  email: string,
  interests: string[]
}

export interface Payload {
  email: string,
  name?: string,
  password: string,
  gender?: string,
  role?: string,
  profilePicture?: string

}