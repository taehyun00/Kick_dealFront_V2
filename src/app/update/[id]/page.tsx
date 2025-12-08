'use client'

import React, { useState, useRef, useEffect } from 'react'
import styled from '@emotion/styled'
import axios from 'axios'
import { useRouter, useParams } from 'next/navigation'

const MAIN_COLOR = '#ff4757'

interface ProductRequest {
  name: string
  description: string
  price: string
  category: string
}

interface Product {
  id: number
  name: string
  url: string
  price: number
  description: string
  category: string
  seller: string
}

const Update: React.FC = () => {
  const [file, setFile] = useState<File | null>(null)
  const [form, setForm] = useState<ProductRequest>({
    name: '',
    description: '',
    price: '',
    category: '',
  })
  const [product, setProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)
  const [preview, setPreview] = useState<string>('')
  
  const params = useParams()
  const id = params.id
  const router = useRouter()
  const imgInput = useRef<HTMLInputElement | null>(null)

  // 기존 상품 데이터 불러오기
  useEffect(() => {
    const fetchProduct = async () => {
      if (!id) return
      
      setLoading(true)
      setError(null)

      try {
        const response = await axios.get<Product>(
          `https://api.leegunwoo.com/products/${id}`
        )
        const productData = response.data
        setProduct(productData)
        
        // 폼에 기존 데이터 채우기
        setForm({
          name: productData.name,
          description: productData.description,
          price: String(productData.price),
          category: productData.category,
        })
        
        // 기존 이미지 미리보기 설정
        if (productData.url) {
          setPreview(productData.url)
        }
        
   
      } catch (error: any) {
        console.error('데이터 가져오기 실패:', error)
        setError('상품 정보를 가져오는데 실패했습니다.')
        alert('상품 정보를 불러올 수 없습니다.')
      } finally {
        setLoading(false)
      }
    }

    fetchProduct()
  }, [id])

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]
    if (!selectedFile) return

    setFile(selectedFile)
    setPreview(URL.createObjectURL(selectedFile))
  }

  const handleUpdate = async () => {
    if (!form.name || !form.price || !form.description || !form.category) {
      alert('모든 필드를 입력해주세요!')
      return
    }

    const token = localStorage.getItem('access-token')
    if (!token) {
      alert('로그인이 필요합니다.')
      router.push('/login')
      return
    }

    try {
      const formData = new FormData()

      const productData = {
        name: form.name,
        description: form.description,
        price: form.price,
        category: form.category,
      }
      
      const blob = new Blob([JSON.stringify(productData)], {
        type: 'application/json',
      })
      formData.append('product', blob)

      // 새 이미지가 선택된 경우에만 추가
      if (file) {
        formData.append('image', file)
      }

 

      // PUT 또는 PATCH 메서드로 수정 요청
      const response = await axios.patch(
        `https://api.leegunwoo.com/products/${id}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data',
          },
        }
      )

      
      alert('수정 완료!')
      router.push(`/product/${id}`)
    } catch (error: any) {
      console.error('수정 실패:', error)
      alert(error.response?.data?.message || '수정에 실패했습니다.')
    }
  }

  if (loading) {
    return (
      <MainLayout>
        <LoadingText>로딩 중...</LoadingText>
      </MainLayout>
    )
  }

  if (error || !product) {
    return (
      <MainLayout>
        <ErrorText>{error || '상품을 찾을 수 없습니다.'}</ErrorText>
      </MainLayout>
    )
  }

  return (
    <MainLayout>
      <Title>상품 수정하기</Title>

      <ContentWrapper>
        <LeftSection>
          <ImageUploadBox>
            <label htmlFor="input_file">
              {preview ? (
                <PreviewBox>
                  <img src={preview} alt="미리보기" />
                </PreviewBox>
              ) : (
                <ImagePlaceholder>
                  <PlusSign>+</PlusSign>
                </ImagePlaceholder>
              )}
            </label>
            <HiddenInput
              id="input_file"
              type="file"
              accept="image/*"
              ref={imgInput}
              onChange={handleImageChange}
            />
          </ImageUploadBox>

          <CategoryArea>
            <CategoryLabel>분류</CategoryLabel>
            <CategoryButtons>
              {[
                ['SOCCER_SHOE', '축구화'],
                ['FOOTBALL_SHOE', '풋살화'],
                ['UNIFORM', '유니폼'],
                ['SOCCER_BALL', '축구공'],
                ['YOUTH', '유소년'],
                ['GITA', '기타용품'],
                ['GOALKEEPER', 'GK용품'],
              ].map(([value, label]) => (
                <CategoryButton
                  key={value}
                  onClick={() =>
                    setForm((prev) => ({ ...prev, category: value }))
                  }
                  active={form.category === value}
                >
                  {label}
                </CategoryButton>
              ))}
            </CategoryButtons>
          </CategoryArea>
        </LeftSection>

        <RightSection>
          <InputGroup>
            <label>상품명</label>
            <Input
              placeholder="상품명을 입력해주세요"
              value={form.name}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, name: e.target.value }))
              }
            />
          </InputGroup>

          <InputGroup>
            <label>가격</label>
            <Input
              type="number"
              placeholder="가격을 입력해주세요"
              value={form.price}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, price: e.target.value }))
              }
            />
          </InputGroup>

          <InputGroup>
            <label>상세정보</label>
            <Textarea
              placeholder="상세정보를 입력해주세요"
              maxLength={250}
              value={form.description}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, description: e.target.value }))
              }
            />
            <CharCount>
              {form.description.length}/250
            </CharCount>
          </InputGroup>

          <ButtonGroup>
            <CancelButton onClick={() => router.back()}>
              취소
            </CancelButton>
            <SubmitButton onClick={handleUpdate}>수정하기</SubmitButton>
          </ButtonGroup>
        </RightSection>
      </ContentWrapper>
    </MainLayout>
  )
}

export default Update

// ---------------- Styled Components ----------------

const MainLayout = styled.div`
  width: 100vw;
  min-height: 100vh;
  background-color: #fff;
  padding: 100px 120px;
  display: flex;
  flex-direction: column;
  color: #333;

  @media (max-width: 1024px) {
    padding: 80px 40px;
  }

  @media (max-width: 768px) {
    padding: 60px 20px;
  }
`

const Title = styled.h1`
  font-size: 24px;
  font-weight: 700;
  margin-bottom: 50px;
  color: #444;
  margin-top: 100px;

  @media (max-width: 768px) {
    font-size: 20px;
    margin-top: 50px;
    margin-bottom: 30px;
  }
`

const ContentWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  width: 100%;
  gap: 60px;

  @media (max-width: 1024px) {
    flex-direction: column;
    align-items: center;
    gap: 40px;
  }
`

const LeftSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 30px;

  @media (max-width: 1024px) {
    width: 100%;
    max-width: 600px;
  }
`

const ImageUploadBox = styled.div`
  width: 600px;
  height: 400px;
  border-radius: 20px;
  overflow: hidden;

  @media (max-width: 768px) {
    width: 100%;
    height: 300px;
  }
`

const ImagePlaceholder = styled.div`
  width: 100%;
  height: 100%;
  background-color: #e5e5e5;
  border-radius: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: background-color 0.2s;

  &:hover {
    background-color: #d5d5d5;
  }
`

const PlusSign = styled.span`
  font-size: 64px;
  color: #fff;
  font-weight: 200;
`

const PreviewBox = styled.div`
  width: 100%;
  height: 100%;
  border-radius: 20px;
  overflow: hidden;
  cursor: pointer;
  position: relative;

  &:hover::after {
    content: '이미지 변경';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
    font-size: 18px;
    font-weight: 600;
  }

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`

const HiddenInput = styled.input`
  display: none;
`

const CategoryArea = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`

const CategoryLabel = styled.p`
  font-weight: 600;
  font-size: 16px;
  color: #333;
`

const CategoryButtons = styled.div`
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
`

const CategoryButton = styled.button<{ active: boolean }>`
  padding: 8px 16px;
  border-radius: 20px;
  border: 1px solid ${({ active }) => (active ? MAIN_COLOR : '#ccc')};
  color: ${({ active }) => (active ? '#fff' : '#555')};
  background-color: ${({ active }) => (active ? MAIN_COLOR : '#fff')};
  cursor: pointer;
  transition: all 0.2s;
  font-size: 14px;

  &:hover {
    border-color: ${MAIN_COLOR};
    color: ${({ active }) => (active ? '#fff' : MAIN_COLOR)};
  }

  outline: none;
`

const RightSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 25px;
  width: 600px;

  @media (max-width: 1024px) {
    width: 100%;
    max-width: 600px;
  }
`

const InputGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  position: relative;

  label {
    font-weight: 600;
    font-size: 15px;
    color: #333;
  }
`

const Input = styled.input`
  padding: 12px;
  border: 1px solid #bbb;
  border-radius: 12px;
  font-size: 15px;
  outline: none;
  transition: border-color 0.2s;

  &:focus {
    border-color: ${MAIN_COLOR};
  }

  &::placeholder {
    color: #aaa;
  }
`

const Textarea = styled.textarea`
  padding: 12px;
  border: 1px solid #bbb;
  border-radius: 12px;
  resize: none;
  height: 150px;
  font-size: 15px;
  outline: none;
  font-family: inherit;
  transition: border-color 0.2s;

  &:focus {
    border-color: ${MAIN_COLOR};
  }

  &::placeholder {
    color: #aaa;
  }
`

const CharCount = styled.span`
  font-size: 12px;
  color: #999;
  text-align: right;
  margin-top: -4px;
`

const ButtonGroup = styled.div`
  display: flex;
  gap: 12px;
  margin-top: 10px;
`

const CancelButton = styled.button`
  flex: 1;
  padding: 12px 0;
  background-color: #fff;
  color: #666;
  border: 1px solid #ddd;
  border-radius: 20px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;

  &:hover {
    background-color: #f5f5f5;
    border-color: #bbb;
  }
`

const SubmitButton = styled.button`
  flex: 2;
  padding: 12px 0;
  background-color: ${MAIN_COLOR};
  color: #fff;
  border: none;
  border-radius: 20px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;

  &:hover {
    opacity: 0.9;
    transform: translateY(-1px);
  }

  &:active {
    transform: translateY(0);
  }
`

const LoadingText = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 400px;
  font-size: 18px;
  color: #666;
`

const ErrorText = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 400px;
  font-size: 18px;
  color: ${MAIN_COLOR};
`
