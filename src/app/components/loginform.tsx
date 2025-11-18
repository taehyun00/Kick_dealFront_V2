'use client';
import axios from "axios";
import styled from "@emotion/styled";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();
  const HanldleLogin = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault(); 
   try {
      const response = await axios.patch(
        "https://api.leegunwoo.com/users",
        {
          email: email,
          password : password
        }
      );
      if (response.data.accessToken) {
        console.log("로그인 성공");
        localStorage.setItem("token",response.data.accessToken);
        localStorage.setItem("refreshtoken",response.data.refreshToken);
        localStorage.setItem("islogin","false ");
        window.location.replace("/")
      }

    } catch (error: any) {
      console.error("인증 실패:", error);
    }
  };



  return (
    <LoginContainer onSubmit={HanldleLogin}>
      <Title>로그인</Title>

      <FormSection>
        <InputGroup>
          <Label>이메일</Label>
          <Input
            type="email"
            placeholder="이메일을 입력해주세요"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </InputGroup>

        <InputGroup>
          <Label>비밀번호</Label>
          <Input
            type="password"
            placeholder="비밀번호를 입력해주세요"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </InputGroup>
      </FormSection>

      <SubmitButton type="submit">로그인</SubmitButton>

      <BottomText>
        계정이 없으신가요? <SignupLink href="/signup">회원가입</SignupLink>
      </BottomText>
    </LoginContainer>
  );
}

// ---------------- 스타일 ----------------

const LoginContainer = styled.form`
  width: 100%;
  max-width: 400px;
  margin: 0 auto;
  padding: 40px 20px;
  background-color: #ffffff;
  font-family: 'GMarketSans';
  display: flex;
  flex-direction: column;
  gap: 24px;
`;

const Title = styled.h1`
  font-size: 24px;
  font-weight: 700;
  color: #333333;
  text-align: center;
  margin-bottom: 20px;
`;

const FormSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const InputGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const Label = styled.label`
  font-size: 14px;
  color: #555555;
`;

const Input = styled.input`
  width: 100%;
  height: 46px;
  padding: 0 14px;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 14px;

  &:focus {
    border-color: #ff4757;
    outline: none;
  }
`;

const SubmitButton = styled.button`
  width: 100%;
  height: 52px;
  background-color: #ff4757;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 18px;
  font-weight: 600;
  cursor: pointer;

  &:hover {
    background-color: #ff2d4d;
  }
`;

const BottomText = styled.p`
  text-align: center;
  font-size: 14px;
  color: #666666;
`;

const SignupLink = styled.a`
  color: #ff4757;
  font-weight: 600;
  text-decoration: none;

  &:hover {
    text-decoration: underline;
  }
`;
