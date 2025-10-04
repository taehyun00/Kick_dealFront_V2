'use client'

import styled from "@emotion/styled";
import { useState, ChangeEvent } from "react";

interface FormData {
  name: string;
  birthDate: string;
  email: string;
  verificationCode: string;
  password: string;
  confirmPassword: string;
}

interface Agreements {
  all: boolean;
  terms: boolean;
  privacy: boolean;
  location: boolean;
}

type AgreementField = keyof Agreements;

interface SignupFormProps {
  onSubmit?: (data: FormData, agreements: Agreements) => void;
  onNext?: (data: FormData, agreements: Agreements) => void;
}

interface CheckboxProps {
  checked: boolean;
}

interface AgreementTextProps {
  isMain?: boolean;
}

export default function SignupForm({ onSubmit, onNext }: SignupFormProps) {
  const [formData, setFormData] = useState<FormData>({
    name: "",
    birthDate: "",
    email: "",
    verificationCode: "",
    password: "",
    confirmPassword: ""
  });

  const [agreements, setAgreements] = useState<Agreements>({
    all: false,
    terms: false,
    privacy: false,
    location: false
  });

  const [isEmailSent, setIsEmailSent] = useState(false);
  const [isEmailVerified, setIsEmailVerified] = useState(false);
  const [serverCode, setServerCode] = useState(""); // 실제 서버에서는 API 응답값

  // 이메일 입력 변경
  const handleInputChange = (field: keyof FormData, value: string): void => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // 약관 체크
  const handleAgreementChange = (field: AgreementField): void => {
    if (field === "all") {
      const newValue = !agreements.all;
      setAgreements({
        all: newValue,
        terms: newValue,
        privacy: newValue,
        location: newValue
      });
    } else {
      const newAgreements: Agreements = {
        ...agreements,
        [field]: !agreements[field]
      };
      newAgreements.all =
        newAgreements.terms && newAgreements.privacy && newAgreements.location;
      setAgreements(newAgreements);
    }
  };

  // 이메일 인증번호 전송
  const handleSendVerification = (): void => {
    if (!formData.email.trim()) {
      alert("이메일을 입력해주세요.");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      alert("올바른 이메일 형식을 입력해주세요.");
      return;
    }

    // 실제로는 서버 요청 (axios.post("/api/send-code", { email }))
    const generatedCode = Math.floor(100000 + Math.random() * 900000).toString();
    setServerCode(generatedCode);
    setIsEmailSent(true);
    alert(`인증번호가 이메일로 발송되었습니다. (테스트 코드: ${generatedCode})`);
  };

  // 인증번호 확인
  const handleVerifyCode = (): void => {
    if (formData.verificationCode === serverCode) {
      setIsEmailVerified(true);
      alert("이메일 인증이 완료되었습니다!");
    } else {
      alert("인증번호가 올바르지 않습니다.");
    }
  };

  // 회원가입 검증
  const validateForm = (): boolean => {
    if (!formData.name.trim() || !formData.birthDate) {
      alert("이름과 생년월일을 입력해주세요.");
      return false;
    }

    if (!isEmailVerified) {
      alert("이메일 인증을 완료해주세요.");
      return false;
    }

    if (!formData.password || !formData.confirmPassword) {
      alert("비밀번호를 입력해주세요.");
      return false;
    }

    if (formData.password !== formData.confirmPassword) {
      alert("비밀번호가 일치하지 않습니다.");
      return false;
    }

    if (!agreements.terms || !agreements.privacy || !agreements.location) {
      alert("필수 약관에 동의해주세요.");
      return false;
    }

    return true;
  };

  const handleSubmit = (): void => {
    if (!validateForm()) return;

    if (onSubmit) {
      onSubmit(formData, agreements);
    } else {
      console.log("회원가입 데이터:", formData, agreements);
      alert("회원가입이 완료되었습니다!");
    }
  };

  return (
    <SignupContainer>
      <Title>회원가입</Title>

      <FormSection>
        <InputGroup>
          <Label>이름</Label>
          <Input
            type="text"
            value={formData.name}
            onChange={(e) => handleInputChange("name", e.target.value)}
            placeholder="이름을 입력해주세요"
          />
        </InputGroup>

        <InputGroup>
          <Label>생년월일</Label>
          <Input
            type="date"
            value={formData.birthDate}
            onChange={(e) => handleInputChange("birthDate", e.target.value)}
          />
        </InputGroup>

        <InputGroup>
          <Label>이메일</Label>
          <EmailRow>
            <Input
              type="email"
              value={formData.email}
              onChange={(e) => handleInputChange("email", e.target.value)}
              placeholder="이메일을 입력해주세요"
              disabled={isEmailVerified}
            />
            <VerifyButton
              type="button"
              onClick={handleSendVerification}
              disabled={isEmailVerified}
            >
              인증번호 받기
            </VerifyButton>
          </EmailRow>

          {isEmailSent && !isEmailVerified && (
            <EmailVerifyBox>
              <Input
                type="text"
                placeholder="인증번호를 입력해주세요"
                value={formData.verificationCode}
                onChange={(e) =>
                  handleInputChange("verificationCode", e.target.value)
                }
              />
              <VerifyButton type="button" onClick={handleVerifyCode}>
                확인
              </VerifyButton>
            </EmailVerifyBox>
          )}
        </InputGroup>

        {isEmailVerified && (
          <>
            <InputGroup>
              <Label>비밀번호</Label>
              <Input
                type="password"
                placeholder="비밀번호를 입력해주세요"
                value={formData.password}
                onChange={(e) =>
                  handleInputChange("password", e.target.value)
                }
              />
            </InputGroup>

            <InputGroup>
              <Label>비밀번호 확인</Label>
              <Input
                type="password"
                placeholder="비밀번호를 다시 입력해주세요"
                value={formData.confirmPassword}
                onChange={(e) =>
                  handleInputChange("confirmPassword", e.target.value)
                }
              />
            </InputGroup>
          </>
        )}
      </FormSection>

      <AgreementSection>
        <AgreementItem onClick={() => handleAgreementChange("all")}>
          <Checkbox checked={agreements.all}>
            <CheckIcon checked={agreements.all}>✓</CheckIcon>
          </Checkbox>
          <AgreementText isMain>전체동의</AgreementText>
        </AgreementItem>

        <SubAgreementList>
          {["terms", "privacy", "location"].map((key) => (
            <AgreementItem key={key} onClick={() => handleAgreementChange(key as AgreementField)}>
              <Checkbox checked={agreements[key as AgreementField]}>
                <CheckIcon checked={agreements[key as AgreementField]}>✓</CheckIcon>
              </Checkbox>
              <AgreementText>
                {key === "terms"
                  ? "킥딜 이용약관 (필수)"
                  : key === "privacy"
                  ? "개인정보 수집 이용 동의 (필수)"
                  : "위치정보 이용약관 동의 (필수)"}
              </AgreementText>
            </AgreementItem>
          ))}
        </SubAgreementList>
      </AgreementSection>

      <SubmitButton onClick={handleSubmit}>회원가입 완료</SubmitButton>
    </SignupContainer>
  );
}

