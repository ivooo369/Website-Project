import "../../styles/dashboard/Dashboard.css";
import { useEffect, useState } from "react";
import { useNavigate, Link, Outlet } from "react-router-dom";
import Button from "@mui/material/Button";
import axios from "axios";

const apiUrl = import.meta.env.VITE_API_URL;

export default function Dashboard() {
  const navigateTo = useNavigate();
  const [counts, setCounts] = useState({
    productCount: 0,
    orderCount: 0,
    messageCount: 0,
  });

  useEffect(() => {
    const adminAuthToken = localStorage.getItem("adminAuthToken");
    if (!adminAuthToken) {
      navigateTo("/admin/login");
    }
  }, [navigateTo]);

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 1000);
    return () => clearInterval(interval);
  }, []);

  async function fetchData() {
    try {
      const response = await axios.get(`${apiUrl}/admin/dashboard`);
      if (!response.status === 200) {
        throw new Error("Грешка при извличане на броя!");
      }
      setCounts(response.data);
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <div className="dashboard-container pages">
      <header className="dashboard-header">
        <h1 className="dashboard-title">Администраторски панел</h1>
        <div className="dashboard-links-container">
          <Link to="/admin/dashboard/products" className="dashboard-links">
            <Button variant="contained" id="dashboard-products-button">
              Продукти {counts ? `(${counts.productCount})` : ""}
            </Button>
          </Link>
          <Link to="/admin/dashboard/orders" className="dashboard-links">
            <Button variant="contained" id="dashboard-orders-button">
              Поръчки {counts ? `(${counts.orderCount})` : ""}
            </Button>
          </Link>
          <Link to="/admin/dashboard/messages" className="dashboard-links">
            <Button variant="contained" id="dashboard-messages-button">
              Съобщения {counts ? `(${counts.messageCount})` : ""}
            </Button>
          </Link>
          <Link to="/" className="dashboard-links">
            <Button variant="contained" id="exit-from-dashboard-button">
              Изход
            </Button>
          </Link>
        </div>
      </header>
      <Outlet />
    </div>
  );
}
