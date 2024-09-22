import crypto from "node:crypto";
import { authOptions } from "@/lib/auth/authOption";
import { db } from "@/lib/db/db";
import {
  deliveryPersons,
  inventories,
  orders,
  product,
  users,
  warehouses,
} from "@/lib/db/models";
import { orderSchema } from "@/lib/validators/orderSchema";
import { and, desc, eq, inArray, isNull } from "drizzle-orm";
import { Currency } from "lucide-react";
import { getServerSession } from "next-auth";
import axios from "axios";
import { NextRequest, NextResponse } from "next/server";
import { any } from "zod";

export async function POST(request: NextRequest) {
  // get session
  const session = await getServerSession(authOptions);
  console.log("session", session);

  if (!session) {
    return NextResponse.json({ message: "Not Allowed" }, { status: 401 });
  }

  //validate request body
  const requestData = request.json();
  let validatedData;
  try {
    validatedData = await orderSchema.parse(requestData);
  } catch (error) {
    return NextResponse.json(error, { status: 400 });
  }

  console.log("validated Data", validatedData);

  // order creation
  // ham chahte hai ki jitni bhi query ham DAta base se kar rahe vo sari ya to fail ho jaye ya to success ho jaye  esa nahi hona chahiye ki kuchh failed ho jaye ya kuchh pass ho jaye. Isiliye ham ye sab transection me rakhte hai

  //Get warehouse according to entered pincode
  const warehouseResult = await db
    .select({ id: warehouses.id })
    .from(warehouses)
    .where(eq(warehouses.pincode, validatedData.pincode));

  // db.select always return a array

  if (!warehouseResult.length) {
    return NextResponse.json(
      {
        message: "No warehouse found",
      },
      { status: 400 }
    );
  }

  //fetched Product
  const foundProducts = await db
    .select()
    .from(product)
    .where(eq(product.id, validatedData.productId))
    .limit(1);

  if (!foundProducts.length) {
    return NextResponse.json(
      {
        message: "No Product found",
      },
      { status: 400 }
    );
  }

  let transactionError: string = "";

  let finalOrder: any;
  try {
    finalOrder = await db.transaction(async (tx) => {
      //create Order
      const order = await tx
        .insert(orders)
        .values({
          ...validatedData,
          // @ts-ignore
          userId: Number(session.token.id),
          price: foundProducts[0].price * validatedData.qty,
          // todo: move all statuses to enum or const
          status: "received",
        })
        .returning({ id: orders.id, price: orders.price });

      //check product stock available or not
      const availableStock = await tx
        .select()
        .from(inventories)
        .where(
          and(
            eq(inventories.warehouseId, warehouseResult[0].id),
            eq(inventories.productId, validatedData.productId),
            isNull(inventories.orderId)
          )
        )
        .limit(validatedData.qty)
        .for("update", { skipLocked: true }); // for lock

      if (availableStock.length < validatedData.qty) {
        transactionError = `Stock is low, only ${availableStock.length} products available`;
        tx.rollback(); // pura transection cancel ho jayga lock chije unlock ho jayngi
        return;
      }

      //check delivery person is free or not
      const availablePersons = await tx
        .select()
        .from(deliveryPersons)
        .where(
          and(
            isNull(deliveryPersons.orderId),
            eq(deliveryPersons.warehouseId, warehouseResult[0].id)
          )
        )
        .for("update")
        .limit(1);

      // if delivery Persons not available
      if (!availablePersons.length) {
        transactionError = `Delivery person is not available at the moment`;
        tx.rollback();
        return;
      }

      // yaha tak pahuche hai to iska matlab
      // stock is available and delivery person is available

      // ab
      // update inventories table and add order_id
      await tx
        .update(inventories)
        .set({ orderId: order[0].id })
        .where(
          inArray(
            inventories.id,
            availableStock.map((stock) => stock.id)
          )
        );

      //update delivery persons
      await tx
        .update(deliveryPersons)
        .set({ orderId: order[0].id })
        .where(eq(deliveryPersons.id, availablePersons[0].id));

      //update Orders
      await tx
        .update(orders)
        .set({ status: "reserved" })
        .where(eq(orders.id, order[0].id));

      return order[0];
    });
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      {
        message: transactionError
          ? transactionError
          : "Error while transection",
      },
      { status: 500 }
    );
  }

  // create invoice
  const payment_url = "https://api.cryptomus.com/v1/payment";

  const paymentData = {
    amount: String(finalOrder.price),
    currency: "USD",
    order_id: String(finalOrder.id),
    url_return: "http://localhost:3000/payment/return",
    url_success: "http://localhost:3000/payment/success",
    url_callback:
      "https://5cf1-2401-4900-1c09-8854-fd40-a56e-5166-f47f.ngrok-free.app/api/payment/return",
  };
  //cryptomus ko url_callback localhost pr nahi honi chahiye to ise access kare ke liye ham ek tool use karte hai iska naam hai ngrok ye ek tunnel create karta hai running localhost or google server ke mid me or ek url return karta hai

  //javascript ka internal function hai decoding ka
  const stringData =
    btoa(JSON.stringify(paymentData)) + process.env.CRYPTOMUS_API_KEY;
  // it will return bash 64 string

  const sign = crypto.createHash("md").update(stringData).digest("hex");
  const headers = {
    merchant: process.env.CRYPTOMUS_MERCHANT_ID,
    sign,
  };

  const paymentUrl = "https://api.cryptomus.com/v1/payment";

  try {
    const resp: any = await axios.post(paymentUrl, paymentData, {
      headers,
    });
    console.log("resp", resp.data);

    // demo example of resp.data
    /* 
    {
      "state": 0,
      "result": {
        "uuid": "26109ba0-b05b-4ee0-93d1-fd62c822ce95",
        "order_id": "1",
        "amount": "15.00",
        "payment_amount": null,
        "payer_amount": null,
        "discount_percent": null,
        "discount": "0.00000000",
        "payer_currency": null,
        "currency": "USD",
        "merchant_amount": null,
        "network": null,
        "address": null,
        "from": null,
        "txid": null,
        "payment_status": "check",
        "url": "https://pay.cryptomus.com/pay/26109ba0-b05b-4ee0-93d1-fd62c822ce95",
        "expired_at": 1689098133,
        "status": "check",
        "is_final": false,
        "additional_data": null,
        "created_at": "2023-07-11T20:23:52+03:00",
        "updated_at": "2023-07-11T21:24:17+03:00"
      }
    }
    */

    return NextResponse.json({ paymentUrl: resp.data.result.url });
  } catch (err) {
    console.log("error while creating an invoice", err);
    // todo: 1. retry if not then we have undo the order.
    return NextResponse.json({
      message: "Failed to create an invoice",
    });
  }
}

export async function GET() {
  // todo: add authentication and authorization
  // todo: add logging
  // todo: add error handling
  const allOrders = await db
    .select({
      id: orders.id,
      product: product.name,
      productId: product.id,
      userId: users.id,
      user: users.fname,
      type: orders.type,
      price: orders.price,
      image: product.image,
      status: orders.status,
      address: orders.address,
      qty: orders.qty,
      createAt: orders.createdAt,
    })
    .from(orders)
    .leftJoin(product, eq(orders.productId, product.id))
    .leftJoin(users, eq(orders.userId, users.id))
    // join inventories (orderId)
    // join delivery person (orderId)
    // join warehouse (deliveryId)
    // todo: 1. use pagination, 2. Put index
    .orderBy(desc(orders.id));
  return Response.json(allOrders);
}
