import { Injectable } from "@nestjs/common";
import { OrderStatus } from "src/dto/order-status-update.dto";
import { ShipmentStatus } from "src/dto/shipment-status-update.dto";
import * as sendGridMail from "@sendgrid/mail";
import { logo } from "templates/logo";

/*
Messages have no types due to actual library having incorrect types that break the request
PR to fix: https://github.com/sendgrid/sendgrid-nodejs/pull/1364
*/

@Injectable()
export class EmailService {
  senderEmail = "rabbit_giu@outlook.com";

  constructor() {
    sendGridMail.setApiKey(process.env.SENDGRID_API_KEY);
  }

  async sendVerificationEmail(email: string, code: string) {
    const message = {
      to: email,
      from: this.senderEmail,
      templateId: "d-7219ff17fbd84bf3a4e84ff60f6ef99b",
      dynamicTemplateData: {
        code,
      },
      attachments: [
        {
          content: logo,
          filename: "logo.png",
          content_id: "logo",
          type: "image/png",
          disposition: "inline",
        },
      ],
    };

    sendGridMail
      .send(message)
      .then(() => {
        console.log("Sent verification code to:", email);
      })
      .catch((e) => {
        console.log("Failed to send verification code:", e.message);
      });
  }

  async sendOrderConfirmationEmail(
    email: string,
    orderId: string,
    total: number,
    deliveryFees: number,
  ) {
    const message = {
      to: email,
      from: this.senderEmail,
      templateId: "d-8a46d94055e848ceb64be45a27bc254b",
      dynamicTemplateData: {
        orderId,
        total: total.toFixed(2),
        deliveryFees: deliveryFees.toFixed(2),
        grandTotal: (total + deliveryFees).toFixed(2),
      },
      attachments: [
        {
          content: logo,
          filename: "logo.png",
          content_id: "logo",
          type: "image/png",
          disposition: "inline",
        },
      ],
    };

    sendGridMail
      .send(message)
      .then(() => {
        console.log("Sent confirmation mail to:", email);
      })
      .catch((e) => {
        console.log("Failed to send confirmation mail:", e.message);
      });
  }

  async sendOrderStatusUpdate(
    email: string,
    orderId: string,
    status: OrderStatus,
  ) {
    let title = "",
      subtext = "",
      statusText = "",
      subject = "";

    switch (status) {
      case "PROCESSING":
        subject = `Order ${orderId} Processed`;
        title = "Your order is being processed";
        statusText = "is currently being proccessed";
        subtext =
          "This email to confirm that your order has entered the processing stage and should be proccessed soon.";
        break;
      case "FULFILLED":
        subject = `Order ${orderId} Fulfilled`;
        title = "Your order is fulfilled";
        statusText = "has been fulfilled";
        subtext =
          "This email to confirm that your order has been fulfilled and is ready for shipping.";
        break;
      case "CANCELLED":
        subject = `Order ${orderId} Cancelled`;
        title = "Your order is cancelled";
        statusText = "has been cancelled";
        subtext =
          "This email to confirm that your order has been succefully cancelled. You will not recieve the items you ordered.";
        break;
      default:
        return;
    }

    const message = {
      to: email,
      from: this.senderEmail,
      templateId: "d-bac141527a55456da271e1aab044f394",
      dynamicTemplateData: {
        subject,
        title,
        statusText,
        subtext,
        orderId,
      },
      attachments: [
        {
          content: logo,
          filename: "logo.png",
          content_id: "logo",
          type: "image/png",
          disposition: "inline",
        },
      ],
    };

    sendGridMail
      .send(message)
      .then(() => {
        console.log("Sent order status mail to:", email);
      })
      .catch((e) => {
        console.log("Failed to send order status mail:", e.message);
      });
  }

  async sendShipmentStatusUpdate(
    email: string,
    orderId: string,
    status: ShipmentStatus,
  ) {
    let title = "",
      subtext = "",
      statusText = "",
      subject = "";

    switch (status) {
      case "CREATED":
        subject = `Shipment for Order ${orderId} Created`;
        title = "Your shipment has been created";
        statusText = "is being prepared for shipping";
        subtext =
          "This email to confirm that your order has reached shipping and is currently being prepared.";
        break;
      case "SHIPPED":
        subject = `Order ${orderId} Shipped`;
        title = "Your order has been shipped";
        statusText = "has left out warehouse";
        subtext =
          "This email to confirm that your order has been shipped is on it's way to you.";
        break;
      case "RETURNED":
        subject = `Order ${orderId} Returned`;
        title = "Your order has been returned";
        statusText = "has arrived back at our warehouse";
        subtext =
          "This email to confirm that your order arrived at our warehouse and that a refund is on it's way.";
        break;
      case "DELIVERED":
        subject = `Order ${orderId} Delivered`;
        title = "Your order has been deliverd";
        statusText = "has been delivered to you";
        subtext =
          "This email to confirm that your order has been picked up by you and is marked as completed.";
        break;
      default:
        return;
    }

    const message = {
      to: email,
      from: this.senderEmail,
      templateId: "d-bac141527a55456da271e1aab044f394",
      dynamicTemplateData: {
        subject,
        title,
        statusText,
        subtext,
        orderId,
      },
      attachments: [
        {
          content: logo,
          filename: "logo.png",
          content_id: "logo",
          type: "image/png",
          disposition: "inline",
        },
      ],
    };

    sendGridMail
      .send(message)
      .then(() => {
        console.log("Sent shipment status mail to:", email);
      })
      .catch((e) => {
        console.log("Failed to send shipment status mail:", e.message);
      });
  }
}
