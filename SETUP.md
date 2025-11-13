# 🔧 Firebase 설정 가이드 (전역 리더보드)

현재 게임은 **임시 Firebase URL**을 사용하고 있습니다. 실제 배포를 위해서는 자신만의 Firebase 프로젝트를 만들어야 합니다.

## 🚀 Firebase 무료 설정하기 (5분 소요)

### 1단계: Firebase 프로젝트 생성

1. [Firebase Console](https://console.firebase.google.com/) 접속
2. **프로젝트 추가** 클릭
3. 프로젝트 이름 입력 (예: `endless-runner`)
4. Google Analytics는 **선택 사항** (끄셔도 됩니다)
5. **프로젝트 만들기** 클릭

### 2단계: Realtime Database 활성화

1. 왼쪽 메뉴에서 **빌드** → **Realtime Database** 클릭
2. **데이터베이스 만들기** 클릭
3. 위치 선택: **asia-southeast1** (싱가포르) 권장
4. 보안 규칙: **테스트 모드로 시작** 선택
5. **사용 설정** 클릭

### 3단계: 데이터베이스 URL 복사

데이터베이스가 생성되면 URL이 표시됩니다:
```
https://your-project-id-default-rtdb.asia-southeast1.firebasedatabase.app
```

### 4단계: 게임 코드 수정

`game.js` 파일의 6번째 줄을 찾아서 URL을 변경하세요:

```javascript
// 변경 전:
const FIREBASE_URL = 'https://endless-runner-default-rtdb.firebaseio.com';

// 변경 후:
const FIREBASE_URL = 'https://your-project-id-default-rtdb.asia-southeast1.firebasedatabase.app';
```

### 5단계: 보안 규칙 설정 (중요!)

Firebase Console에서 **Realtime Database** → **규칙** 탭으로 이동:

```json
{
  "rules": {
    "leaderboard": {
      ".read": true,
      ".write": true,
      "$entry": {
        ".validate": "newData.hasChildren(['name', 'score', 'date', 'timestamp']) && newData.child('name').isString() && newData.child('score').isNumber() && newData.child('name').val().length <= 10"
      }
    }
  }
}
```

**게시** 버튼을 클릭하여 저장합니다.

## 💰 비용 안내

Firebase Realtime Database 무료 플랜:
- ✅ 저장 공간: 1GB
- ✅ 동시 연결: 100개
- ✅ 다운로드: 10GB/월

일반적인 게임 사용량으로는 **완전 무료**입니다! 🎉

## 🔒 보안 강화 (선택사항)

더 안전한 규칙 (읽기는 누구나, 쓰기는 제한):

```json
{
  "rules": {
    "leaderboard": {
      ".read": true,
      ".write": "!data.exists() || (newData.exists() && newData.child('score').val() <= 10000)",
      "$entry": {
        ".validate": "newData.hasChildren(['name', 'score', 'date', 'timestamp']) && newData.child('name').isString() && newData.child('score').isNumber() && newData.child('name').val().length <= 10 && newData.child('score').val() >= 0"
      }
    }
  }
}
```

## ❓ 문제 해결

### CORS 에러 발생 시
Firebase는 자동으로 CORS를 허용하므로 문제가 없어야 합니다. 만약 에러가 발생하면:
1. Firebase Console에서 데이터베이스 URL이 정확한지 확인
2. 브라우저 캐시 삭제 후 새로고침

### 점수가 저장되지 않을 때
1. 브라우저 개발자 도구 (F12) → Console 탭에서 에러 확인
2. Firebase Console → Realtime Database에서 데이터가 보이는지 확인
3. 보안 규칙이 올바르게 설정되었는지 확인

## 🎮 로컬 전용 모드

Firebase 설정이 필요 없이 로컬에서만 사용하려면:

`game.js`에서 Firebase URL을 빈 문자열로 설정:
```javascript
const FIREBASE_URL = '';
```

이렇게 하면 로컬 스토리지만 사용합니다.

---

설정이 완료되면 게임을 배포하고 전 세계 플레이어들과 순위를 겨루세요! 🌍🏆
