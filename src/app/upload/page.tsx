'use client'

import styled from "@emotion/styled"

const Upload = () =>{
    return(
        <MainLayout>
            <Title>글올리기</Title>
        
        </MainLayout>
    )
}

export default Upload;

const MainLayout = styled.div`
  width: 100vw;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background-color: #ffffff;
  padding: 150px 20px;
`;

const Title = styled.p`
    font-size : 24px;
    font-weight : 700;
    margin-left : 100px;
`