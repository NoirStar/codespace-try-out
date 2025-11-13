# 🏃 Endless Runner - 무한 러너 게임

간단하고 재미있는 브라우저 기반 무한 러너 게임입니다!

[게임하러가기](https://NoirStar.github.io/codespace-try-out)

## 🎮 게임 특징

- **간단한 조작**: 스페이스바 또는 클릭으로 점프
- **점점 어려워지는 난이도**: 시간이 지날수록 게임 속도가 증가
- **다양한 장애물**: 선인장, 바위 등 다양한 장애물 회피
- **🌍 전역 리더보드**: 전 세계 플레이어와 순위 경쟁!
- **📱 로컬 리더보드**: 개인 기록 추적
- **최고 점수 저장**: 로컬 스토리지를 활용한 개인 최고 기록 추적
- **반응형 디자인**: 모바일과 데스크톱 모두 지원

## 🚀 로컬에서 실행하기

1. 이 저장소를 클론하거나 파일을 다운로드합니다
2. `index.html` 파일을 브라우저에서 엽니다
3. 게임을 즐기세요!

> **⚠️ 전역 리더보드 설정**: 자신만의 Firebase 프로젝트를 설정하려면 [SETUP.md](SETUP.md) 가이드를 참고하세요. (5분 소요, 무료)

## 🌐 GitHub Pages로 배포하기

### 방법 1: GitHub 웹사이트에서 설정

1. GitHub 저장소로 이동
2. **Settings** 탭 클릭
3. 왼쪽 메뉴에서 **Pages** 클릭
4. **Source** 섹션에서:
   - Branch: `main` 선택
   - Folder: `/ (root)` 선택
5. **Save** 클릭
6. 몇 분 후 `https://NoirStar.github.io/codespace-try-out` 에서 게임 접속 가능

### 방법 2: 명령줄에서 설정

```bash
# 파일 추가 및 커밋
git add .
git commit -m "Add Endless Runner game"

# GitHub에 푸시
git push origin main

# 그 다음 위의 "방법 1"을 따라 GitHub Pages 활성화
```

## 🎯 게임 방법

1. **게임 시작** 버튼을 클릭하여 게임 시작
2. **스페이스바** 또는 **마우스 클릭**으로 점프
3. 장애물을 피하면서 최대한 오래 생존
4. 게임 오버 시 이름을 입력하여 점수 저장
5. 리더보드에서 다른 플레이어들과 순위 경쟁!

## 📁 프로젝트 구조

```
codespace-try-out/
├── index.html      # 메인 HTML 파일
├── game.js         # 게임 로직 (Firebase 연동 포함)
├── style.css       # 스타일시트
├── README.md       # 프로젝트 설명서
└── SETUP.md        # Firebase 설정 가이드
```

## 🛠️ 기술 스택

- **HTML5 Canvas**: 게임 렌더링
- **Vanilla JavaScript**: 게임 로직 및 애니메이션
- **CSS3**: 스타일링 및 반응형 디자인
- **LocalStorage**: 로컬 점수 저장
- **Firebase Realtime Database**: 전역 리더보드 (무료)

## 🎨 커스터마이징

게임을 자신만의 스타일로 커스터마이징하고 싶다면:

- `game.js`에서 게임 속도, 점프력, 장애물 설정 변경
- `style.css`에서 색상 테마 및 디자인 수정
- 새로운 장애물 타입 추가 가능

## 📝 라이선스

이 프로젝트는 자유롭게 사용하실 수 있습니다.

## 🤝 기여

버그 리포트나 기능 제안은 언제든 환영합니다!

---

즐거운 게임 되세요! 🎮✨
