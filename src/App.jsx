import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Home, Statitics, NotFound, Login, AddData, AddGroups } from './pages';
import {
  ProtectLayout,
  PublicLayout,
} from './layouts';

function App() {
  return (
    <>
      <BrowserRouter>

        <Routes>

          <Route element={<ProtectLayout />}>
            <Route path="/add-data" element={<AddData />} />
            <Route path="/add-categories" element={<AddGroups />} />
            <Route path="/add-data/:id" element={<AddData />} />
          </Route>

          <Route element={<PublicLayout />}>
            <Route path="/" element={<Home />} />
            <Route path="/statistics" element={<Statitics />} />
            <Route path="/login" element={<Login />} />
          </Route>



          <Route path="/404" element={<NotFound />} />
          <Route path="*" element={<Navigate to="/404" />} />
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App



