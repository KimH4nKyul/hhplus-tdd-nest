## ❓ [과제] `point` 패키지의 TODO 와 테스트코드를 작성해주세요.

**요구 사항**

- PATCH `/point/{id}/charge` : 포인트를 충전한다.
- PATCH `/point/{id}/use` : 포인트를 사용한다.
- GET `/point/{id}` : 포인트를 조회한다.
- GET `/point/{id}/histories` : 포인트 내역을 조회한다.
- 잔고가 부족할 경우, 포인트 사용은 실패하여야 합니다.
- <mark style="background: #FF5582A6;">동시에 여러 건의 포인트 충전, 이용 요청이 들어올 경우 순차적으로 처리되어야 합니다.</mark>

---

## 프로젝트 구조 분석

### 기본 정보

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
그리고 `PointController`와 컨트롤러가 사용하는 Table 모듈들을 대상으로 단위 테스트를 작성할 것이다.

---

## 테스트 코드 작성

### PointController가 사용하는 Table 모듈에 대한 테스트

1. 테스트 실행

```bash
# pointhistory.table

npm run test pointhistory

# userpoint.table

npm run test userpoint
```

2. 테스트 목록

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

### PointController 테스트

1. 테스트 실행

```bash
npm run test point.controller
```

2. 테스트 목록

- `point.controller.spec.ts`

```
❌ 포인트를 충전할 수 없음 - 포인트가 0보다 작음
❌ 포인트를 충전할 수 없음 - 올바르지 않은 ID 값
⭕️ 포인트를 충전할 수 있음
❌ 포인트를 사용할 수 없음 - 올바르지 않은 ID 값
❌ 포인트를 사용할 수 없음 - 포인트가 0보다 작음
❌ 포인트를 사용할 수 없음 - 사용할 수 있는 포인트가 없거나 적음
⭕️ 포인트를 사용할 수 있음
❌ 포인트를 조회할 수 없음 - 올바르지 않은 ID 값
⭕️ 포인트를 조회할 수 있음
❌ 포인트 충전/이용 내역을 조회할 수 없음 - 올바르지 않은 ID 값
❌ 포인트 충전/이용 내역을 조회할 수 없음 - 내역이 없음
⭕️ 포인트 충전/이용 내역을 조회할 수 있음
✅ 포인트 충전/이용에 대한 동시 요청을 순차처리 할 수 있음
```

---

## End(1).

> ❓ 동시에 여러 건의 포인트 충전/이용 요청이 들어올 경우 순차적으로 처리되어야 한다.

위 문제에 대해 제대로 이해를 하지 못한거 같다. 생각했던 방안은 (1) 메모리큐를 구현해 동시 요청에 대한 순차 처리와 (2) 사용자가 순차적(충전 > 요청 순서)으로 요청한다고 가정하고 `Promise.all`로 병렬처리 하는 방식을 생각했었다.

테스트는 후자를 택해 작성 했는데, 문제를 제대로 이해하기 위해 멘토님께 여쭤보고 리팩토링을 진행해야 할 거 같다.

### Insight.

> ❗️ 멘토링을 통해 `Node.js`의 비동기 패러다임을 알고, `async-mutex`로 동시성/동기화 문제를 해결할 수 있음을 알게 되었다.

그렇지만 `Mutex`를 활용하면서 요청이 무한히 대기하는 상황을 피하기 위해 타임아웃을 설정했는데, 이를 보통 얼마 정도로 설정을 해야 하는지, 최적화 방안이 있다면 기준이 되는 지표는 무엇인지 알고 싶다.

---

## Plan.

### 리팩토링 계획

- [x] 컨트롤러는 요청을 받아 들이고 응답을 주는 역할만 해야 한다.
- [x] 따라서 컨트롤러에 포함된 프로세스는 모두 서비스 계층으로 옮긴다.
- [x] 서비스 계층은 다시 포인트를 조회하는 역할을 하는 컴포넌트와 업데이트 역할을 하는 컴포넌트로 나눈다.
- [x] 코드를 변경할 때 마다 테스트 코드를 실행해 정상 동작하는 지를 검증한다.
- [x] ~~순차 처리를 위한 메모리 큐를 테스트 코드를 통해 구현한다.~~ ==_메모리큐가 아닌 뮤텍스를 활용_==
- [x] 충분히 테스트 하고 구현이 완료되면 테스트 코드에서 실제 구현을 분리한다.
- [x] 데이터베이스 계층의 경우에는 다른 데이터베이스로 교체할 경우를 위해 의존성을 역전한다.

---

## After.

### 변경된 프로젝트 구조

```
📦src
 ┣ 📂constants
 ┃ ┗ 📜timeout.ts
 ┣ 📂database
 ┃ ┣ 📜database.module.ts
 ┃ ┣ 📜pointhistory.table.spec.ts
 ┃ ┣ 📜pointhistory.table.ts
 ┃ ┣ 📜userpoint.table.spec.ts
 ┃ ┗ 📜userpoint.table.ts
 ┣ 📂point
 ┃ ┣ 📂controller
 ┃ ┃ ┣ 📂dtos
 ┃ ┃ ┃ ┗ 📜point.dto.ts
 ┃ ┃ ┣ 📜point.controller.spec.ts
 ┃ ┃ ┗ 📜point.controller.ts
 ┃ ┣ 📂model
 ┃ ┃ ┗ 📜point.model.ts
 ┃ ┣ 📂repository
 ┃ ┃ ┣ 📜point.memory.repository.ts
 ┃ ┃ ┣ 📜point.repository.spec.ts
 ┃ ┃ ┗ 📜point.repository.ts
 ┃ ┣ 📂service
 ┃ ┃ ┣ 📜point.handler.ts
 ┃ ┃ ┣ 📜point.reader.ts
 ┃ ┃ ┗ 📜point.service.ts
 ┃ ┗ 📜point.module.ts
 ┣ 📜app.module.ts
 ┗ 📜main.ts
```

### 변경된 레이아웃

![](https://i.imgur.com/sqofoBv.png)

---

## End(2).

단위 테스트만 작성하고 제출해서 아쉽다. 하지만 단위 테스트를 통해 TDD를 진행하면서 요구사항을 만족할 수 있었고, 어느정도 TDD에 대한 감을 잡을 수 있는 좋은 기회였다.

이 프로젝트는 통합 테스트, E2E 테스트까지 개인적으로 완료해 볼 생각이다.

이제 2주차 발제 내용을 열심히 듣고, 새로운 과제에 돌입할 차례다!
