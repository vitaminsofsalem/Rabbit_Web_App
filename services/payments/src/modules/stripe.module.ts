import Stripe from "stripe";
import { DynamicModule, Module } from "@nestjs/common";

@Module({})
export class StripeModule {
  static register(apiKey: string, options: any): DynamicModule {
    return {
      module: StripeModule,
      providers: [
        {
          provide: "STRIPE",
          useValue: new Stripe(apiKey, options),
        },
      ],
      exports: ["STRIPE"],
    };
  }
}
