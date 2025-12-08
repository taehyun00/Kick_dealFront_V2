'use client'

import styled from "@emotion/styled";
import axios from "axios";

import { useState } from "react";

type Reporttype = {
    id : string

    isopen: boolean;
    setisopen: (isopen: boolean) => void;
    type : string;
}

const Report = ({id , isopen , setisopen,type} : Reporttype) => {
    const token = localStorage.getItem("access-token");
    const [reasons , setreasons] = useState("");

    const [stats , setstats] = useState(0);
    const handleContact =  async () => {
    try {
        if(type == 'product'){
          const response = await  axios.post(
                    `https://api.leegunwoo.com/declarations/products/${id}`,
                    {
                        reason : reasons
                    }, 
                    {
                    headers: {
                      Authorization: `Bearer ${token}`,
                    },
                  }
                ) 
                setstats(response.status);
            }
        else if(type == 'messages'){
            const response = await  axios.post(
                    `https://api.leegunwoo.com/declarations/messages/${id}`,
                    {
                        reason : reasons
                    }, 
                    {
                    headers: {
                      Authorization: `Bearer ${token}`,
                    },
                  }
                ) 
                setstats(response.status);
            }

        
            } catch (error: any) {
                console.error("데이터 가져오기 실패:", error);
                
            } finally {
                
            }
    
            if(stats == 200){
                alert("신고가 완료되었어요!");
                setisopen(false);
            }

            
    };

    const handleReport = () => {
        if(reasons == ""){
            alert("신고내역을 작성해주세요");
        }
        else{
            handleContact();
        }
    }
    

    return(
        <Background>
            <ReportBox>
                <IconBox>
                    <img src="/svg/close.svg" width={16} height={16} onClick={() => {setisopen(false)}}/>
                </IconBox>

                <TextBox>
                    <Title>신고하기</Title>
                </TextBox>

                <ReportForm>
                <TextArea placeholder="이유를 작성해주세요" onChange={(e) => {setreasons(e.target.value)}}>

                </TextArea>

                <ContactButton onClick={() => {handleReport()}}>신고하기</ContactButton>
                </ReportForm>
            </ReportBox>
        </Background>
    )

}

export default Report;


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
    position : fixed;
    top : 0;
    left : 0;
    z-index : 1001;
    background-color : #00000043;
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

const TextArea = styled.textarea`
    border : 1px solid #434343;
    border-radius : 12px;
    resize : none ;
    padding : 12px;
    width : 80%;
    height : 70%;
    outline : none;
    font-family: 'GMarketSans';
`