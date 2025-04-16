import { Routes, Route } from "react-router-dom";
import { routes } from "./routes";
import Layout from "../layout";

function AppRoutes() {
  return (
    <Layout>
      <Routes>
        {routes.map((route, index) => {
          if (route.children) {
            return (
              <Route key={index} path={route.path} element={route.element}>
                {route.children.map((child, childIndex) => (
                  <Route
                    key={childIndex}
                    path={child.path}
                    element={child.element}
                  />
                ))}
              </Route>
            );
          }
          return (
            <Route key={index} path={route.path} element={route.element} />
          );
        })}
      </Routes>
    </Layout>
  );
}

export default AppRoutes;
