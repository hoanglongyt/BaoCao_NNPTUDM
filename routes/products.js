//inventory
//cart
//reservation
//payments
var express = require('express');
var router = express.Router();
const slugify = require('slugify');
const { Product, Category } = require('../models');
const { Op } = require('sequelize');

/* GET products listing. */
router.get('/', async function (req, res, next) {
  let queries = req.query;
  let titleQ = queries.title ? queries.title : "";
  let minPrice = queries.min ? parseFloat(queries.min) : 0;
  let maxPrice = queries.max ? parseFloat(queries.max) : 1000000;
  console.log(queries);
  let result = await Product.findAll({
    where: {
      isDeleted: false,
      title: {
        [Op.iLike]: `%${titleQ}%`
      },
      price: {
        [Op.gte]: minPrice,
        [Op.lte]: maxPrice
      }
    },
    include: [{
      model: Category,
      attributes: ['name']
    }]
  });
  res.send(result);
});

router.get('/:id', async function (req, res, next) {
  try {
    let id = req.params.id;
    let result = await Product.findByPk(id, {
      include: [Category]
    });
    if (!result || result.isDeleted) {
      res.status(404).send({
        message: "ID NOT FOUND"
      });
    } else {
      res.send(result)
    }
  } catch (error) {
    res.status(404).send({
      message: "ID NOT FOUND"
    });
  }
});

router.post('/', async function (req, res, next) {
  const t = await sequelize.transaction();
  try {
    let newProduct = await Product.create({
      title: req.body.title,
      slug: slugify(req.body.title, {
        replacement: '-',
        remove: undefined,
        lower: true
      }),
      price: req.body.price,
      description: req.body.description,
      images: req.body.images || [],
      categoryId: req.body.category
    }, { transaction: t });
    
    // Create inventory if needed
    await Inventory.create({
      productId: newProduct.id,
      stock: 0
    }, { transaction: t });
    
    await t.commit();
    res.send(newProduct);
  } catch (error) {
    await t.rollback();
    res.status(404).send(error.message)
  }
})

router.put('/:id', async function (req, res, next) {
  try {
    let id = req.params.id;
    let [count, result] = await Product.update(req.body, {
      where: { id },
      returning: true
    });
    if (count === 0) {
      res.status(404).send({ message: "ID NOT FOUND" });
    } else {
      res.send(result[0]);
    }
  } catch (error) {
    res.status(404).send(error)
  }
})

router.delete('/:id', async function (req, res, next) {
  try {
    let id = req.params.id;
    let [count] = await Product.update({ isDeleted: true }, {
      where: { id }
    });
    if (count === 0) {
      res.status(404).send({
        message: "ID NOT FOUND"
      });
    } else {
      res.send({ message: "Product soft deleted" });
    }
  } catch (error) {
    res.status(404).send({
      message: "ID NOT FOUND"
    });
  }
})

module.exports = router;
