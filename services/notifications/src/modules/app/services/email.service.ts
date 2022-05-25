import { Injectable } from "@nestjs/common";
import { OrderStatus } from "src/dto/order-status-update.dto";
import { ShipmentStatus } from "src/dto/shipment-status-update.dto";

//TODO: Actually implement using SendGrid API, currently just a placeholder
@Injectable()
export class EmailService {
  sendVerificationEmail(email: string, code: string) {
    console.log("Sending verification email to: ", email);
  }

  sendOrderConfirmationEmail(
    email: string,
    orderId: string,
    total: number,
    deliveryFees: number,
  ) {
    console.log("Sending order confirmation email to: ", email);
  }

  sendOrderStatusUpdate(email: string, orderId: string, status: OrderStatus) {
    console.log("Sending order status update email to: ", email);
  }

  sendShipmentStatusUpdate(
    email: string,
    orderId: string,
    status: ShipmentStatus,
  ) {
    console.log("Sending shipment status update email to: ", email);
  }
}
