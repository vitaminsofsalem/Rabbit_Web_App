import { Injectable } from "@nestjs/common";
import { Orders, OrdersDocument,  OrdersSchema } from "src/schemas/order.schema";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import CreateOrderDto from "src/dtos/CreateOrderDto";
import  {v4 as uuidv4}  from 'uuid';

import { BadRequestException } from "@nestjs/common";


@Injectable()
export class OrdersService {
  constructor(@InjectModel(Orders.name) private ordersModel: Model<OrdersDocument>){}

  async createOrder(email : string , items : [] , address : object , total : number ) {
    const itemsLength = items.length;
    const orderID = uuidv4()
    if(itemsLength < 1 || !email || !address) {
      throw new BadRequestException("missing data");
    }
    else {
     
        const newOrder = new this.ordersModel({email:email, items: items ,address: address, total : total} ,{ $set: { orderID: orderID } })

        await newOrder.save().then(() => console.log("new order is created"))
        .catch((err) => console.error(err));
    }
        //await this.ordersModel.updateOne({email} , {items} , {address} , $push : orderID )

    //we need to return orderID
    return orderID

  }

  async updateStatus(orderID : any , status : string) {
      const user = await this.ordersModel.findOne({ orderID });
      const email = user.email
     await this.ordersModel
      .updateOne({ orderID }, { $set: { status } })
      .then(() => console.log("Status Added"))
      .catch((err) => console.error(err));

      return email

  }


//get all orders for this email
  async getUserOrders(email : string) {
    const userOrders = await this.ordersModel.find({email})
    return userOrders;
  }

async getUserOrder(email : string , orderID : any) {
  const  isValid = await this.ordersModel.findOne({ orderID });
  const validEmail = await this.ordersModel.findOne({ email });
  if(!isValid || !validEmail) {
    throw new BadRequestException("invalid orderID or email");
  }
  else {
    const orderIS = {
      email : isValid.email ,
      orderID : isValid.orderID,
      address : isValid.address,
      items : isValid.items
    }
  return orderIS
  }

}





}