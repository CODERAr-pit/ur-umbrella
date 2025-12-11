import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { NextResponse } from "next/server";
import history from "@/models/history";
import { dbConnect } from "@/lib/DbConnect";

export async function GET(){
    await dbConnect()
    const session = await getServerSession(authOptions);
    if(!session){
        return NextResponse.json({
            msg:"Please Log In"
        },{status:202})
    }
    if(session.user.role==="customer"){
        return NextResponse.json({
            msg:"Invalid Request"
        },{status:203})
    }
    const myID = session.user._id;
    const myOrders = await history.find({ sellerId: myID })
                             .populate("items.productId") 
                             .sort({ purchaseDate: -1 });
    return NextResponse.json({msg:"History Fetched Succesfully",data:myOrders},{status:200});
}