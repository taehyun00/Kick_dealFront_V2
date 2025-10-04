'use client'

import styled from "@emotion/styled";
import React from "react";
import NavigationBar from "./navigaionbar";
import { useRouter } from "next/navigation";


const Header = () => {

    const router = useRouter();

    return(
    <Headers>
    <HeaderLayout>
        <HeaderItem>
        <LogoLayout>
            <Logo src="svg/logo.svg" width={55} onClick={() => router.push('/')}/>
        </LogoLayout>

        <InputLayout type="text" placeholder="상품명을 입력해주세요" />

        <LoginForm>
            <p onClick={() => {router.push('/signup')}}>회원가입</p>
            <p  onClick={() => {router.push('/login')}}>로그인</p>
        </LoginForm>

        </HeaderItem>
    </HeaderLayout>
    <NavigationBar />
    </Headers>
    )

}

const Headers = styled.div`
    display : flex;
    width : 100%;
    flex-direction : column;
    position : fixed;
    background-color : #FFFFFF;
    top : 0px;
    z-index : 1000;
`

const LoginForm = styled.div`
    display : flex;
    gap : 60px;
`

const InputLayout = styled.input`
    border : 1px solid #BBBBBB;
    border-radius : 20px;
    width : 70%;
    padding : 8px 12px;
    outline : none;
`

const LogoLayout = styled.div`

`

const Logo = styled.img`
    max-width : 100%;
    height : auto;
`

const HeaderItem = styled.div`
    width : 90%;
    display : flex;

    align-items : center;
    justify-content : space-between;
`


const HeaderLayout = styled.div`
    width : 100%;

    height: 100%;
    min-height : 80px;
    display : flex;

    align-items : center;
    justify-content : center;

    border-bottom : 1px solid #BBBBBB;
`

export default Header;