### 프로젝트 설명

- 회사에서 elasticsearch를 사용하여 상품 검색 기능을 개발할 예정이라,
  예습 겸 개발한 Nest.js + Docker + Elastic Search를 사용하여 상품 검색 기능 개발

### 실행 방법

- 루트 폴더에 아래 내용의 .env 파일 생성

```
NESTJS_APP_PORT=8200
STACK_VERSION=8.9.2
ELASTIC_HOST=elasticsearch
ELASTIC_PORT=9200
```

- 아래 명령어 실행

```
docker compose up --build --force-recreate
```
