export interface LinkI {
  link: string,
  name: string,
  image: string,
  info: Array<LinkInfoI>
}

export interface LinkInfoI {
  price: number
}
