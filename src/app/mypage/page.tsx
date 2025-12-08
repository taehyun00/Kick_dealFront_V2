'use client'

import { useEffect, useState } from 'react'
import styled from '@emotion/styled'
import axios from 'axios'
import { useRouter  } from "next/navigation";

interface Product {
  id: number
  name: string
  description: string
  category: string
  price: number
  seller: string
  status: 'ON_SALE' | 'SOLD' | 'BOUGHT' | string
  url: string
}

interface ProductPage {
  content: Product[]
}

const Mypage = () => {
  const [myProducts, setMyProducts] = useState<Product[]>([])
  const [buyProducts, setBuyProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const router = useRouter()

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
        const res = await axios.get<ProductPage>(
          'https://api.leegunwoo.com/products/my',
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        )



        // res.data.content 는 Product[] (없으면 빈 배열)
        const all = res.data.content ?? []

        // ✅ status 기준 분류
        const mine = all.filter((p) => p.status === 'ON_SALE')
        const bought = all.filter(
          (p) => p.status === 'BOUGHT' || p.status === 'SOLD'
        )

        setMyProducts(mine)
        setBuyProducts(bought)
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
        <Title>내가 올린 글</Title>
      </TitleBox>

      <ProductGrid>
        {myProducts.length === 0 ? (
          <EmptyText>올린 글이 없습니다.</EmptyText>
        ) : (
          myProducts.map((product) => (
            <ProductCard key={product.id} onClick={() => {router.push(`product/${product.id}`)}}>
              <ProductImage>
                <img src={product.url} alt={product.name} />
              </ProductImage>
              <ProductInfo>
                <ProductName>{product.name}</ProductName>
                <ProductPrice>{product.price.toLocaleString()}원</ProductPrice>
              </ProductInfo>
            </ProductCard>
          ))
        )}
      </ProductGrid>

      <TitleBox>
        <Title>내가 구매한 글</Title>
      </TitleBox>

      <ProductGrid>
        {buyProducts.length === 0 ? (
          <EmptyText>구매한 글이 없습니다.</EmptyText>
        ) : (
          buyProducts.map((product) => (
            <ProductCard key={product.id} onClick={() => {router.push(`product/${product.id}`)}}>
              <ProductImage>
                <img src={product.url} alt={product.name} />
              </ProductImage>
              <ProductInfo>
                <ProductName>{product.name}</ProductName>
                <ProductPrice>{product.price.toLocaleString()}원</ProductPrice>
              </ProductInfo>
            </ProductCard>
          ))
        )}
      </ProductGrid>
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
`

const Title = styled.h1`
  font-size: 24px;
  font-weight: 700;
  color: #444;
  margin-top: 100px;
`

const TitleBox = styled.div`
  width: 100%;
  padding: 100px;
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
  border-radius: 12px;
  overflow: hidden;
  cursor: pointer;
  transition: transform 0.1s ease;
  flex: 0 0 220px;

  &:hover {
    transform: translateY(-4px);
  }
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