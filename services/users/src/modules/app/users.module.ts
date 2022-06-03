import { Module } from "@nestjs/common";
import { ClientsModule, Transport } from "@nestjs/microservices";
import { UsersController } from "./users.controller";
import { UsersService } from "./services/users.service";
import { User, UserSchema } from "../../schemas/users.schema";
import { Code, CodeSchema } from "../../schemas/code.schema";
import { MongooseModule } from "@nestjs/mongoose";

@Module({
  imports: [
    ClientsModule.register([
      {
        name: "KAFKA_CLIENT",
        transport: Transport.KAFKA,
        options: {
          client: {
            clientId: "users",
            brokers: ["localhost:9092"],
          },
          consumer: {
            groupId: "users-consumer",
          },
        },
      },
    ]),
    MongooseModule.forRoot(
      "mongodb+srv://root:c61bRi1t5l57P3ea@rabbitcluster.kcscswy.mongodb.net/rabbit-users?retryWrites=true&w=majority",
    ),
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: Code.name, schema: CodeSchema },
    ]),
  ],
  controllers: [UsersController],
  providers: [UsersService],
})
export class AppModule {}
