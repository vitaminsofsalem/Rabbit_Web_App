import { Module } from "@nestjs/common";
import { AddressController } from "./controllers/address.controller";
import { FavoritesController } from "./controllers/favorites.controller";
import { NameController } from "./controllers/name.controller";

@Module({
  imports: [],
  controllers: [FavoritesController, NameController, AddressController],
  providers: [],
})
export class UserModule {}
