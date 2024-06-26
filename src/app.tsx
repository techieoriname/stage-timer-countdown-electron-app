import { createRoot } from "react-dom/client";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Main from "./screens/Main";
import Timer from "./screens/Timer";

const root = createRoot(document.getElementById("root"));
root.render(
    <BrowserRouter>
        <Routes>
            <Route path="/" element={<Main />} />
            <Route path="/timer" element={<Timer />} />
        </Routes>
    </BrowserRouter>
);
