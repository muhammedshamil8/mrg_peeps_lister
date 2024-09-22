import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth } from "../../config/firebase";
import { signInWithEmailAndPassword } from "firebase/auth";
import { useAuth } from '@/context/AuthContext';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
  Form,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Loader } from 'lucide-react';
import { useToast } from "@/hooks/use-toast"

const loginSchema = z.object({
  email: z.string().email({ message: "Invalid email address" }),
  password: z.string().min(6, { message: "Password must be at least 6 characters long" }),
});

const Login = () => {
  const form = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const authContext = useAuth();
  const { user, role: userRole } = authContext || {};
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const { toast } = useToast()

  useEffect(() => {
    if (user) {
      if (userRole === 'admin') {
        navigate('/add-data');
      } else {
        toast({
          title: 'Unauthorized',
          description: 'You are not authorized to access this page',
          variant: 'destructive',
        })
      }
    }
  }, [user, userRole, navigate]);

  const handleLogin = async (data) => {
    setLoading(true);
    const { email, password } = data;
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      await user.getIdToken(true);
      const idTokenResult = await user.getIdTokenResult();
      const role = idTokenResult.claims.role;

      setLoading(false);
      if (role === 'admin') {
        navigate('/add-data');
      } else {
        toast({
          title: 'Unauthorized',
          description: 'You are not authorized to access this page',
          variant: 'destructive',
        })
      }
    } catch (error) {
      console.error('Error logging in:', error);
      toast({
        title: 'Error',
        description: 'Error logging in',
        variant: 'destructive',
      })
    } finally {
      form.reset();
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center  h-[100%] bg-gradient-to-r from-purple-500 to-blue-600 p-6 md:p-1">
      <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-md animate-fadeIn mx-auto">
        <h1 className="text-3xl font-bold text-center text-gray-700 mb-6">Get In</h1>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleLogin)}>
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input
                  type="email"
                  placeholder="Email"
                  className="border border-gray-300 rounded-md focus:ring focus:ring-blue-400"
                  {...form.register("email")}
                />
              </FormControl>
              <FormMessage>{form.formState.errors.email?.message}</FormMessage>
            </FormItem>
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input
                  type="password"
                  autoComplete="off"
                  placeholder="Password"
                  className="border border-gray-300 rounded-md focus:ring focus:ring-blue-400"
                  {...form.register("password")}
                />
              </FormControl>
              <FormMessage>{form.formState.errors.password?.message}</FormMessage>
            </FormItem>
            <Button type="submit" className="mt-4 w-full bg-blue-500 hover:bg-blue-600 transition duration-200" disabled={loading}>
              {loading ? <Loader className="animate-spin" /> : 'Login'}
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default Login;
