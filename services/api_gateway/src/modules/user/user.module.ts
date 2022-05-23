import { Module } from "@nestjs/common";
import { FavoritesController } from "./controllers/favorites.controller";

@Module({
  imports: [],
  controllers: [FavoritesController],
  providers: [],
})
export class UserModule {}
