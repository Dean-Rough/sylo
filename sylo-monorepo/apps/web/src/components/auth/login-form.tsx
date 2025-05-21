import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/components/ui/use-toast";
import { FcGoogle } from "react-icons/fc";

export function LoginForm() {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  async function onGoogleLogin() {
    setIsLoading(true);
    try {
      // In a real implementation, this would redirect to Google OAuth
      // For now, we'll just show a toast
      toast({
        title: "Google Login",
        description: "This would redirect to Google OAuth in a real implementation",
      });
      // Simulate a delay
      await new Promise((resolve) => setTimeout(resolve, 1000));
      // Redirect to dashboard
      window.location.href = "/dashboard";
    } catch (error) {
      toast({
        title: "Error",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex flex-col space-y-4">
          <Button
            variant="outline"
            onClick={onGoogleLogin}
            disabled={isLoading}
            className="flex items-center justify-center gap-2"
          >
            <FcGoogle className="h-5 w-5" />
            <span>{isLoading ? "Signing in..." : "Sign in with Google"}</span>
          </Button>
          
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <Separator className="w-full" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">
                Or continue with
              </span>
            </div>
          </div>
          
          <Button
            disabled={true}
            className="w-full"
          >
            Email login coming soon
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}