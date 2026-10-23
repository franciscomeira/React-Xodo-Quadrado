import { Route, Routes } from "react-router";

import Loja from "./paginas/Loja";
import Admin from "./paginas/Admin";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Loja />} />
      <Route path="/admin" element={<Admin />} />
    </Routes>
  );
}

export default App;
