interface Source {
  id: Number;
  name: String;
}
export interface INews {
  source: Source;
  author: String;
  title: String;
  description: String;
  url: String;
  urlToImage: String;
  publishedAt: String;
  content: String;
}
export enum Stacks {
  home = 'Home',
  details = 'Details',
}
export type RootStackParamList = {
  Home: undefined;
  Details: {item: INews};
};
