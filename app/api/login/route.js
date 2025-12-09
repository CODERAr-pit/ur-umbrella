import { dbConnect } from "@/lib/DbConnect";
import User from "@/models/User";
import { NextRequest, NextResponse } from "next/server";
export async function POST(request){
    try{ 
        await dbConnect();
    const body = await request.json();
    const {email,password}=body;

    const user=await User.findOne({email});

    if(user){
        const passcheck=await bcrypt.compare(password,user.password);

        if(passcheck){
            return NextResponse.json({},{
                status:200
            })
        }
        else{
           return NextResponse.json({},{
                status:202
            }) 
        }
    }
    else return NextResponse.json({},{
                status:201
            }) 
}
catch(err){
    NextResponse.json({msg:"Error Aa Gyi bhai"},{
                status:404
            }) 
}
}