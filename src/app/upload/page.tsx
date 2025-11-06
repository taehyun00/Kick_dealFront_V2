'use client'

import React, { useState, useRef } from 'react'
import styled from '@emotion/styled'

interface ProductRequest {
  name: string
  description: string
  price: string
  category: string
  imageFile: File | null
}

const Save: React.FC = () => {
  const [form, setForm] = useState<ProductRequest>({
    name: '',
    description: '',
    price: '',
    category: '',
    imageFile: null,
  })

  const [preview, setPreview] = useState<string>('')
  const imgInput = useRef<HTMLInputElement | null>(null)

  /** 📸 이미지 업로드 및 미리보기 */
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setForm((prev) => ({ ...prev, imageFile: file }))
    setPreview(URL.createObjectURL(file))
  }

  /** 🧾 업로드 버튼 클릭 시 콘솔 출력 (API 연결 전 테스트용) */
  const handleUpload = () => {
    if (!form.imageFile || !form.name || !form.price || !form.description || !form.category) {
      alert('모든 필드를 입력해주세요!')
      return
    }

    console.log('등록할 상품 데이터:', form)
    alert('테스트용: 상품 데이터 콘솔에 출력됨 ✅')
  }

  return (
    <MainLayout>
      <Title>글올리기</Title>

      {/* 이미지 업로드 섹션 */}
      <ImageUploadBox>
        <label htmlFor="input_file">
          {preview ? (
            <PreviewBox>
              <img src={preview} alt="미리보기" />
            </PreviewBox>
          ) : (
            <ImagePlaceholder>
              이미지 업로드
              <p>박스를 클릭해주세요!</p>
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

      {/* 카테고리 버튼 */}
      <CategorySection>
        {[
          ['soccerShoes', '축구화'],
          ['futsalShoes', '풋살화'],
          ['uniform', '유니폼'],
          ['ball', '축구공'],
          ['other', '기타용품'],
          ['goalkeeper', 'GK용품'],
        ].map(([value, label]) => (
          <CategoryButton
            key={value}
            onClick={() => setForm((prev) => ({ ...prev, category: value }))}
            active={form.category === value}
          >
            {label}
          </CategoryButton>
        ))}
      </CategorySection>

      {/* 입력 폼 */}
      <FormSection>
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
          <label>세부사항</label>
          <Textarea
            placeholder="세부사항을 입력해주세요 (최대 250자)"
            maxLength={250}
            value={form.description}
            onChange={(e) => setForm((prev) => ({ ...prev, description: e.target.value }))}
          />
        </InputGroup>
      </FormSection>

      {/* 등록 버튼 */}
      <ButtonSection>
        <SubmitButton onClick={handleUpload}>글 올리기</SubmitButton>
      </ButtonSection>
    </MainLayout>
  )
}

export default Save

// ---------------- Styled Components ----------------

const MainLayout = styled.div`
  width: 100vw;
  min-height: 100vh;
  background-color: #fff;
  padding: 150px 20px;
  display: flex;
  flex-direction: column;
  gap: 30px;
`

const Title = styled.h1`
  font-size: 24px;
  font-weight: 700;
`

const ImageUploadBox = styled.div`
  width: 600px;
  height: 400px;
`

const ImagePlaceholder = styled.div`
  width: 100%;
  height: 100%;
  border: 2px dashed #999;
  border-radius: 10px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: #666;
  cursor: pointer;
  p {
    font-size: 14px;
    color: #aaa;
  }
`

const PreviewBox = styled.div`
  width: 100%;
  height: 100%;
  border-radius: 10px;
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

const CategorySection = styled.div`
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
`

const CategoryButton = styled.button<{ active: boolean }>`
  padding: 8px 16px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  background-color: ${({ active }) => (active ? '#007aff' : '#ddd')};
  color: ${({ active }) => (active ? '#fff' : '#333')};
  transition: 0.2s;
  &:hover {
    opacity: 0.8;
  }
`

const FormSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
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
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 6px;
`

const Textarea = styled.textarea`
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 6px;
  resize: none;
  height: 150px;
`

const ButtonSection = styled.div`
  margin-top: 30px;
`

const SubmitButton = styled.button`
  background-color: #007aff;
  color: #fff;
  border: none;
  padding: 12px 40px;
  font-size: 16px;
  border-radius: 8px;
  cursor: pointer;
  &:hover {
    opacity: 0.9;
  }
`