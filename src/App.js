import './App.css';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { CreateGroup } from './components/CreateGroup';
import { AddMembers } from './components/AddMembers';
import { ExpenseMain } from './components/ExpenseMain';

const App = () => ( 
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<CreateGroup />} />
        <Route path="/members" element={<AddMembers />} />
        <Route path="/expense" element={<ExpenseMain />} />
      </Routes>
    </BrowserRouter>
)

export default App;
