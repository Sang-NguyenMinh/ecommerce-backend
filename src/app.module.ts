import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { OrderLineModule } from './core/order-line/order-line.module';
import { ProductModule } from './core/product/product.module';
import { ProductConfigurationModule } from './core/product_configuration/product_configuration.module';
import { ProductCategoryModule } from './core/product-category/product-category.module';
import { ProductItemModule } from './core/product-item/product-item.module';
import { PromotionModule } from './core/promotion/promotion.module';
import { PromotionCategoryModule } from './core/promotion-category/promotion-category.module';
import { PromotionProductModule } from './core/promotion-product/promotion-product.module';
import { ShippingMethodModule } from './core/shipping-method/shipping-method.module';
import { ShopOrderModule } from './core/shop-order/shop-order.module';
import { ShoppingCartModule } from './core/shopping-cart/shopping-cart.module';
import { ShoppingCartItemModule } from './core/shopping-cart-item/shopping-cart-item.module';
import { UserModule } from './core/user/user.module';
import { UserAddressModule } from './core/user-address/user-address.module';
import { UserReviewModule } from './core/user-review/user-review.module';
import { VariationModule } from './core/variation/variation.module';
import { VariationOptionModule } from './core/variation_option/variation_option.module';
import { MailerModule } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { APP_GUARD } from '@nestjs/core';
import { JwtAuthGuard } from './auths/passport/jwt-auth.guard';
import { AuthsModule } from './auths/auths.module';
import { BaseModule } from './core/base/base.module';
@Module({
  imports: [
    OrderLineModule,
    ProductModule,
    ProductConfigurationModule,
    ProductCategoryModule,
    ProductItemModule,
    PromotionModule,
    PromotionCategoryModule,
    PromotionProductModule,
    ShippingMethodModule,
    ShopOrderModule,
    ShoppingCartModule,
    ShoppingCartItemModule,
    UserModule,
    UserAddressModule,
    UserReviewModule,
    VariationModule,
    VariationOptionModule,
    AuthsModule,
    BaseModule,
    ConfigModule.forRoot({ isGlobal: true }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get<string>('MONGODB_URI'),
        dbName: 'ecommerce',
      }),
      inject: [ConfigService],
    }),
    MailerModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        transport: {
          host: 'smtp.gmail.com',
          port: 465,
          secure: true,
          auth: {
            user: configService.get<string>('MAIL_USER'),
            pass: configService.get<string>('MAIL_PASSWORD'),
          },
        },
        defaults: {
          from: '"No Reply" <no-reply@localhost>',
        },
        template: {
          dir: process.cwd() + '/src/mail/templates/',
          adapter: new HandlebarsAdapter(),
          options: {
            strict: true,
          },
        },
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
  ],
})
export class AppModule {}
