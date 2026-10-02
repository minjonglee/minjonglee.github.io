# Min Jong Lee — academic website

Site: <https://minjonglee.github.io/> · Repository: <https://github.com/minjonglee/minjonglee.github.io>

현재 디자인은 HTML/CSS/JavaScript 정적 사이트입니다. 내용은 `content/`의 JSON에서 읽어 빌드합니다. [Pages CMS](https://pagescms.org/) 편집 화면은 저장소 루트의 `.pages.yml`을 사용합니다. 별도 npm 패키지나 웹 프레임워크는 필요하지 않습니다.

## Pages CMS에서 편집하기

1. <https://app.pagescms.org/>에서 GitHub 계정으로 로그인하고 `minjonglee/minjonglee.github.io` 저장소에 Pages CMS GitHub App 접근을 허용합니다.
2. 편집할 저장소와 `main` 브랜치를 선택합니다. 저장소가 보이지 않으면 GitHub App의 Repository access 설정에서 이 저장소를 추가합니다.
3. 왼쪽 메뉴에서 항목을 열어 수정하거나 **New**를 눌러 추가하고 **Save**합니다. Pages CMS가 JSON 변경사항을 GitHub에 커밋합니다.
4. 저장소의 **Actions → Build and deploy GitHub Pages**가 성공하면 공개 사이트를 새로고침합니다. 배포까지 수 분 걸릴 수 있습니다.

| 수정할 내용 | CMS 메뉴 | 저장 위치 |
|---|---|---|
| 첫 화면 제목·문구·버튼·섹션 이름 | Home & profile → Home page | `content/pages/home.json` |
| 이름·직함·사진·학력·이메일·CV·Scholar 등 | Home & profile → Profile & contact | `content/profile.json` |
| 상단 메뉴·푸터·SEO·공유 이미지 | Home & profile → Site settings, menu & footer | `content/site.json` |
| 연구 분야·설명·그림·홈 노출 | Research & projects → Research areas | `content/research/*.json` |
| 연구 프로그램·홈 노출 | Research & projects → Projects | `content/projects/*.json` |
| Projects의 자세한 사례 | Research & projects → Research case studies | `content/research-cases/*.json` |
| 논문·서지정보·DOI·이미지·홈 대표 논문 | Research outputs → Publications | `content/publications/*.json` |
| 특허 | Research outputs → Patents | `content/patents/*.json` |
| 논문 연구 주제(향후 분류·연결용) | Research outputs → Publication topics | `content/topics/*.json` |
| 수상·연구자 프로그램 | About & activities → Awards & programs | `content/awards/*.json` |
| 학술활동 사진 | About & activities → Gallery photographs | `content/gallery/*.json` |
| Research, Projects, Publications, Patents, About, Activities, CV 페이지의 안내 문구 | 각 그룹의 “page text” | `content/pages/*.json` |

**논문 추가:** Research outputs → Publications → **Add an entry**에서 Title, Authors, Journal, Publication type/status, Year를 입력합니다. Authors는 논문 순서와 `†`, `*` 표기를 그대로 적습니다. **Stable URL ID**에는 `new-memory-paper`처럼 고유한 영문 소문자·숫자·하이픈을 넣습니다. Volume, Issue, Start/End page 또는 Article number는 확인된 값만 채우고 나머지는 비워 둡니다. DOI만 입력하면 사이트가 `https://doi.org/{DOI}` 링크를 만듭니다. 별도 DOI URL이 있으면 그것을 우선 사용합니다. Save 후 GitHub Actions 배포가 끝나면 새 논문이 자동으로 연도별 목록과 검색에 나타납니다. 파일명 등록이나 코드 수정은 필요 없습니다.

**상태와 표시:** Publications 페이지에는 Published, Accepted, In Press, ASAP, Early View, Online Published만 표시됩니다. Manuscript, Submitted, Under Review, In Revision은 CMS에 보존되지만 Publications 페이지에는 나타나지 않습니다. Publication date가 있으면 같은 연도 내 최신 날짜가 먼저 나오고, 없으면 Display order로 정렬됩니다. Featured는 Home의 대표 연구에 사용하고, Show on website를 끄면 데이터를 보존한 채 사이트에서 숨깁니다. DOI가 없는 논문에는 Publications 목록의 DOI 버튼이 나오지 않습니다.

기존 21건의 `journal` 원문은 **Original journal and citation (preserved)** 필드에 그대로 남겨 두었습니다. 새 편집용 Journal과 Volume/Issue/Page/Article number는 별도 필드입니다. 새로운 논문은 Original journal and citation을 채울 필요가 없습니다. Publisher, ISSN/eISSN, URL, Keywords, Research Category, Related Research/Projects, Author Notes와 저자 역할 필드는 선택 사항이며, 없는 정보는 화면에 표시하지 않습니다.

**과제·연구·특허 추가:** 해당 컬렉션에서 New → Save. 새 항목의 **Stable URL ID**에는 `new-memory-study`처럼 짧은 영문 소문자·숫자·하이픈을 입력합니다. 이 값이 파일명과 페이지 내 주소가 됩니다. 연구 분야는 Research 페이지에 새 섹션으로 자동 표시됩니다. 연구 분야에서 Home section placement와 Feature on homepage를 설정하면 Home에도 표시됩니다. Projects의 `Featured`는 Home의 Current research 목록에 표시합니다. 특허는 상태를 Registered 또는 Application으로 구분합니다. 목록 순서는 `Display order`의 작은 숫자가 앞입니다. 기존 항목의 Stable URL ID는 북마크를 위해 유지하세요.

**연결 항목:** 논문 주제, 연구 분야의 관련 논문, 연구 사례의 관련 논문·특허는 CMS 참조 필드에서 선택할 수 있습니다. Projects의 `Detailed research case ID`는 별도 사례와 연결합니다. 페이지 내부 주소를 직접 입력하는 버튼은 `.html#anchor` 형태를 사용합니다.

**사진:** 이미지 필드에서 업로드하면 `assets/`에 저장됩니다. Alternative text와 캡션을 함께 적으세요. CV PDF는 Profile의 `CV PDF file`에서 업로드하거나 교체합니다. 기존 원본은 유지했고, 연구 콘셉트 이미지는 실험 데이터가 아님을 캡션에 표시했습니다. 실제 행사 사진이 없으면 Activities에는 자리표시자가 나옵니다.

> Pages CMS는 GitHub 저장소에 커밋할 권한이 필요합니다. 첫 로그인과 GitHub App 접근 허용은 저장소 소유자가 수행해야 합니다. `.pages.yml`은 JSON 문법으로 작성된 유효한 YAML 1.2 파일이며 `node scripts/generate-cms-config.mjs`로 재생성할 수 있습니다.

## 자동 빌드와 배포

`.github/workflows/pages.yml`은 `main`의 CMS 데이터·자산·코드 변경을 감지합니다. Node 22로 페이지를 생성하고 내부 링크·이미지 속성 및 CMS 항목 동작을 검사한 후 `.site/`에 공개 파일만 모아 GitHub Pages에 배포합니다. `content/`의 JSON이나 `content.js`는 공개 배포물에 포함하지 않습니다. 기존 `index.html` 등은 저장소에 남아 있어 기존 URL과 로컬 파일 미리보기를 유지합니다.

GitHub Pages 배포 소스는 **GitHub Actions**로 설정했습니다(2026-10-02 확인). CMS Save가 `main`에 커밋되면 자동 배포됩니다. 배포 방식을 다시 변경해야 할 때는 저장소 → Settings → Pages → Build and deployment → Source에서 선택합니다. [GitHub Pages 공식 안내](https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site)

`content.js`는 이전 데이터의 읽기 전용 백업입니다. 새 빌드는 이를 사용하지 않습니다. 새 항목은 파일명을 등록하지 않아도 각 컬렉션 디렉터리를 자동으로 읽습니다. 생성된 HTML을 직접 수정하면 다음 빌드 때 덮어씁니다.

## 로컬 확인

Node.js 22 이상으로 저장소에서 실행합니다. `npm install`은 필요하지 않습니다.

```powershell
node scripts/build.mjs
node scripts/check.mjs
node scripts/test-cms.mjs
node scripts/test-publications.mjs
node scripts/stage-site.mjs
```

`node scripts/test-cms.mjs`는 임시 복사본에서 논문·연구 분야·과제·특허 추가, 논문 수정·삭제, 노출·대표 선택 및 이미지 경로 반영을 확인합니다. 실제 Pages CMS 로그인/업로드 UI와 GitHub Actions 실행은 GitHub 연결 후 확인해야 합니다. 로컬 웹 미리보기는 `node scripts/serve.mjs` 후 <http://127.0.0.1:8765/>에서 봅니다. 종료는 `Ctrl+C`입니다.

## 파일 구조와 데이터 보존

- `content/site.json`, `content/profile.json`, `content/pages/*.json`: 전역 정보와 페이지 문구
- `content/publications/`, `projects/`, `patents/`, `awards/`, `topics/`, `research/`, `research-cases/`, `gallery/`: 항목별 JSON 컬렉션
- `scripts/content.mjs`: CMS JSON 로딩, 표시 여부·순서 처리
- `scripts/pages.mjs`, `scripts/components.mjs`: 현재 디자인의 HTML 템플릿
- `scripts/build.mjs`: 정적 HTML과 sitemap 생성
- `scripts/check.mjs`, `scripts/test-cms.mjs`: 링크·동작 검사
- `scripts/stage-site.mjs`: GitHub Pages 배포물 준비
- `scripts/migrate-content.mjs`: 기존 `content.js`의 일회성, 덮어쓰기 방지 마이그레이션 기록
- `scripts/generate-cms-config.mjs`: 실제 JSON 필드를 포함하는 Pages CMS 편집 스키마 생성
- `scripts/migrate-publication-metadata.mjs`: 기존 논문 21건의 서지정보 분리 기록(재실행해도 기존 값 유지)
- `.pages.yml`: Pages CMS 편집 화면과 이미지/PDF 업로드 설정
- `styles.css`, `script.js`: 기존 디자인과 모바일 메뉴·논문 필터·갤러리·인쇄 동작

기존 `publications.html`, `projects.html`, `patents.html` 등의 URL은 유지됩니다. `contact.html`과 `recognition.html`도 이전 링크를 위한 이동 페이지로 유지됩니다. 초기 마이그레이션은 논문 21건, 과제 9건, 특허 8건, 수상 6건, 연구 사례 5건, 연구 분야 5건, 주제 5건을 옮겼습니다. 원본 `content.js`는 비교와 복구를 위해 보관했습니다.

공개용 PDF는 CMS에서 직접 교체하는 방식입니다. 원하면 `scripts/build_cv.py`로 현재 JSON에서 새 PDF를 생성할 수 있지만 ReportLab과 한글 글꼴이 필요하며 GitHub Actions의 필수 단계는 아닙니다. 웹 CV인 `cv.html`은 매번 자동 갱신됩니다. PDF를 바꾸지 않으면 기존 파일이 그대로 다운로드됩니다.

미확인 DOI·개인 프로필 URL·행사 사진·특허 진행 상태는 추정해 채우지 않았습니다. 특허 `10-2024-0088513`과 `10-2024-0060762`의 출원국 표기는 기존 확인된 내용을 유지합니다. 이미지 출처와 콘셉트 이미지에 대한 내용은 `docs/IMAGE_ASSETS.md`를 참고하세요.
