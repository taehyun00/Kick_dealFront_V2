
import styled from "@emotion/styled";

import Header from "../components/header";

export default function Main() {


  return (
    <MainLayout>
      <Header />

      <MainItem>
            <img src="svg/main.svg"  width={800} />
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

                <LoginButton>로그인하기</LoginButton>
            </RightItem>
      </MainItem>
    </MainLayout>
  );
}

const LoginButton = styled.button`

    background-color : #FF234C;
    padding : 10px 40px;
    border-radius : 16px;
    color : white;  
    font-size : 14px;
`


const RightItem = styled.div`
    display : flex;
    flex-direction : column;
    align-items : start;
    gap : 20px;

`
const TextItem = styled.div`
    display : flex;
    flex-direction : column;
    gap : 14px;
`

const UpperText = styled.div`
    display : flex;
    flex-direction : column;
`
const DownText = styled.div`
    display : flex;
    flex-direction : column;
`
const Uppertext = styled.p`
    font-size : 30px;
    font-weight : 900;
    color : #434343;
`

const Downtext = styled.p`
    font-size : 20px;
    font-weight : 300;
    color :#6D6D6D;
`

const MainItem = styled.div`
    padding-top : 80px;
    height : 100vh;

    display : flex;
    align-items : center;
    justify-content : center;
    gap : 180px;
    width : 80%;

`



const MainLayout = styled.div`
    width : 100vw;
    display : flex;
    justify-content : center;

`