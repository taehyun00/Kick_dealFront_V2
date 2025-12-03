'use client'

import styled from "@emotion/styled";
import "../globals.css";
import { useRouter , useParams } from "next/navigation";
import axios from "axios";
import { useEffect, useState , use  } from "react";
import Category from "@/utils/Category";
import Routercategory from "@/utils/RouterCategory";

interface Product {
    id: number;
    name: string;
    url : string;
    price : number;
    description : string;
    category : string;
    seller : string
}




export default  function ProductDetail() {
  const router = useRouter();
  const params = useParams();
  const id = params.id;

  const token = localStorage.getItem('token')
  const username = localStorage.getItem("name") || "";
  

    const [product, setProduct] = useState<Product>();
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    
    useEffect(() => {
        const GetAll = async () => {
            setLoading(true);
            setError(null);
            
            try {
                const response = await axios.get<Product>(
                    `https://api.leegunwoo.com/products/${id}`
                );
                setProduct(response.data);
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


  

  const handleContact = () => {
    try {
          const response =  axios.post<Product>(
                    `https://api.leegunwoo.com/chatrooms/${id}`,
                    {}, 
                    {
                    headers: {
                      Authorization: `Bearer ${token}`,
                    },
                  }
                );
                console.log(response);
            } catch (error: any) {
                console.error("데이터 가져오기 실패:", error);
                setError("상품 정보를 가져오는데 실패했습니다.");
            } finally {
                setLoading(false);
            }
  };


  const handleModifity = () => {
    router.push(`/update/${id}`);
  };



  return (
    <MainLayout>
      {product && 
      <ContentWrapper>
        <BreadcrumbNav>
          <BreadcrumbText onClick={() => router.push(`${Routercategory(product.category)}`)}>
            {Category(product.category)}
          </BreadcrumbText>
          <BreadcrumbSeparator>&gt;</BreadcrumbSeparator>
          <BreadcrumbText>{product.name}</BreadcrumbText>
        </BreadcrumbNav>

        <ProductDetailContainer>
          <ProductImageSection>
            <ProductMainImage>
              <img src={product.url} alt={product.name} />
            </ProductMainImage>
          </ProductImageSection>

          <ProductInfoSection>
            <ProductCategory>상품명</ProductCategory>
            <ProductTitle>{product.name}</ProductTitle>
            
            <ProductPriceSection>
              <PriceLabel>가격</PriceLabel>
              <PriceValue>{product.price}</PriceValue>
            </ProductPriceSection>

            <ProductDescriptionSection>
              <DescriptionLabel>상세정보</DescriptionLabel>
              <DescriptionText>
                {product.description.split('\n').map((line, index) => (
                  <span key={index}>
                    {line}
                    <br />
                  </span>
                ))}
              </DescriptionText>
            </ProductDescriptionSection>
            {username == product.seller ? (
              <ContactButton onClick={handleModifity}>
                수정하기
              </ContactButton>
            ) : (
              <ContactButton onClick={handleContact}>
              연락하기
              </ContactButton>
            ) }
          </ProductInfoSection>
        </ProductDetailContainer>
      </ContentWrapper>
      }
    
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
  width: 100vw;
  padding: 200px 60px 10px 10px;
  display: flex;
  flex-direction: column;
  max-width: 1400px;
  margin: 0 auto;
`;

const BreadcrumbNav = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 20px;
  font-family: 'GMarketSans';
`;

const BreadcrumbText = styled.span`
  font-size: 13px;
  color: #666666;
  cursor: pointer;
  font-weight: 400;

  &:hover {
    color: #333333;
  }

  &:last-child {
    color: #333333;
    cursor: default;
  }
`;

const BreadcrumbSeparator = styled.span`
  margin: 0 8px;
  color: #999999;
  font-size: 13px;
`;

const ProductDetailContainer = styled.div`
  display: flex;
  width: 100%;
  gap: 60px;
  background-color: #ffffff;
  
  @media (max-width: 968px) {
    flex-direction: column;
    gap: 30px;
  }
`;

const ProductImageSection = styled.div`
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const ProductMainImage = styled.div`
  width: 640px;
  height: 400px;
  border-radius: 16px;
  background-color: #f8f9fa;
  border: 1px solid #e9ecef;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    border-radius: 16px;
  }
  
  @media (max-width: 968px) {
    width: 350px;
    height: 350px;
  }

  @media (max-width: 480px) {
    width: 280px;
    height: 280px;
  }
`;

const ProductInfoSection = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 16px;
  color: #333333;
`;

const ProductCategory = styled.div`
  font-size: 13px;
  font-weight: 500;
  color: #666666;
  font-family: 'GMarketSans';
  margin-bottom: 4px;
`;

const ProductTitle = styled.h1`
  font-size: 28px;
  font-weight: 700;
  color: #333333;
  margin: 0;
  line-height: 1.2;
  font-family: 'GMarketSans';
  margin-bottom: 8px;

  @media (max-width: 768px) {
    font-size: 24px;
  }

  @media (max-width: 480px) {
    font-size: 22px;
  }
`;

const ProductPriceSection = styled.div`
  margin-bottom: 8px;
`;

const PriceLabel = styled.div`
  font-size: 13px;
  font-weight: 500;
  color: #666666;
  font-family: 'GMarketSans';
  margin-bottom: 6px;
`;

const PriceValue = styled.div`
  font-size: 24px;
  font-weight: 700;
  color: #333333;
  font-family: 'GMarketSans';

  @media (max-width: 768px) {
    font-size: 22px;
  }
`;

const ProductDescriptionSection = styled.div`
  margin-bottom: 16px;
`;

const DescriptionLabel = styled.div`
  font-size: 13px;
  font-weight: 500;
  color: #666666;
  font-family: 'GMarketSans';
  margin-bottom: 10px;
`;

const DescriptionText = styled.div`
  font-size: 13px;
  font-weight: 400;
  color: #333333;
  line-height: 1.5;
  font-family: 'GMarketSans';
  white-space: pre-line;
`;

const ContactButton = styled.button`
  width: 100%;
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
