const express = require("express");
const router = express.Router();
const Order = require("../schemas/orders");

router.get("/", async (req, res) => {
  const orders = await Order.getOrders();
  res.json(orders);
});

router.post("/", async (req, res) => {
  const { userId, total } = req.body;

  const order = await Order.createOrder(userId, total);

  res.json(order);
});

module.exports = router;