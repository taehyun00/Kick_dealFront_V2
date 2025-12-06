'use client'

import React, { useState, useRef } from 'react'
import styled from '@emotion/styled'
import axios from 'axios'
import { useRouter } from 'next/navigation'

const MAIN_COLOR = '#ff4757'
const token = localStorage.getItem("access-token") || ""

interface ProductRequest {
  name: string
  description: string
  price: string
  category: string
}

const Save: React.FC = () => {
  const [file, setFile] = useState<File | null>(null)
  const [form, setForm] = useState<ProductRequest>({
    name: '',
    description: '',
    price: '',
    category: '',
  })
  const router = useRouter();
  const [preview, setPreview] = useState<string>('')
  const imgInput = useRef<HTMLInputElement | null>(null)

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]
    if (!selectedFile) return
    
    setFile(selectedFile)
    console.log(selectedFile)
    setPreview(URL.createObjectURL(selectedFile))
  }

  const handleUpload = async () => {
    if (!form.name || !form.price || !form.description || !form.category) {
      alert('모든 필드를 입력해주세요!')
      return
    }
    
    try {
      const formData = new FormData()
      
      const productData = {
        name: form.name,
        description: form.description,
        price: form.price,
        category: form.category
      }
      const blob = new Blob([JSON.stringify(productData)], { type: "application/json" });
      formData.append('product', blob)
      
      if (file) {
        formData.append('image', file)
      }
      console.log(productData)
      const response = await axios.post(
        `https://api.leegunwoo.com/products`,
        formData,
        {
        headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "multipart/form-data",
                },
        }

      )
      console.log(response)
      alert('업로드 성공!')
      router.push('/all');
    } catch (error) {
      console.error(error)
      alert('업로드 실패!')
    }
  }

  return (
    <MainLayout>
      <Title>글올리기</Title>

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
                ['YOUTH','유소년'],
                ['GITA', '기타용품'],
                ['GOALKEEPER', 'GK용품'],
              ].map(([value, label]) => (
                <CategoryButton
                  key={value}
                  onClick={() => setForm((prev) => ({ ...prev, category: value }))}
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
              onChange={(e) => setForm((prev) => ({ ...prev, name: e.target.value }))}
            />
          </InputGroup>

          <InputGroup>
            <label>가격</label>
            <Input
              type="number"
              placeholder="가격을 입력해주세요"
              value={form.price}
              onChange={(e) => setForm((prev) => ({ ...prev, price: e.target.value }))}
            />
          </InputGroup>

          <InputGroup>
            <label>상세정보</label>
            <Textarea
              placeholder="상세정보를 입력해주세요"
              maxLength={250}
              value={form.description}
              onChange={(e) => setForm((prev) => ({ ...prev, description: e.target.value }))}
            />
          </InputGroup>

          <SubmitButton onClick={handleUpload}>글 올리기</SubmitButton>
        </RightSection>
      </ContentWrapper>
    </MainLayout>
  )
}

export default Save
// ---------------- Styled Components ----------------

const MainLayout = styled.div`
  width: 100vw;
  min-height: 100vh;
  background-color: #fff;
  padding: 100px 120px;
  display: flex;
  flex-direction: column;
  color: #333;
`

const Title = styled.h1`
  font-size: 24px;
  font-weight: 700;
  margin-bottom: 50px;
  color: #444;
  margin-top : 100px;
`

const ContentWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width : 100%;
`

const LeftSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 30px;
`

const ImageUploadBox = styled.div`
  width: 600px;
  height: 400px;
  border-radius: 20px;
  overflow: hidden;
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
  transition: 0.2s;
  &:hover {
    border-color: ${MAIN_COLOR};
    color: ${MAIN_COLOR};
  }
  outline : none;
`

const RightSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 25px;
  width: 600px;
`

const InputGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  label {
    font-weight: 600;
  }
`

const Input = styled.input`
  padding: 12px;
  border: 1px solid #bbb;
  border-radius: 12px;
  font-size: 15px;
  outline: none;
  &:focus {
    border-color: ${MAIN_COLOR};
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
  &:focus {
    border-color: ${MAIN_COLOR};
  }
`

const SubmitButton = styled.button`
  margin-top: 10px;
  padding: 12px 0;
  background-color: ${MAIN_COLOR};
  color: #fff;
  border: none;
  border-radius: 20px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: 0.3s;
  &:hover {
    opacity: 0.9;
  }
`