import { IAPI } from "./types";
import { Todo, TodoStatus } from "../models/todo";
import shortid from "shortid";

class ApiFrontend extends IAPI {
    async createTodo(name: string): Promise<Todo> {
        return Promise.resolve({
            name,
            created_date: new Date().toISOString(),
            status: TodoStatus.ACTIVE,
            id: shortid(),
        } as Todo);
    }

    async getTodos(): Promise<Todo[]> {
        return [
            {
                name: "Content",
                created_date: new Date().toISOString(),
                status: TodoStatus.ACTIVE,
                id: shortid(),
            } as Todo,
        ];
    }
}

export default new ApiFrontend();
