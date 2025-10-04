'use client'

import styled from "@emotion/styled";
import Header from "../components/header";
import "../globals.css";
import { useRouter, useParams } from "next/navigation";

export default function ProductDetail() {
  const router = useRouter();
  const params = useParams();

  // 실제로는 params.id를 사용해서 데이터를 가져올 것
  const product = {
    id: params.id,
    name: "아디다스 튜닛 50",
    price: "120,000",
    image: "/svg/shop.svg",
    description: `축구를 사랑하는 매니아로써 제심정 같아선 그냥 드리고 싶지만
현찰 24만원에 일시불로 구입하여서
그냥 드리기엔 너무 적자인거 같고 해서
이렇게 건방지게 딱 반값 12 만원에 올리게 되었습니다.

딱 두번 신었구요 .. 축구화 상태는 최상입니다.
스터드 (일명 뽕)잔디용 풋살용 천연잔디용
이렇게 3가지스터드와 스터드 쪼이는 것 까지 깔끔하게 준비되어있
습니다.

축구화상태는 제가보장하는데 정말 깨끗하구요 ..
사이즈가 270 입니다.`
  };

  const handleContact = () => {
    // 연락하기 기능 구현
    alert("연락하기 기능");
  };

  return (
    <MainLayout>
      <Header />
      
      <ContentWrapper>
        <BreadcrumbNav>
          <BreadcrumbText onClick={() => router.push('/all')}>
            축구화
          </BreadcrumbText>
          <BreadcrumbSeparator>&gt;</BreadcrumbSeparator>
          <BreadcrumbText>아디다스 튜닛50</BreadcrumbText>
        </BreadcrumbNav>

        <ProductDetailContainer>
          <ProductImageSection>
            <ProductMainImage>
              <img src={product.image} alt={product.name} />
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

            <ContactButton onClick={handleContact}>
              연락하기
            </ContactButton>
          </ProductInfoSection>
        </ProductDetailContainer>
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
