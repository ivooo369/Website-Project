import "../../styles/dashboard/OrdersDashboard.css";
import { useState, useEffect } from "react";
import { Card, CardContent, Typography } from "@mui/material";
import axios from "axios";

const apiUrl = import.meta.env.VITE_API_URL;

export default function OrdersDashboard() {
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await axios.get(`${apiUrl}/admin/dashboard/orders`);
        const formattedOrders = response.data.map((order) => ({
          ...order,
          order_submission_date: formatOrderDate(order.order_submission_date),
          order_items: JSON.parse(order.order_items),
        }));

        setOrders(formattedOrders.reverse());
      } catch (error) {
        console.error("Грешка при извличане на поръчките:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrders();
    const intervalId = setInterval(fetchOrders, 1000);
    return () => clearInterval(intervalId);
  }, []);

  const formatOrderDate = (dateString) => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");

    return `${day}.${month}.${year} г. (${hours}:${minutes} ч.)`;
  };

  const handleDeleteOrder = async (orderId) => {
    try {
      await axios.delete(`${apiUrl}/admin/dashboard/orders/${orderId}`);
      setOrders(orders.filter((order) => order.order_id !== orderId));
    } catch (error) {
      console.error("Грешка при изтриване на поръчката:", error);
    }
  };

  const calculateTotalPrice = (orderItems) => {
    return orderItems
      .reduce((total, item) => total + item.price * item.framesQuantity, 0)
      .toFixed(2);
  };

  return (
    <div className="pages">
      <div className="page-header">
        <h1>Поръчки</h1>
      </div>
      <div className="orders-container">
        {isLoading ? null : orders.length === 0 ? (
          <p className="no-orders">Няма получени поръчки.</p>
        ) : (
          <ul className="orders-list">
            {orders.map((order) => (
              <li key={order.order_id} className="order-item">
                <div className="order-card">
                  <div className="customer-details">
                    <div>
                      <span className="detail-label">Име:</span>{" "}
                      <span className="detail-value">
                        {order.order_customer_name}
                      </span>
                    </div>
                    <div>
                      <span className="detail-label">Град:</span>{" "}
                      <span className="detail-value">
                        {order.order_customer_city}
                      </span>
                    </div>
                    <div>
                      <span className="detail-label">Адрес:</span>{" "}
                      <span className="detail-value">
                        {order.order_customer_address}
                      </span>
                    </div>
                    <div>
                      <span className="detail-label">Имейл:</span>{" "}
                      <span className="detail-value">
                        {order.order_customer_email}
                      </span>
                    </div>
                    <div>
                      <span className="detail-label">Телефон:</span>{" "}
                      <span className="detail-value">
                        {order.order_customer_phone}
                      </span>
                    </div>
                    {order.order_additional_info && (
                      <div>
                        <span className="detail-label">
                          Допълнителна информация:
                        </span>{" "}
                        <span className="detail-value">
                          {order.order_additional_info}
                        </span>
                      </div>
                    )}
                  </div>
                  <div className="order-details">
                    {order.order_items.map((item, index) => (
                      <Card
                        key={index}
                        sx={{
                          backgroundColor: "#efefef",
                          padding: 1,
                          width: "18rem",
                        }}
                      >
                        <CardContent>
                          <Typography variant="body1" color="textSecondary">
                            Вътрешна рамка: {item.innerFrame}
                          </Typography>
                          {item.outerFrame && (
                            <Typography variant="body1" color="textSecondary">
                              Външна рамка: {item.outerFrame}
                            </Typography>
                          )}
                          <Typography variant="body1" color="textSecondary">
                            Ширина: {item.frameWidth} см
                          </Typography>
                          <Typography variant="body1" color="textSecondary">
                            Височина: {item.frameHeight} см
                          </Typography>
                          {item.matboard && (
                            <>
                              <Typography variant="body1" color="textSecondary">
                                Паспарту: {item.matboard}
                              </Typography>
                              <Typography variant="body1" color="textSecondary">
                                Широчина на паспарту: {item.matboardWidth}
                              </Typography>
                            </>
                          )}
                          {item.glassOption && (
                            <Typography variant="body1" color="textSecondary">
                              Стъкло: {item.glassOption}
                            </Typography>
                          )}
                          {item.hangingOption && (
                            <Typography variant="body1" color="textSecondary">
                              Окачване: {item.hangingOption}
                            </Typography>
                          )}
                          {item.mirrorOption && (
                            <Typography variant="body1" color="textSecondary">
                              Огледало: {item.mirrorOption}
                            </Typography>
                          )}
                          {item.backingOption && (
                            <Typography variant="body1" color="textSecondary">
                              Гръб: {item.backingOption}
                            </Typography>
                          )}
                          {item.gobelinStretching && (
                            <Typography variant="body1" color="textSecondary">
                              Опъване на гоблен: {item.gobelinStretching}
                            </Typography>
                          )}
                          {item.subframeOption && (
                            <Typography variant="body1" color="textSecondary">
                              Подрамка: {item.subframeOption}
                            </Typography>
                          )}
                          <Typography variant="body1" color="textSecondary">
                            Брой рамки: {item.framesQuantity}
                          </Typography>
                          <Typography variant="body1" color="textSecondary">
                            Единична цена: {item.price} лв.
                          </Typography>
                          <Typography variant="body1" color="textSecondary">
                            Крайна цена:{" "}
                            {parseFloat(
                              item.price * item.framesQuantity
                            ).toFixed(2)}{" "}
                            лв.
                          </Typography>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                  <div className="date-and-button-container">
                    <div>
                      <b className="whole-order-total-price-container">
                        Крайна цена за цялата поръчка:{" "}
                        <span className="whole-order-total-price">
                          {calculateTotalPrice(order.order_items)} лв.
                        </span>
                      </b>
                    </div>
                    <div className="order-submission-date">
                      <span className="detail-label">Дата:</span>{" "}
                      <span className="detail-value">
                        {order.order_submission_date}
                      </span>
                    </div>
                    <div className="delete-order-button-container">
                      <button
                        className="delete-order-button"
                        onClick={() => handleDeleteOrder(order.order_id)}
                      >
                        <span className="material-symbols-outlined">
                          delete
                        </span>
                        Изтрий поръчката
                      </button>
                    </div>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
