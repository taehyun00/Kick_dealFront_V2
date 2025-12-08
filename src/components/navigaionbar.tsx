import styled from "@emotion/styled"
import { useRouter, usePathname } from "next/navigation";

type Navi = {
    point : number;
} 


const NavigationBar = ({point} : Navi ) => {
    const router = useRouter();
    const pathname = usePathname();

    const isActive = (path : string) => {
        return pathname.includes(path);
    };

    return(
        <NavigationBarLayout>
            <Navitgationbars>
                <Cateogorys>
                    <Category 
                        onClick={() => {router.push("/all")}}
                        isActive={isActive("/all")}
                    >
                        전체상품
                    </Category>
                    <Category 
                        onClick={() => {router.push("/soccershoe")}}
                        isActive={isActive("/soccershoe")}
                    >
                        축구화
                    </Category>
                    <Category 
                        onClick={() => {router.push("/footballshoe")}}
                        isActive={isActive("/footballshoe")}
                    >
                        풋살화
                    </Category>
                    <Category 
                        onClick={() => {router.push("/uniform")}}
                        isActive={isActive("/uniform")}
                    >
                        유니폼
                    </Category>
                    <Category 
                        onClick={() => {router.push("/ball")}}
                        isActive={isActive("/ball")}
                    >
                        축구공
                    </Category>
                    <Category 
                        onClick={() => {router.push("/kids")}}
                        isActive={isActive("/kids")}
                    >
                        유소년
                    </Category>
                    <Category 
                        onClick={() => {router.push("/etc")}}
                        isActive={isActive("/etc")}
                    >
                        기타용품
                    </Category>
                    <Category 
                        onClick={() => {router.push("/goalkepper")}}
                        isActive={isActive("/goalkepper")}
                    >
                        GK용품
                    </Category>
                </Cateogorys>

                <Myact> 
                    <Category 
                        onClick={() => {router.push("/chatlist")}}
                        isActive={isActive("/chatlist")}
                    >
                    채팅
                    </Category> 
                    <Category 
                        onClick={() => {router.push("/upload")}}
                        isActive={isActive("/upload")}
                    >
                        글올리기
                    </Category>

                    <Point onClick={() => {router.push("/points")}}>POINT : {point}</Point>

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

const Category = styled.p<{isActive : boolean}>`
    font-size : 17px;
    color : ${props => props.isActive ? '#ff4757;' : '#BBBBBB'};
    cursor : pointer;
    font-weight : ${props => props.isActive ? '600' : '400'};
    transition: color 0.2s ease;
    
    &:hover {
        color: #888888;
    }
`

const Point = styled.p`
    font-size : 17px;
    color : #BBBBBB;
    cursor : pointer;
    font-weight : '400';
    transition: color 0.2s ease;
    
    &:hover {
        color: #888888;
    }
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
    width : 100%;
    height: 100%;
    min-height : 36px;
    border-bottom : 1px solid #BBBBBB;
    display : flex;
    align-items : center;
    justify-content : center;
`
