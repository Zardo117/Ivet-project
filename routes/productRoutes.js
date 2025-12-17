const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const authMiddleware = require('../middlewares/authMiddleware');

/**
 * @swagger
 * /api/products:
 *   get:
 *     summary: Retorna a lista de produtos
 *     tags: [Marketplace]
 *     responses:
 *       200:
 *         description: Lista de produtos
 */
router.get('/', productController.getAllProducts);

/**
 * @swagger
 * /api/products:
 *   post:
 *     summary: Cria um novo produto
 *     tags: [Marketplace]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - price
 *               - category
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *               price:
 *                 type: number
 *               category:
 *                 type: string
 *               imageUrl:
 *                 type: string
 *               stock:
 *                 type: integer
 *     responses:
 *       201:
 *         description: Produto criado com sucesso
 */
router.post('/', authMiddleware, productController.createProduct);

router.get('/:id', productController.getProductById);

module.exports = router;

