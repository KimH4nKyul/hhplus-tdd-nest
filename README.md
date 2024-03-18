### ❓ [과제] `point` 패키지의 TODO 와 테스트코드를 작성해주세요.

**요구 사항**

- PATCH `/point/{id}/charge` : 포인트를 충전한다.
- PATCH `/point/{id}/use` : 포인트를 사용한다.
- GET `/point/{id}` : 포인트를 조회한다.
- GET `/point/{id}/histories` : 포인트 내역을 조회한다.
- 잔고가 부족할 경우, 포인트 사용은 실패하여야 합니다.
- <mark style="background: #FF5582A6;">동시에 여러 건의 포인트 충전, 이용 요청이 들어올 경우 순차적으로 처리되어야 합니다.</mark>

---

### 프로젝트 구조 분석

#### 기본 정보

```text
📦src
 ┣ 📂database
 ┃ ┣ 📜database.module.ts
 ┃ ┣ 📜pointhistory.table.ts
 ┃ ┗ 📜userpoint.table.ts
 ┣ 📂point
 ┃ ┣ 📜point.controller.ts
 ┃ ┣ 📜point.dto.ts
 ┃ ┣ 📜point.model.ts
 ┃ ┗ 📜point.module.ts
 ┣ 📜app.controller.spec.ts
 ┣ 📜app.controller.ts
 ┣ 📜app.module.ts
 ┣ 📜app.service.ts
 ┗ 📜main.ts
```

시작 프로젝트 디렉토리 구조는 위와 같이 `point`와 `database`이다.
여기서 `database` 디렉토리의 `*.table.ts`들은 변경되어선 안되며, 공개 API를 사용해 기능을 검증해야 한다.

![](https://i.imgur.com/AnSKQMk.png)

다이어그램을 확인해 보면, `PointController`를 대상으로 테스트 스위트를 만들어 TDD를 진행해야 한다.
그리고 `PointController`가 사용하는 Table 모듈들을 대상으로 단위 테스트를 작성한다.

---

### 테스트 코드 작성

#### PointController가 사용하는 Table 모듈에 대한 테스트

##### 테스트 실행

```bash
# pointhistory.table
npm run test pointhistory

# userpoint.table
npm run test userpoint
```

##### 테스트 목록

- `userpoint.table.ts`

```
❌ 유저 포인트 테이블에서 포인트를 가져올 수 없음 - 올바르지 않은 ID 값
⭕️ 유저 포인트 테이블에 입력할 수 있음
⭕️ 유저 포인트 테이블에 업데이트할 수 있음
⭕️ 유저 포인트 테이블에서 포인트를 가져올 수 있음
```

- `pointhistory.table.spec.ts`

```
⭕️ 포인트 히스토리 테이블에 입력할 수 있음
⭕️ 포인트 히스토리 테이블에서 히스토리를 가져올 수 있음
```
