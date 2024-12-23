import axios from "axios";
import AppError from "../utils/appError.js";
import gameStatsDAO from "./gameStatsDAO.js";
import redisClient from "../utils/redisClient.js";

class PaymentDAO {
  itemList = [
    {
      itemName: "Bronze",
      price: "100.00",
    },
    {
      itemName: "Silver",
      price: "200.00",
    },
    {
      itemName: "Gold",
      price: "300.00",
    },
    {
      itemName: "Platinum",
      price: "400.00",
    },
    {
      itemName: "Emerald",
      price: "500.00",
    },
    {
      itemName: "Diamond",
      price: "600.00",
    },
    {
      itemName: "Master",
      price: "700.00",
    },
  ];

  async generateAccessToken() {
    try {
      const cachedToken = await redisClient.get("paypal_access_token");
      if (cachedToken) {
        return cachedToken;
      }

      const response = await axios({
        url: process.env.PAYPAL_BASE_URL + "/v1/oauth2/token",
        method: "post",
        data: "grant_type=client_credentials",
        auth: {
          username: process.env.PAYPAL_CLIENT_ID,
          password: process.env.PAYPAL_SECRET,
        },
      });

      console.log(response.data);
      console.log(response.data.expires_in);

      await redisClient.set(
        "paypal_access_token",
        response.data.access_token,
        "EX",
        response.data.expires_in
      );

      return response.data.access_token;
    } catch {
      return null;
    }
  }

  async createOrder(itemName) {
    const accessToken = await this.generateAccessToken();
    if (!accessToken) {
      throw new AppError("Missing access token from Paypal!", 500);
    }

    //Find item
    const item = this.itemList.find((item) => item.itemName === itemName);
    if (!item) {
      console.error("Item not found");
      throw new AppError("Item not found!", 400);
    }

    try {
      const response = await axios({
        url: process.env.PAYPAL_BASE_URL + "/v2/checkout/orders",
        method: "post",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + accessToken,
        },
        data: JSON.stringify({
          intent: "CAPTURE",
          purchase_units: [
            {
              reference_id: "promotion_" + item.itemName.toLowerCase(),
              description: "Promotion Purchase for " + item.itemName,
              items: [
                {
                  name: item.itemName + " Promotion",
                  description: "Promote your account to " + item.itemName,
                  quantity: 1,
                  unit_amount: {
                    currency_code: "USD",
                    value: item.price,
                  },
                },
              ],

              amount: {
                currency_code: "USD",
                value: item.price,
                breakdown: {
                  item_total: {
                    currency_code: "USD",
                    value: item.price,
                  },
                },
              },
            },
          ],
          application_context: {
            return_url:
              "https://caro-league-frontend.onrender.com/payment-success",
            cancel_url: "https://caro-league-frontend.onrender.com/shop",
            shipping_preference: "NO_SHIPPING",
            user_action: "PAY_NOW",
            brand_name: "Caro League",
          },
        }),
      });
      console.log(response.data);
      console.log(response.data.links[1].href);
      return response.data.links[1].href;
    } catch (error) {
      console.log(error);
      throw new AppError("Internal server error!", 500);
    }
  }

  async capturePayment(orderId) {
    const accessToken = await this.generateAccessToken();
    if (!accessToken) {
      throw new AppError("Missing access token from Paypal!", 500);
    }

    try {
      const response = await axios({
        url:
          process.env.PAYPAL_BASE_URL +
          `/v2/checkout/orders/${orderId}/capture`,
        method: "post",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + accessToken,
        },
      });
      return response.data;
    } catch (error) {
      console.log(error);
      throw new AppError("Capture payment error!", 500);
    }
  }
}
export default new PaymentDAO();
