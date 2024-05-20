'use client';

import React, { useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";
import {
  TextInput,
  PasswordInput,
  Checkbox,
  Anchor,
  Paper,
  Title,
  Text,
  Container,
  Group,
  Button,
} from '@mantine/core';
import classes from "@/public/css/authentication.module.css";
import { SubmitButton } from "./submit-button";

export default function LoginPage({ searchParams }: { searchParams: { message: string } }) {
  const router = useRouter();
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [isEmailError, setIsEmailError] = useState(false);
  const [isPasswordError, setIsPasswordError] = useState(false);
  const [loginError, setLoginError] = useState('');

  const handleEmailChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const inputEmail = event.currentTarget.value;

    if (!inputEmail) {
      setIsEmailError(true);
      setEmailError('Email is required');
    } else if (!inputEmail.includes('@') || !inputEmail.includes('.')) {
      setIsEmailError(true);
      setEmailError('Alamat email tidak valid');
    } else {
      setIsEmailError(false);
      setEmailError('');
    }
  };

  const handlePasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const inputPassword = event.currentTarget.value;

    if (!inputPassword) {
      setIsPasswordError(true);
      setPasswordError('Password is required');
    } else if (inputPassword.length < 8) {
      setIsPasswordError(true);
      setPasswordError('Password harus 8 karakter atau lebih');
    } else {
      setIsPasswordError(false);
      setPasswordError('');
    }
  }

  const signIn = async (formData: FormData) => {
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    const supabase = createClient();

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setLoginError('Could not authenticate user');
      return;
    }

    router.push('/');
    router.refresh();
  };

  return (
    <div className="flex-1 flex flex-col w-full bg-background-secondary-light px-8 justify-center gap-2 h-screen">
      <Container w={400} my={40}>
        <Title ta="center" className={classes.title}>
          Selamat Datang Kembali!
        </Title>
        <Text c="dimmed" size="sm" ta="center" mt={5}>
          Apakah Kamu sudah memiliki akun?{' '}
          <Anchor size="sm" component="a" href="/register" underline="never">
            Daftar Sekarang!
          </Anchor>
        </Text>
        <Paper withBorder shadow="md" p={30} mt={30} radius="md">
          <form
            className="animate-in flex-1 flex flex-col w-full justify-center gap-2 text-foreground"
          >
            <label className="text-md" htmlFor="email">
              Email
            </label>
            <input
              className="rounded-md px-4 py-2 bg-inherit border"
              name="email"
              placeholder="you@example.com"
              onChange={handleEmailChange}
              required
            />
            {isEmailError && <Text color="red" size="sm">{emailError}</Text>}
            <label className="text-md" htmlFor="password">
              Password
            </label>
            <input
              className="rounded-md px-4 py-2 bg-inherit border"
              type="password"
              name="password"
              placeholder="••••••••"
              onChange={handlePasswordChange}
              required
            />
            {isPasswordError && <Text color="red" size="sm">{passwordError}</Text>}
            <SubmitButton
              className="bg-background-primary w-full font-semibold text-white rounded-md mt-4 px-4 py-2 text-foreground mb-2"
              pendingText="Signing In..."
              formAction={signIn}
            >
              Sign In
            </SubmitButton>
            {loginError && (
              <p className="mt-4 p-4 bg-foreground/10 text-foreground text-center">
                {loginError}
              </p>
            )}
            {searchParams?.message && (
              <p className="mt-4 p-4 bg-foreground/10 text-foreground text-center">
                {searchParams.message}
              </p>
            )}
          </form>
        </Paper>
      </Container>
    </div >
  );
}
