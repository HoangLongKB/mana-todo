import React, {useEffect, useReducer, useRef, useState} from 'react';
import './ToDo.scss';
import reducer, {initialState} from '../../store/reducer';
import {
    setTodos,
    createTodo,
    toggleAllTodos,
    deleteAllTodos,
    updateTodo,
    updateTodoStatus,
    deleteTodo
} from '../../store/actions';
import Service from '../../service';
import {Todo, TodoStatus} from '../../models/todo';
import { isTodoCompleted } from '../../utils';
type EnhanceTodoStatus = TodoStatus | 'ALL';


const ToDoPage = () => {
    const [{todos}, dispatch] = useReducer(reducer, initialState);
    const [editingTodoId, setEditingTodoId] = useState<string>('');
    const [showing, setShowing] = useState<EnhanceTodoStatus>('ALL');
    const inputRef = useRef<any>(null);
    const isInitialMount = useRef(true);

    useEffect(()=>{
        
        (async ()=>{
            let todos = await Service.getTodos();
            const storageTodos = JSON.parse(localStorage.getItem('manaTodos') || '[]');
            if (storageTodos.length > 0) {
                todos = storageTodos;
            }
            dispatch(setTodos(todos));
        })()
    }, [])

    useEffect(()=>{
        if (isInitialMount.current) {
            isInitialMount.current = false;
         } else {
            saveToStorage(todos);
         }
    }, [todos])
    
    const saveToStorage = (todos: Todo[]) => {
        localStorage.setItem('manaTodos', JSON.stringify(todos));      
    }

    const onCreateTodo = async (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter' && !!inputRef.current.value.trim()) {
            const resp = await Service.createTodo(inputRef.current.value.trim());
            dispatch(createTodo(resp));
            inputRef.current.value = '';
        }
    }

    const onUpdateTodoStatus = (e: React.ChangeEvent<HTMLInputElement>, id: string) => {
        const editTodo = {
            id,
            checked: e.target.checked
        };
        dispatch(updateTodoStatus(editTodo))
    }

    const onUpdateTodo = (e: React.ChangeEvent<HTMLInputElement>, id: string) => {
        const editTodo = {
            id,
            name: e.target.value || ''
        }
        dispatch(updateTodo(editTodo))
    }

    const onToggleAllTodo = (e: React.ChangeEvent<HTMLInputElement>) => {
        dispatch(toggleAllTodos(e.target.checked))
    }

    const onDeleteAllTodo = () => {
        dispatch(deleteAllTodos());
    }

    const onDeleteTodo = (id: string) => {
        dispatch(deleteTodo(id));
    }

    const toggleEditTodo = (todoId: string = '') => {
        setEditingTodoId(todoId);
    }

    const isShowing = (todoStatus: string) => {
        return showing === 'ALL' ? true : todoStatus === showing;
    }

    const isButtonActive = (status: string) => {
        return status === showing ? '' : '__outline';
    }

    return (
        <div className="ToDo__container">
            <div className="todo__creation">
                <input
                    ref={inputRef}
                    className="todo__input"
                    placeholder="What need to be done?"
                    onKeyDown={(e) => onCreateTodo(e)}
                />
            </div>
            <div className="todo__title">
                <p>Filter by status</p>
            </div>
            <div className="todo__toolbar">
                <div className="todo__tabs">
                    <button
                        className={`button button${isButtonActive('ALL')}--warning`}
                        onClick={()=>setShowing('ALL')}
                        >
                        All
                    </button>
                    <button
                        className={`button button${isButtonActive(TodoStatus.ACTIVE)}--primary`}
                        onClick={()=>setShowing(TodoStatus.ACTIVE)}
                        >
                        Active
                    </button>
                    <button
                        className={`button button${isButtonActive(TodoStatus.COMPLETED)}--success`}
                        onClick={()=>setShowing(TodoStatus.COMPLETED)}
                        >
                        Completed
                    </button>
                </div>
            </div>
            <div className="todo__title">
                <p>Action</p>
            </div>
            <div className="todo__action-bar">
                {todos.length > 0 ?
                        <input
                            type="checkbox"
                            onChange={onToggleAllTodo}
                        />: <p>Add something amazing!</p>
                }
                <button className="button button--danger" onClick={onDeleteAllTodo}>
                    Clear all todos
                </button>
            </div>
            <div className="todo__list">
                {
                    todos
                        .filter(todo => isShowing(todo.status))
                        .map((todo, index) => {
                        return (
                            <div key={index} className="todo__item">
                                <input
                                    type="checkbox"
                                    checked={isTodoCompleted(todo)}
                                    onChange={(e) => onUpdateTodoStatus(e, todo.id)}
                                />
                                {
                                    todo.id === editingTodoId ? (
                                        <input
                                            type='text'
                                            value={todo.name}
                                            autoFocus
                                            onBlur={() => toggleEditTodo('')}
                                            onChange={(e) => onUpdateTodo(e, todo.id)}
                                        />
                                    ) : (
                                        <p 
                                            className="todo__name"
                                            onDoubleClick={() => toggleEditTodo(todo.id)}
                                        >
                                            {todo.name}
                                        </p>
                                    )
                                }
                                <button
                                    className="button button--danger todo__delete"
                                    onClick={() => onDeleteTodo(todo.id)}
                                >
                                    X
                                </button>
                            </div>
                        );
                    })
                }
            </div>
        </div>
    );
};

export default ToDoPage;