import { dbConnect } from "@/lib/DbConnect";
import User from "@/models/User";
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";

export async function POST(request){
    try{
    await dbConnect();
    const body=await request.json();
   const { user, email, password, phone, address: { street, city, state, pincode }, role } = body;
    const check=await User.findOne({email:email}); 

    if(check){
        return NextResponse.json({msg:" User Already exist, please Do Login "},{status:400})
    }
    else{
        const hashedpass=await bcrypt.hash(password,10);
        await User.create({
            user:user,
            email:email,
            password:hashedpass,
            phone:phone,
            address:{street:street,city:city,state:state,pincode:pincode}
        })
        return NextResponse.json({
            msg:"User Saved Succesfully"
        },{status:200})
    }
    }
    catch(err){
        return NextResponse.json({
            msg:"SignUp not succesfull",
            error:err
        },{statues:404})
    }
}
