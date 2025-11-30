# NestJS Boilerplate

NestJS 기반의 백엔드 API 서버 보일러플레이트입니다.

## 🚀 기술 스택

- **Framework**: NestJS
- **Database**: MySQL (TypeORM)
- **Authentication**: JWT
- **Validation**: class-validator, class-transformer
- **Testing**: Jest
- **Linting**: ESLint + Prettier

## 📋 사전 요구사항

- Node.js (v18 이상)
- Yarn
- MySQL

## 🛠️ 설치 및 실행

### 1. 의존성 설치

```bash
yarn install
```

### 2. 환경 변수 설정

프로젝트 루트에 `.env` 파일을 생성하고 다음 환경 변수들을 설정하세요:

```env
# 서버 포트
PORT=8080

# 데이터베이스 설정
DB_HOST=localhost
DB_PORT=3306
DB_USERNAME=root
DB_PASSWORD=your_password
DB_DATABASE=nest_boilerplate

# JWT 시크릿 키
JWT_SECRET=your_jwt_secret_key
```

### 3. 데이터베이스 설정

MySQL에서 데이터베이스를 생성하세요:

```sql
CREATE DATABASE nest_boilerplate;
```

### 4. 개발 서버 실행

```bash
# 개발 모드로 실행 (파일 변경 시 자동 재시작)
yarn start:dev

# 또는 일반 모드로 실행
yarn start
```

서버가 성공적으로 실행되면 `http://localhost:8080`에서 API에 접근할 수 있습니다.

## 📁 프로젝트 구조

```
src/
├── common/                 # 공통 모듈
│   ├── const/             # 상수 정의
│   ├── decorator/         # 커스텀 데코레이터
│   ├── entities/          # 기본 엔티티
│   ├── exception-filter/  # 예외 필터
│   ├── interceptor/       # 인터셉터
│   └── middleware/        # 미들웨어
├── modules/               # 기능별 모듈
│   ├── auth/             # 인증 모듈
│   ├── member/           # 회원 모듈
│   └── sample/           # 샘플 모듈
├── app.module.ts         # 메인 앱 모듈
└── main.ts              # 애플리케이션 진입점
```

## 🔧 사용 가능한 스크립트

```bash
# 개발 서버 실행 (파일 변경 시 자동 재시작)
yarn start:dev

# 디버그 모드로 실행
yarn start:debug

# 프로덕션 빌드
yarn build

# 프로덕션 서버 실행
yarn start:prod

# 테스트 실행
yarn test

# 테스트 커버리지 확인
yarn test:cov

# E2E 테스트 실행
yarn test:e2e

# 코드 린팅
yarn lint

# 코드 포맷팅
yarn format
```

## 🌐 API 엔드포인트

기본적으로 모든 API는 `/api` prefix를 사용합니다.

### 인증 관련

- `POST /api/v1/auth/signup` - 회원가입
- `POST /api/v1/auth/login` - 로그인

### 회원 관련

- `GET /api/v1/member/profile` - 프로필 조회 (인증 필요)

### 샘플

- `GET /api/v1/sample` - 샘플 데이터 조회

## 🔐 인증

JWT 기반 인증을 사용합니다. 인증이 필요한 엔드포인트에는 `Authorization: Bearer <token>` 헤더를 포함해야 합니다.

## 🗄️ 데이터베이스

TypeORM을 사용하여 MySQL과 연동됩니다. 엔티티는 `src/modules/*/entities/` 디렉토리에 정의되어 있습니다.

## 📦 Response & Error Handling

프로젝트에는 일관된 API 응답 형식을 제공하는 통합 시스템이 포함되어 있습니다.

### 응답 형식

모든 API 응답은 다음 형식을 따릅니다:

**성공 응답:**

```json
{
  "success": true,
  "statusCode": 200,
  "message": "요청이 성공적으로 처리되었습니다.",
  "data": { ... },
  "timestamp": "2024-01-01T00:00:00.000Z",
  "path": "/api/v1/member"
}
```

**에러 응답:**

```json
{
  "success": false,
  "statusCode": 400,
  "message": "잘못된 요청입니다.",
  "timestamp": "2024-01-01T00:00:00.000Z",
  "path": "/api/v1/member",
  "error": "Bad Request"
}
```

### 사용 방법

#### 1. 기본 사용 (자동 변환)

컨트롤러에서 데이터만 반환하면 자동으로 공통 응답 형식으로 변환됩니다:

```typescript
@Controller({ version: '1', path: 'member' })
export class MemberController {
  @Get()
  async getMember() {
    // 데이터만 반환하면 자동으로 SuccessResponseDto로 래핑됨
    return { id: 1, name: 'John' };
  }
}
```

#### 2. 커스텀 메시지 사용

`@ApiResponseMessage` 데코레이터를 사용하여 커스텀 메시지를 설정할 수 있습니다:

```typescript
@Get()
@ApiResponseMessage('회원 정보를 성공적으로 조회했습니다.')
async getMember() {
  return { id: 1, name: 'John' };
}
```

#### 3. 수동으로 응답 생성

필요한 경우 헬퍼 함수를 사용하여 직접 응답을 생성할 수 있습니다:

```typescript
import { createSuccessResponse } from 'src/common/utils/response.util';

@Get()
async getMember(@Req() request: Request) {
  const data = { id: 1, name: 'John' };
  return createSuccessResponse(
    200,
    '회원 정보를 성공적으로 조회했습니다.',
    data,
    request.url,
  );
}
```

#### 4. 에러 처리

예외는 자동으로 공통 에러 응답 형식으로 변환됩니다:

```typescript
@Post()
async createMember(@Body() dto: CreateMemberDto) {
  // NestJS 예외를 던지면 자동으로 ErrorResponseDto로 변환됨
  if (duplicate) {
    throw new ConflictException('이미 존재하는 회원입니다.');
  }

  return this.memberService.create(dto);
}
```

### 주요 파일

- `src/common/dto/response.dto.ts` - 응답 DTO 정의
- `src/common/interceptor/response.interceptor.ts` - 성공 응답 인터셉터
- `src/common/exception-filter/http.exception-filter.ts` - HTTP 예외 필터
- `src/common/exception-filter/all-exceptions.filter.ts` - 모든 예외 필터
- `src/common/decorator/api-response.decorator.ts` - 커스텀 메시지 데코레이터
- `src/common/utils/response.util.ts` - 응답 생성 헬퍼 함수

## 🧪 테스트

```bash
# 단위 테스트 실행
yarn test

# 테스트 커버리지 확인
yarn test:cov

# E2E 테스트 실행
yarn test:e2e
```

## 📝 개발 가이드

### 새로운 모듈 추가

1. `src/modules/` 디렉토리에 새 모듈 폴더 생성
2. 모듈, 컨트롤러, 서비스 파일 생성
3. `app.module.ts`에 새 모듈 import

### 엔티티 추가

1. `src/modules/*/entities/` 디렉토리에 엔티티 파일 생성
2. TypeORM 데코레이터 사용하여 엔티티 정의
3. 해당 모듈의 서비스에서 TypeORM 리포지토리 주입

## 🚀 배포

```bash
# 프로덕션 빌드
yarn build

# 프로덕션 서버 실행
yarn start:prod
```

## 📄 라이선스

이 프로젝트는 개인 사용을 위한 보일러플레이트입니다.
