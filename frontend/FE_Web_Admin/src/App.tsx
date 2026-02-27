import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import DefaultLayout from "./layouts/DefaultLayout";
import HomePages from "./pages/HomePages";
import NoPage from "./pages/NoPage";

const queryClient = new QueryClient();

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          {/* Layout */}
          <Route path="/" element={<DefaultLayout />}>
            <Route index element={<HomePages />} />
          </Route>

          {/* 404 */}
          <Route path="*" element={<NoPage />} />
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  );
}
