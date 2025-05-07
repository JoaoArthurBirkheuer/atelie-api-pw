const { body, validationResult } = require('express-validator');

const validatePedido = [
  body('vendedor_id').isInt().withMessage('ID do vendedor inválido'),
  body('status').optional().isIn(['PENDENTE', 'CANCELADO', 'ENTREGUE']),
  body('itens').isArray({ min: 1 }).withMessage('Deve conter pelo menos um item'),
  body('itens.*.peca_id').isInt().withMessage('ID da peça inválido'),
  body('itens.*.quantidade').isInt({ min: 1 }).withMessage('Quantidade inválida'),
  body('itens.*.preco_venda').isFloat({ min: 0 }).withMessage('Preço inválido'),
  body('itens.*.desconto_pct').optional().isFloat({ min: 0, max: 100 }),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        success: false,
        errors: errors.array() 
      });
    }
    next();
  }
];

module.exports = { validatePedido };