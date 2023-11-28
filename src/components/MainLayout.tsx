import { BrowserRouter } from "react-router-dom";
import HeaderLayout from "./HeaderLayout";

const MainLayout = () => {
  return (
    <BrowserRouter>
      <HeaderLayout />
    </BrowserRouter>
  );
};

export default MainLayout;
