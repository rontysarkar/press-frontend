"use client"


import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { loginAction } from "../_actions/authAction";
import { useActionState, useEffect } from "react";
import { toast } from "sonner";

const UserLoginForm = () => {
    const [state,action,pending] = useActionState(loginAction,false)
    
    useEffect(()=>{
        if(!state) return;
        if(state.success){
            toast.success(state.message || "Login Successfully")
        }
        if(!state.success){
            toast.error(state.message || "Login Failed")
        }
    },[state])
  return (
    <form action={action} className="space-y-4">
      <Card className="p-6 space-y-4">
        <Input
          name="email"
          type="email"
          placeholder="Enter your email"
          required
        />
        <Input
          name="password"
          type="password"
          placeholder="Enter your password"
          required
        />
        <Button type="submit">
            {
                pending ? "login......" : "login"
            }
        </Button>
      </Card>
    </form>
  );
};

export default UserLoginForm;
