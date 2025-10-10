import { NextRequest, NextResponse } from "next/server";

export const POST = async (request: NextRequest) => {
    return NextResponse.json({ status: 'success', message: 'Hello from stripe API' })
}
