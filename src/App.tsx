import { BrowserRouter, Route, Routes } from "react-router";
import { Layout } from "@/components/layout/Layout";
import { Home } from "@/routes/Home";
import { Dispatches } from "@/routes/Dispatches";
import { IndexRoute } from "@/routes/Index";
import { Comp } from "@/routes/Comp";
import { Goods } from "@/routes/Goods";
import { About } from "@/routes/About";
import { Dispatch } from "@/routes/Dispatch";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/dispatches" element={<Dispatches />} />
          <Route path="/dispatches/:slug" element={<Dispatch />} />
          <Route path="/index" element={<IndexRoute />} />
          <Route path="/comp" element={<Comp />} />
          <Route path="/goods" element={<Goods />} />
          <Route path="/about" element={<About />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
