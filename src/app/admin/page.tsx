'use client'

import { useEffect, useState } from 'react'
import styled from '@emotion/styled'
import axios from 'axios'
import { useRouter  } from "next/navigation";
import ChoseOptions from '@/components/modal/ChoseOptions';

interface Product {
  id: number
  title : string
  reason : string
  status : string
  type : string
}



interface Applies {
  id: number
  user : string
  point : number
  status  : string
}



const Mypage = () => {
  const [myProducts, setMyProducts] = useState<Product[]>([])
  const [buyProducts, setBuyProducts] = useState<Applies[]>([])
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const [isopen,setisopen] = useState(false);
  const [isopen_,setisopen_] = useState(false);

  const [reportid,setreportid] = useState(0);
  const [pointid,setpointid] = useState(0);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const token = localStorage.getItem('access-token')
        if (!token) {
          console.warn('토큰 없음')
          setLoading(false)
          return
        }

        // ✅ 내가 관여한 모든 상품 한번에 조회
        const res = await axios.get(
          'https://api.leegunwoo.com/declarations',
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        )

        const res_ = await axios.get(
          'https://api.leegunwoo.com/applies',
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        )



        // res.data.content 는 Product[] (없으면 빈 배열)
        const all = res.data.declarations ?? []
        const all_ = res_.data.applies ?? []
        setMyProducts(all);
        setBuyProducts(all_);


      } catch (e) {
        console.error('마이페이지 상품 불러오기 실패:', e)
        setMyProducts([])
        setBuyProducts([])
      } finally {
        setLoading(false)
      }
    }

    fetchProducts()
  }, [])

  if (loading) {
    return (
      <PageLayout>
        <TitleBox>
          <Title>로딩 중...</Title>
        </TitleBox>
      </PageLayout>
    )
  }

  return (
    <PageLayout>
      <TitleBox>
        <Title>신고내역</Title>
      </TitleBox>

      <ProductGrid>
        {myProducts.length === 0 ? (
          <EmptyText>아무도 신고하지않았어요.</EmptyText>
        ) : (
          myProducts.map((product) => (
            <ProductCard key={product.id} onClick={() => {
              setisopen(true)
              setreportid(product.id);

            }}>
              <ProductInfo>
                <ProductName>{product.title}</ProductName>
                <ProductPrice>{product.reason}</ProductPrice>
              </ProductInfo>
            </ProductCard>
          ))
        )}
      </ProductGrid>

      <TitleBox>
        <Title>포인트 충전 요청</Title>
      </TitleBox>

      <ProductGrid>
        {buyProducts.length === 0 ? (
          <EmptyText>아무도 포인트 충전을 요청하지않았어요.</EmptyText>
        ) : (
          buyProducts.map((product) => (
            <ProductCard key={product.id} onClick={() => {
              setisopen_(true)
              setpointid(product.id);

          
            }}>
              <ProductInfo>
                <ProductName>{product.point.toLocaleString()}원</ProductName>
                <ProductPrice>{product.user}</ProductPrice>
              </ProductInfo>
            </ProductCard>
          ))
        )}
      </ProductGrid>

      {isopen &&
        <ChoseOptions id={reportid} isopen={isopen} setisopen={setisopen} type="report" title='신고 접수 내역' />
      }

      {isopen_ &&
        <ChoseOptions id={pointid} isopen={isopen_} setisopen={setisopen_} type="point" title='포인트 충전 요청' />
      }
    </PageLayout>
  )
}

export default Mypage

/* ---------- styled components ---------- */

const PageLayout = styled.div`
  width: 100vw;
  display: flex;
  flex-direction: column;
  align-items: center;
  min-height: 100vh;
  background-color: #ffffff;
  margin-top : 100px;
`

const Title = styled.h1`
  font-size: 24px;
  font-weight: 700;
  color: #444;
  margin-top: 100px;
`

const TitleBox = styled.div`
  width: 100%;
  padding: 10px 100px;
`

const ProductGrid = styled.div`
  display: flex;
  flex-direction: row;
  gap: 16px;
  width: 100%;
  padding: 0px 100px 0px 100px;
  overflow-x: scroll;
  -webkit-overflow-scrolling: touch;
  scrollbar-width: thin;
`

const EmptyText = styled.div`
  padding: 20px 0;
  color: #999;
  font-size: 14px;
`

const ProductCard = styled.div`
  background: white;
  border : 1px solid black;
  border-radius: 12px;
  overflow: hidden;
  cursor: pointer;
  transition: transform 0.1s ease;
  flex: 0 0 220px;
`

const ProductImage = styled.div`
  width: 100%;
  height: 160px;
  overflow: hidden;
  background-color: #ffffff;

  img {
    display: block;
    width: 100%;
    height: 100%;
    object-fit: cover;
    border-radius: 12px 12px 0 0;
  }
`

const ProductInfo = styled.div`
  padding: 12px;
  display: flex;
  flex-direction: column;
  gap: 4px;
`

const ProductName = styled.h3`
  font-size: 16px;
  font-weight: 800;
  color: #333333;
  margin: 0;
  line-height: 1.3;
  font-family: 'GMarketSans';
`

const ProductPrice = styled.p`
  font-size: 14px;
  font-weight: 600;
  color: #666666;
  margin: 0;
  line-height: 1.2;
  font-family: 'GMarketSans';
`