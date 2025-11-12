import styled from "@emotion/styled"
import { useRouter } from "next/navigation";

const NavigationBar = () => {

    const router = useRouter();

    return(
        <NavigationBarLayout>
            <Navitgationbars>
                <Cateogorys>
                <Category onClick={() => {router.push("/all")}}>전체상품</Category>
                <Category onClick={() => {router.push("/soccershoe")}}>축구화</Category>
                <Category onClick={() => {router.push("/footballshoe")}}>풋살화</Category>
                <Category onClick={() => {router.push("/uniform")}}>유니폼</Category>
                <Category onClick={() => {router.push("/ball")}}>축구공</Category>
                <Category onClick={() => {router.push("/kids")}}>유소년</Category>
                <Category onClick={() => {router.push("/etc")}}>기타용품</Category>
                <Category onClick={() => {router.push("/goalkepper")}}>GK용품</Category>
                </Cateogorys>

                <Myact> 
                <Category onClick={() => {router.push("/upload")}}>글올리기</Category>
                <Category onClick={() => {router.push("/mypage")}}>마이페이지</Category>   
                </Myact>
            </Navitgationbars>
       
        </NavigationBarLayout>
    )
}

export default NavigationBar;

const Myact = styled.div`
    display : flex;
    gap : 80px;
`

const Category = styled.p`
    font-size : 17px;
    color : #BBBBBB;
    cursor : pointer;
`

const Cateogorys = styled.div`
    display : flex;
    gap : 80px;
`

const Navitgationbars = styled.div`
    width : 90%;
    align-items : center;
    justify-content : space-between;
    display : flex;
`

const NavigationBarLayout = styled.div`
    width : 100%:

    height: 100%;
    min-height : 36px;

    border-bottom : 1px solid #BBBBBB;
    display : flex;
    align-items : center;
    justify-content : center;

`