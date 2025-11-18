'use client'

import styled from "@emotion/styled";
import "../globals.css";
import { useRouter } from "next/navigation";
import axios from "axios";
import { useEffect, useState } from "react";

interface Product {
    id: number;
    name: string;
    image : string;
    price : number;
}


export default function ProductList() {

  const router = useRouter();
  const [s,sets] = useState([]);



    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const GetAll = async () => {
            setLoading(true);
            setError(null);
            
            try {
                const response = await axios.get<Product[]>(
                    "https://api.leegunwoo.com/products"
                );
                setProducts(response.data);
                console.log(response);
            } catch (error: any) {
                console.error("데이터 가져오기 실패:", error);
                setError("상품 정보를 가져오는데 실패했습니다.");
            } finally {
                setLoading(false);
            }
        };
        
        GetAll();
    }, []);

  const product = s;

  return (
    <MainLayout>

      
      <ContentWrapper>
        <ProductGrid>
          {products.map((product, index) => (
            <ProductCard key={index} onClick={() => {router.push(`${product.id}`)}}>
              <ProductImage>
                <img src={product.image} alt={product.name} />
              </ProductImage>
              <ProductInfo>
                <ProductName>{product.name}</ProductName>
                <ProductPrice>{product.price}</ProductPrice>
              </ProductInfo>
            </ProductCard>
          ))}
        </ProductGrid>
      </ContentWrapper>
    </MainLayout>
  );
}

const MainLayout = styled.div`
  width: 100vw;
  display: flex;
  flex-direction: column;
  align-items: center;
  min-height: 100vh;
  background-color: #ffffff;
`;

const ContentWrapper = styled.div`
  width: 80%;
  max-width: 100vw;
  padding: 200px 20px;
`;

const ProductGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 50px;
  
  @media (max-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
  }
  
  @media (max-width: 480px) {
    grid-template-columns: 1fr;
  }
`;

const ProductCard = styled.div`
  background: white;
  border-radius: 12px;
  overflow: hidden;
  cursor: pointer;
  transition: transform 0.1s ease;
  
  &:hover {
    transform: translateY(-1px);
  }
`;

const ProductImage = styled.div`
  width: 100%;
  height: 200px;
  overflow: hidden;
  background-color: #ffffff;
  
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    border-radius: 12px 12px 0 0;
  }
`;

const ProductInfo = styled.div`
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const ProductName = styled.h3`
  font-size: 16px;
  font-weight: 800;
  color: #333333;
  margin: 0;
  line-height: 1.3;

  font-family: 'GMarketSans';
  
`;

const ProductPrice = styled.p`
  font-size: 14px;
  font-weight: 600;
  color: #666666;
  margin: 0;
  line-height: 1.2;

  font-family: 'GMarketSans';
`;


