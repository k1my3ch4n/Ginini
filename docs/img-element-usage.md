# `<img>` vs `next/image` 사용 기준

Next.js는 `<img>` 태그 대신 `<Image />` (`next/image`) 사용을 권장합니다.  
그러나 아래 경우에는 기술적인 이유로 `<img>`를 의도적으로 사용합니다.

---

## 예외 목록

### 1. `src/features/image-upload/ui/ImageCropModal.tsx`

**이유:** `react-image-crop`이 내부적으로 `<img>` DOM 요소의 ref에 직접 접근합니다.  
크롭 완료 시 `image.naturalWidth / image.width` 비율로 캔버스 좌표를 계산하는데, `next/image`는 실제 `<img>`를 래퍼 div 안에 숨겨 렌더링하므로 ref가 제대로 동작하지 않습니다.

```tsx
// react-image-crop은 아래 ref로 naturalWidth, naturalHeight를 읽음
const imgRef = useRef<HTMLImageElement>(null);
<ReactCrop ...>
  <img ref={imgRef} src={uploadedImage} ... />
</ReactCrop>
```

---

### 2. `src/features/image-upload/ui/ImagePreview.tsx`

**이유:** 크롭 결과물은 `URL.createObjectURL(blob)`으로 생성된 `blob:` URL입니다.  
`next/image`는 `blob:` URL을 지원하지 않습니다 (외부 도메인 whitelist 또는 정적 경로만 처리 가능).

```tsx
const previewURL = URL.createObjectURL(croppedImage); // "blob:http://..."
<img src={previewURL} ... /> // next/image로 대체 불가
```

---

## 새로운 예외를 추가할 때

`<img>`를 사용해야 하는 새로운 사례가 생기면 이 문서에 추가하고,  
해당 파일에 인라인 주석도 함께 작성합니다.

```tsx
{/* eslint-disable-next-line @next/next/no-img-element -- <이유 한 줄 요약> */}
<img ... />
```
