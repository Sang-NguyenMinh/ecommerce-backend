require('ts-node/register');
require('tsconfig-paths/register');
const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');

(async () => {
  // ✅ import ESM dynamic
  const { default: jsonSchema } = await import('mongoose-schema-jsonschema');
  jsonSchema(mongoose);

  const schemas = {
    User: require('./src/core/user/schemas/user.schema.ts').UserSchema,
    UserAddress:
      require('./src/core/user-address/schemas/user-address.schema.ts')
        .UserAddressSchema,
    UserReview: require('./src/core/user-review/schemas/user-review.schema.ts')
      .UserReviewSchema,
    ShopOrder: require('./src/core/shop-order/schemas/shop-order.schema.ts')
      .ShopOrderSchema,
    OrderLine: require('./src/core/order-line/schemas/order-line.schema.ts')
      .OrderLineSchema,
    ShippingMethod:
      require('./src/core/shipping-method/schemas/shipping-method.scheme.ts')
        .ShippingMethodSchema,
    ShoppingCart:
      require('./src/core/shopping-cart/schemas/shopping-cart.schema.ts')
        .ShoppingCartSchema,
    ShoppingCartItem:
      require('./src/core/shopping-cart-item/schemas/shopping-cart-item.schema.ts')
        .ShoppingCartItemSchema,
    Product: require('./src/core/product/schemas/product.schema.ts')
      .ProductSchema,
    ProductCategory:
      require('./src/core/product-category/schemas/product-category.schema.ts')
        .ProductCategorySchema,
    ProductItem:
      require('./src/core/product-item/schemas/product-item.schema.ts')
        .ProductItemSchema,
    ProductConfiguration:
      require('./src/core/product_configuration/schemas/product_configuration.schema.ts')
        .ProductConfigurationSchema,
    CategoryVariation:
      require('./src/core/category-variation/schemas/category-variation.schema.ts')
        .CategoryVariationSchema,
    Variation: require('./src/core/variation/schemas/variation.schema.ts')
      .VariationSchema,
    VariationOption:
      require('./src/core/variation_option/schemas/variation_option.schema.ts')
        .VariationOptionSchema,
    Promotion: require('./src/core/promotion/schemas/promotion.schema.ts')
      .PromotionSchema,
    PromotionUsage:
      require('./src/core/promotion-usage/schemas/promotion-usage.schema.ts')
        .PromotionUsageSchema,
    PromotionCategory:
      require('./src/core/promotion-category/schemas/promotion-category.schema.ts')
        .PromotionCategorySchema,
    PromotionProduct:
      require('./src/core/promotion-product/schemas/promotion-product.schema.ts')
        .PromotionProductSchema,
  };

  const output = {};
  for (const [name, schema] of Object.entries(schemas)) {
    if (schema && typeof schema.jsonSchema === 'function') {
      output[name] = schema.jsonSchema();
    } else {
      console.warn(`⚠️ Schema ${name} không có hàm jsonSchema()`);
    }
  }

  const outputPath = path.join(__dirname, 'schema.json');
  fs.writeFileSync(outputPath, JSON.stringify(output, null, 2));

  console.log('✅ Xuất file schema.json thành công tại:', outputPath);
})();
