import { Route, Routes } from 'react-router-dom'
import TodoList from '../pages/todoList/TodoList'

const AppRoutes = () => {
    return (
        <Routes>
            <Route path='/todoList' element={<TodoList />}></Route>
        </Routes>

    )
}

export default AppRoutes