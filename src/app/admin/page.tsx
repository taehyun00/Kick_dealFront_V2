'use client'
import styled from "@emotion/styled";

const Mypage = () => {

  const products = Array.from({length:9}).map((_, i) => ({
    id: i + 1,
    name: "아디다스 튜닛 50",
    price: "120,000",
    image: "/svg/shop1.svg" // <-- public 폴더에서 불러올 경우 앞에 '/' 필요
  }));

  return(
    <PageLayout>
      <TitleBox>
        <Title>내가 올린 글</Title>
      </TitleBox>

      <ProductGrid>
        {products.map((product) => (
          <ProductCard key={product.id} onClick={() => {}}>
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

      <TitleBox>
        <Title>내가 구매한 글</Title>
      </TitleBox>

      <ProductGrid>
        {products.map((product) => (
          <ProductCard key={product.id} onClick={() => {}}>
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
    </PageLayout>
  )
}

export default Mypage;

/* ---------- styled components ---------- */

const PageLayout = styled.div`
  width: 100vw;
  display: flex;
  flex-direction: column;
  align-items: center;
  min-height: 100vh;
  background-color: #ffffff;
`;

const Title = styled.h1`
  font-size: 24px;
  font-weight: 700;
  color: #444;
  margin-top : 100px;
`;

const TitleBox = styled.div`
  width : 100%;
  padding : 100px;
`;

const ProductGrid = styled.div`
  display: flex;
  flex-direction: row;
  gap: 16px;
  width: 100%;

  padding: 0px 100px 0px 100px;
  overflow-x: scroll;            
  -webkit-overflow-scrolling: touch; 
  scrollbar-width: thin;  

`;

/* 카드가 축소되지 않도록 flex: 0 0 auto 또는 고정/최소 너비 부여 */
const ProductCard = styled.div`
  background: white;
  border-radius: 12px;
  overflow: hidden;
  cursor: pointer;
  transition: transform 0.1s ease;
  flex: 0 0 220px;      /* <-- 카드 고정 너비(또는 min-width 사용) */

  
  &:hover {
    transform: translateY(-4px);
  }
`;

/* 이미지 영역: 너비는 카드에 맞추고 높이는 고정, 이미지가 잘라지게 cover */
const ProductImage = styled.div`
  width: 100%;
  height: 160px;
  overflow: hidden;
  background-color: #ffffff;
  
  img {
    display: block;      /* 이미지 주변 여백 제거 */
    width: 100%;
    height: 100%;
    object-fit: cover;   /* 이미지 비율 유지하며 잘라서 채움 */
    border-radius: 12px 12px 0 0;
  }
`;

const ProductInfo = styled.div`
  padding: 12px;
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
