"use client";

import styled from "@emotion/styled";
import { useState } from "react";

export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e : any) => {
    e.preventDefault();

    // 로그인 로직 (API 연동 부분)
    console.log("로그인 시도:", { email, password });
  };

  return (
    <FormContainer onSubmit={handleSubmit}>
      <Title>로그인</Title>

      <InputBox>
        <Label>이메일</Label>
        <Input
          type="email"
          placeholder="이메일을 입력하세요"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </InputBox>

      <InputBox>
        <Label>비밀번호</Label>
        <Input
          type="password"
          placeholder="비밀번호를 입력하세요"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
      </InputBox>

      <LoginButton type="submit">로그인</LoginButton>

      <BottomText>
        계정이 없으신가요? <SignupLink href="/signup">회원가입</SignupLink>
      </BottomText>
    </FormContainer>
  );
}

const FormContainer = styled.form`
  display: flex;
  flex-direction: column;
  gap: 24px;
  width: 380px;
  background-color: #ffffff;
  padding: 40px 48px;
  border-radius: 16px;
  box-shadow: 0 4px 20px rgba(0,0,0,0.08);
`;

const Title = styled.h2`
  font-size: 28px;
  font-weight: 700;
  color: #2c2c2c;
  margin-bottom: 8px;
  text-align: center;
`;

const InputBox = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const Label = styled.label`
  font-size: 15px;
  font-weight: 500;
  color: #555555;
`;

const Input = styled.input`
  padding: 12px 14px;
  font-size: 16px;
  border: 1.5px solid #cccccc;
  border-radius: 10px;
  outline: none;
  transition: all 0.2s ease;

  &:focus {
    border-color: #ff234c;
    box-shadow: 0 0 0 2px rgba(255,35,76,0.15);
  }
`;

const LoginButton = styled.button`
  border: none;
  background-color: #ff234c;
  padding: 14px 0;
  border-radius: 12px;
  color: white;
  font-size: 17px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background-color: #e01e3f;
    transform: translateY(-1px);
  }

  &:active {
    transform: translateY(0);
  }
`;

const BottomText = styled.p`
  text-align: center;
  font-size: 14px;
  color: #666666;
`;

const SignupLink = styled.a`
  color: #ff234c;
  font-weight: 600;
  text-decoration: none;

  &:hover {
    text-decoration: underline;
  }
`;