// 스타일 동일 + 추가
const SignupContainer = styled.div`
  width: 100%;
  max-width: 400px;
  margin: 0 auto;
  padding: 40px 20px;
  background-color: #ffffff;
  font-family: 'GMarketSans';
`;

const Title = styled.h1`
  font-size: 24px;
  font-weight: 700;
  color: #333333;
  text-align: center;
  margin-bottom: 40px;
`;

const FormSection = styled.div`
  margin-bottom: 40px;
`;

const InputGroup = styled.div`
  margin-bottom: 20px;
`;

const Label = styled.label`
  display: block;
  font-size: 14px;
  margin-bottom: 8px;
`;

const Input = styled.input`
  width: 100%;
  height: 46px;
  padding: 0 14px;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 14px;

  &:focus {
    border-color: #ff4757;
    outline: none;
  }
`;

const EmailRow = styled.div`
  display: flex;
  gap: 8px;
`;

const VerifyButton = styled.button`
  background-color: #ff4757;
  color: white;
  font-size: 13px;
  border: none;
  border-radius: 8px;
  padding: 0 12px;
  cursor: pointer;
  transition: 0.2s;

  &:disabled {
    background-color: #ccc;
    cursor: not-allowed;
  }

  &:hover {
    background-color: #ff2d4d;
  }
`;

const EmailVerifyBox = styled.div`
  display: flex;
  gap: 8px;
  margin-top: 10px;
`;

const AgreementSection = styled.div`
  margin-bottom: 40px;
`;

const AgreementItem = styled.div`
  display: flex;
  align-items: center;
  padding: 10px 12px;
  cursor: pointer;
  border-radius: 6px;

  &:hover {
    background-color: #f8f9fa;
  }
`;

const SubAgreementList = styled.div`
  background-color: #f8f9fa;
  border-radius: 6px;
  padding: 8px 0;
  margin-top: 8px;
`;

const Checkbox = styled.div<CheckboxProps>`
  width: 20px;
  height: 20px;
  border: 2px solid ${props => props.checked ? '#ff4757' : '#e0e0e0'};
  background-color: ${props => props.checked ? '#ff4757' : '#fff'};
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 10px;
`;

const CheckIcon = styled.span<CheckboxProps>`
  color: white;
  font-size: 12px;
  opacity: ${props => props.checked ? 1 : 0};
`;

const AgreementText = styled.span<AgreementTextProps>`
  font-size: ${props => props.isMain ? "16px" : "14px"};
  font-weight: ${props => props.isMain ? "600" : "400"};
`;

const SubmitButton = styled.button`
  width: 100%;
  height: 52px;
  background-color: #ff4757;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 18px;
  font-weight: 600;
  cursor: pointer;

  &:hover {
    background-color: #ff2d4d;
  }
`;
