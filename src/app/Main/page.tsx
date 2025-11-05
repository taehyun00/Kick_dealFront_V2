'use client'

import styled from "@emotion/styled";

import "../globals.css";
import { useRouter } from "next/navigation";

export default function Main() {
  const router = useRouter();

  const handleLoginClick = () => {
    router.push("/login");
  };

  return (
    <MainLayout>
      <MainItem>
        <LeftItem>
          <img src="svg/main.svg" width={530} height={400} />
        </LeftItem>
        <RightItem>
          <TextItem>
            <UpperText>
              <Uppertext>몇번 안 즐길 축구인데</Uppertext>
              <Uppertext>가격이 부담되신다구요?</Uppertext>
            </UpperText>

            <DownText>
              <Downtext>그럴땐 KickDeal에서 빠르게</Downtext>
              <Downtext>중고거래 해보세요!</Downtext>   
            </DownText>
          </TextItem>

          <LoginButton onClick={() => {handleLoginClick()}}>로그인하기</LoginButton>
        </RightItem>
      </MainItem>
    </MainLayout>
  );
}

const MainLayout = styled.div`
  width: 100vw;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background-color: #ffffff;
`;

const MainItem = styled.div`
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 240px;

  padding-left : 30px;
  margin: 0 auto;
  width: 100%;
`;

const LeftItem = styled.div`
  flex-shrink: 0;
  
  img {
    width: 630px;
    height: 400px;
    object-fit: cover;
    border-radius: 20px;
  }
`;

const RightItem = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 40px;
  flex: 1;
  max-width: 500px;
`;

const TextItem = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
  width: 100%;
`;

const UpperText = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const DownText = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const Uppertext = styled.h1`
  font-size: 38px;
  font-weight: 800;
  color: #2c2c2c;
  line-height: 1.2;
  margin: 0;
  letter-spacing: -0.5px;
`;

const Downtext = styled.p`
  font-size: 24px;
  font-weight: 400;
  color: #666666;
  line-height: 1.4;
  margin: 0;
  letter-spacing: -0.3px;
`;

const LoginButton = styled.button`
  border: none;
  background-color: #FF234C;
  padding: 14px 50px;
  border-radius: 14px;
  color: white;
  font-size: 16px;
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