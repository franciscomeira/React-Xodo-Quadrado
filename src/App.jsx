import { Route, Routes } from "react-router";

import Loja from "./paginas/Loja";
import Admin from "./paginas/Admin";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Loja />} />
      {/* O admin só existe rodando local (npm run dev), nunca no site publicado */}
      {import.meta.env.DEV && <Route path="/admin" element={<Admin />} />}
    </Routes>
  );
}

export default App;
