'use client'

import styled from "@emotion/styled";
import axios from "axios";
import { useState } from "react";


const Points = () => {
    const token = localStorage.getItem("access-token");
    const [reasons , setreasons] = useState(0);

    const [stats , setstats] = useState(0);

    const handleContact =  async () => {

          const response = await  axios.post(
                    `https://api.leegunwoo.com/applies`,
                    {
                        point : reasons
                    }, 
                    {
                    headers: {
                      Authorization: `Bearer ${token}`,
                    },
                  }
                ) 
                alert("충전요청이 전송되었어요!");
                setreasons(0);
                
    }
    
    
    return(
        <Background>
            <ReportBox>
                <TextBox>
                    <Title>포인트 충전</Title>
                </TextBox>

                <ReportForm>
                <TextArea type='number' placeholder="원하는 금액을입력해주세요" value={reasons} onChange={(e) => {setreasons(parseInt(e.target.value))}}>

                </TextArea>

                <ContactButton onClick={() => {handleContact()}}>충전하기</ContactButton>

                <p>계좌 : 1908-5345-00866</p>
                </ReportForm>

                
            </ReportBox>
        </Background>
    )

    }
export default Points;


const ContactButton = styled.button`
  width: 80%;
  height: 50px;
  background-color: #ff4757;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 600;
  font-family: 'GMarketSans';
  cursor: pointer;
  transition: all 0.2s ease;
  margin-top: 20px;

  &:hover {
    background-color: #ff3742;
    transform: translateY(-1px);
  }

  &:active {
    background-color: #e63946;
    transform: translateY(0);
  }

  @media (max-width: 768px) {
    height: 48px;
    font-size: 15px;
  }
`;

const Background = styled.div`
    width : 100vw;
    height : 100vh;
    z-index : 1001;
    display : flex;
    justify-content : center;
    align-items : center;
`

const ReportForm = styled.div`
    width : 100%;
    height : 70%;
    display : flex;
    justify-content : cneter;
    flex-direction : column;
    align-items : center;
    margin-top : 24px;

`

const ReportBox = styled.div`
    width : 30vw;
    height : 60vh;
    background-color : #ffffff;
    border-radius : 12px;
    margin-top : 300px;
`

const IconBox = styled.div`
    width : 100%;
    padding : 36px;
    display : flex;
    justify-content : flex-end;
`

const TextBox = styled.div`
    padding : 0px 36px;
    width : 100%;
    display : flex;
    justify-content : cneter;
    flex-direction : column;
    align-items : center;
`


const Title = styled.p`
    font-size : 1.8vw;
    font-weight : 1000;
    font-family: 'GMarketSans';
`

const TextArea = styled.input`
    border : 1px solid #434343;
    border-radius : 12px;
    resize : none ;
    padding : 12px;
    width : 80%;
    height : 13%;
    outline : none;
    font-family: 'GMarketSans';
`