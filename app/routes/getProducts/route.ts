
import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";
const prisma = new PrismaClient()


export async function GET(){
    try{
        const showProducts = await prisma.product.findMany()
        return NextResponse.json(showProducts)
    }catch(err){
        return NextResponse.json(err)
    }
}

