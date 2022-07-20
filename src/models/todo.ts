export enum TodoStatus {
  ACTIVE = 'ACTIVE',
  COMPLETED = 'COMPLETED'
}

export interface Todo {
  [key: string]: any;
  id: string,
  name: string,
  status: TodoStatus
}