let express = require('express');
let router = express.Router()
const { CheckLogin } = require('../utils/authHandler');
let cartModel = require('../schemas/carts')
let inventoryModel = require('../schemas/inventories')
//get
router.get('/', CheckLogin, async function (req, res, next) {
    let user = req.user;
    let cart = await cartModel.findOne({
        user: user._id
    })
    res.send(cart.products)
})
//add
router.post('/add', CheckLogin, async function (req, res, next) {
    let user = req.user;
    let cart = await cartModel.findOne({
        user: user._id
    })
    let products = cart.products;
    let productID = req.body.product;
    let checkProduct = await inventoryModel.findOne({
        product: productID
    })
    if (!checkProduct) {
        res.status(404).send({
            message: "san pham khong ton tai"
        })
        return;
    }
    let index = products.findIndex(function (p) {
        return p.product == productID
    })
    if (index < 0) {
        products.push({
            product: productID,
            quantity: 1
        })
    } else {
        products[index].quantity += 1
    }
    await cart.save();
    res.send(cart)
})
//remove
router.post('/remove', CheckLogin, async function (req, res, next) {
    let user = req.user;
    let cart = await cartModel.findOne({
        user: user._id
    })
    let products = cart.products;
    let productID = req.body.product;
    let checkProduct = await inventoryModel.findOne({
        product: productID
    })
    if (!checkProduct) {
        res.status(404).send({
            message: "san pham khong ton tai"
        })
        return;
    }
    let index = products.findIndex(function (p) {
        return p.product == productID
    })
    if (index < 0) {
        res.status(404).send({
            message: "san pham khong ton tai trong gio hang"
        })
    } else {
        products.splice(index, 1)
    }
    await cart.save();
    res.send(cart)
})
//decrease
router.post('/decrease', CheckLogin, async function (req, res, next) {
    let user = req.user;
    let cart = await cartModel.findOne({
        user: user._id
    })
    let products = cart.products;
    let productID = req.body.product;
    let checkProduct = await inventoryModel.findOne({
        product: productID
    })
    if (!checkProduct) {
        res.status(404).send({
            message: "san pham khong ton tai"
        })
        return;
    }
    let index = products.findIndex(function (p) {
        return p.product == productID
    })
    if (index < 0) {
        res.status(404).send({
            message: "san pham khong ton tai trong gio hang"
        })
    } else {
        if (products[index].quantity == 1) {
            products.splice(index, 1)
        } else {
            products[index].quantity -= 1
        }
    }
    await cart.save();
    res.send(cart)
})
//modify
router.post('/modify', CheckLogin, async function (req, res, next) {
    let user = req.user;
    let cart = await cartModel.findOne({
        user: user._id
    })
    let products = cart.products;
    let productID = req.body.product;
    let quantity = req.body.quantity;
    let checkProduct = await inventoryModel.findOne({
        product: productID
    })
    if (!checkProduct) {
        res.status(404).send({
            message: "san pham khong ton tai"
        })
        return;
    }
    let index = products.findIndex(function (p) {
        return p.product == productID
    })
    if (index < 0) {
        res.status(404).send({
            message: "san pham khong ton tai trong gio hang"
        })
    } else {
        if (quantity == 0) {
            products.splice(index, 1)
        } else {
            products[index].quantity = quantity;
        }
    }
    await cart.save();
    res.send(cart)
})
//checkout
router.post("/checkout", async (req, res) => {
  const client = await pool.connect();

  try {
    const io = req.app.get("io");
    const userId = req.user?.id || 1;

    await client.query("BEGIN");

    const orderResult = await client.query(
      "INSERT INTO orders (user_id, total) VALUES ($1, $2) RETURNING *",
      [userId, 100000]
    );

    const order = orderResult.rows[0];

    const paymentResult = await client.query(
      "INSERT INTO payments (order_id, amount, status) VALUES ($1, $2, $3) RETURNING *",
      [order.id, order.total, "success"]
    );

    const payment = paymentResult.rows[0];

    await client.query("COMMIT");

    io.emit("new_order", order);

    res.json({
      message: "Transaction thành công",
      order,
      payment,
    });

  } catch (err) {
    await client.query("ROLLBACK");

    res.status(500).json({
      message: "Transaction thất bại",
      error: err.message,
    });
  } finally {
    client.release();
  }
});
module.exports = router