'use client'

import styled from "@emotion/styled";
import React from "react";
import NavigationBar from "./navigaionbar";
import { useRouter } from "next/navigation";
import axios from "axios";
import { useState,useEffect } from 'react';

const Header = () => {

    const router = useRouter();
    const [token, setToken] = useState<string | null>(null);
        const [userInfo, setUserInfo] = useState(null);
        const [loading, setLoading] = useState(false);
        const [error, setError] = useState<string | null>(null);
        const [usename,setusename] = useState("");
        const [serach,setserach] = useState("");


    useEffect(() => {
        const storedToken = localStorage.getItem("token");
        setToken(storedToken);
        router.refresh();
    }, []);

    useEffect(() => {
        if (!token) return;
        const fetchUserInfo = async () => {
            setLoading(true);
            setError(null);
            
            try {
                const response = await axios.get(
                    "https://api.leegunwoo.com/users/info",
                    {
                        headers: {
                            "Authorization": `Bearer ${token}`
                        },
                    }
                );
                
                setUserInfo(response.data);
                setusename(response.data.username);
                localStorage.setItem("name", usename);
                
            } catch (error: any) {
                console.error("사용자 정보 가져오기 실패:", error);
                setError("사용자 정보를 가져오는데 실패했습니다.");
            
                if (error.response?.status === 401) {
                    localStorage.removeItem("token");
                    setToken(null);
                }
            } finally {
                setLoading(false);
            }
        };

        fetchUserInfo();
    }, [token]);


    const logout = () => {
        setToken("");
        setusename("");
        setUserInfo(null);
        localStorage.setItem("token","");
    }

    return(
    <Headers>
    <HeaderLayout>
        <HeaderItem>
        <LogoLayout>
            <Logo src="svg/logo.svg" width={55} onClick={() => router.push('/')}/>
        </LogoLayout>

        <InputLayout type="text" placeholder="상품명을 입력해주세요" onChange={e => {setserach(e.target.value)}} />
        <Searchbutton onClick={() => {router.push(`/search?query=${serach}`)}}>검색</Searchbutton>
        {usename ? (
            <LoginForm>
            <p onClick={() => {logout()}}>로그아웃</p>
            <p>{usename}</p>
        </LoginForm>


        ) :(
         <LoginForm>
            <p onClick={() => {router.push('/signup')}}>회원가입</p>
            <p  onClick={() => {router.push('/login')}}>로그인</p>
        </LoginForm>
        )}

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
        cursor : pointer;
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

const Searchbutton = styled.button`
    border : none;
    background-color : #ff4757;
    cursor : pointer;
    width : 6vw;
    padding : 8px 0px;
    height : 100%;
    border-radius : 20px;
    color : #FFFFFF;
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