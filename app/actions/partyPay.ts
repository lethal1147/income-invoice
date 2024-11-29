"use server";

import { db } from "@/lib/db";
import { memberBillSchema, MemberBillSchemaType } from "@/schema/memberBill";
import { createBillSchema } from "@/schema/partyBill";
import { uploadToCloudinary } from "@/services/cloudinary";
import { readMenuFromReceiptImage } from "@/services/formRecognizer";
import { submitMessageToGPT } from "@/services/openai";
import { formatErrorMessage, generatePublicId } from "@/utils/formatter";
import { PartyBill, PaymentMethod } from "@prisma/client";
import dayjs from "dayjs";
