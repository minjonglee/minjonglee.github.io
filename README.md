# Min Jong Lee — Academic Research Portfolio

작업 폴더: `C:\Users\User\Downloads\minjonglee.github.io`

배포 주소: <https://minjonglee.github.io/>

**Interface & Defect Engineering for Memory and Computing**를 중심으로 구성한 개인 연구 포트폴리오입니다. HTML/CSS/JavaScript 정적 사이트이며, 상단 메뉴는 각기 다른 페이지로 이동합니다. 운영용 프레임워크·외부 폰트·추적 스크립트·npm 의존성이 없습니다.

## 로컬에서 보기

`index.html`을 더블클릭해도 본문과 메뉴를 사용할 수 있습니다. 실제 배포와 비슷하게 확인하려면 이 폴더에서 다음을 실행하세요.

```powershell
python -m http.server 8765 --bind 127.0.0.1
```

브라우저에서 <http://127.0.0.1:8765/>를 엽니다. 종료는 터미널에서 `Ctrl+C`입니다.

## 파일 역할

| 파일 | 역할 |
|---|---|
| `index.html` | 메인: 연구 정체성, 세 연구 축, 대표 연구, 연구 흐름, 소개 |
| `research.html` | 연구 질문, 현재 연구, 확인된 결과, 방법, 향후 방향 |
| `publications.html` | 전체 저자·학술지·연도, 주제별 필터, 논문 링크 |
| `projects.html` | 연구 사례와 CV에 기재된 공동·산학 과제 |
| `patents.html` | 등록·출원 상태를 구분한 특허 기록 |
| `about.html` | 소개, 연구 환경, 학력, 연락처 |
| `activities.html` | 수상·장학·연구자 프로그램·학술활동 갤러리 |
| `cv.html`, `assets/min-jong-lee-cv.pdf` | 웹 CV와 바로 다운로드하는 공개용 PDF |
| `contact.html`, `recognition.html` | 이전 주소를 새 페이지로 연결하는 호환 페이지 |
| `content.js` | 프로필·연구·논문·특허·과제·수상·사진의 편집 원본 |
| `scripts/pages.mjs` | 각 페이지의 구조·고정 문구 |
| `scripts/components.mjs` | 공통 헤더·푸터·메타데이터·목록·시각 요소 |
| `scripts/build.mjs` | 원본을 실제 HTML 파일과 sitemap으로 변환 |
| `scripts/check.mjs` | 내부 링크·앵커·이미지 속성·기본 메타데이터 검사 |
| `styles.css`, `script.js` | 디자인과 메뉴·필터·인쇄 동작 |
| `scripts/build_cv.py` | 같은 데이터에서 공개용 PDF를 다시 만드는 선택 도구 |
| `assets/social-preview.svg`, `.png` | 공유 미리보기 이미지의 편집 원본과 실제 배포 이미지 |
| `docs/AUDIT.md`, `docs/QA.md` | 개편 전 점검, 내용 판단 기준, 검수 결과 |

HTML 파일은 이미 생성되어 있어 **보기와 배포에 Node/Python이 필요하지 않습니다.** 내용을 수정해 전체 페이지를 갱신할 때만 아래 생성 명령을 사용합니다. 공통 헤더와 논문을 여러 HTML 파일에서 따로 고치지 않아도 됩니다.

## 내용 바꾸기

1. `content.js`에서 해당 항목을 수정합니다.
2. 페이지 구조·고정 문구는 `scripts/pages.mjs`, 공통 메뉴는 `scripts/components.mjs`를 수정합니다.
3. Node.js 20 이상이 설치된 환경에서 실행합니다. `npm install`은 필요하지 않습니다.

```powershell
node scripts/build.mjs
node scripts/check.mjs
```

4. 로컬 미리보기에서 변경된 페이지를 확인합니다.

직접 생성된 HTML을 고치면 다음 `build`에서 덮어씁니다. CSS/브라우저 JS를 수정한 경우에는 HTML 재생성 없이 새로고침하면 됩니다.

### 프로필·연락처

`profile`에서 이름·이메일·학력·소개를 편집합니다. `orcid`, `linkedin`은 정확한 주소를 넣으면 About와 푸터에 나타납니다. 현재는 확인되지 않아 `null`이며 임의의 계정을 연결하지 않았습니다.

### 논문

`publications`에 다음 형태로 추가합니다. `id`는 고유해야 하며 외부에서 링크할 수 있으므로 게시한 뒤에는 유지하는 것이 좋습니다.

```js
{
  "id": "paper-22",
  "year": 2026,
  "type": "co",
  "title": "실제 논문 제목",
  "authors": "실제 저자 목록",
  "journal": "실제 학술지 · 권(호), 페이지 또는 논문 번호",
  "topics": ["memory", "interfaces"],
  "doi": "검증한 DOI만 입력",
  "image": null,
  "imageAlt": ""
}
```

주제 ID: `memory`, `interfaces`, `oxide`, `opto`. 주제는 여러 개 지정할 수 있습니다. 본인의 제1저자 역할이 확인된 경우에만 `type: "first"`를 사용합니다. `co`는 일반 공동저자를 뜻하며 공동제1저자 배지가 아닙니다.

DOI를 모르면 해당 필드를 생략합니다. 이 경우 `Find on Scholar`로 표시합니다. 심사 중 원고에는 `status: "In revision"` 등을 넣으면 게재 논문과 구분되고 출판 링크를 만들지 않습니다. 상태가 바뀌면 CV와 함께 갱신하세요.

홈 대표 연구는 `featured` 배열에서 논문의 `id`, 연결할 연구 프로젝트, 연구 질문과 기여 문장을 지정합니다. 수치 결과를 새로 넣을 때는 실제 논문과 대조합니다.

### 연구와 과제

`pillars`의 `current`, `results`, `methods`, `future`를 구분해 편집합니다. 계획은 `future`에 두고 실제 결과가 생겼을 때 옮깁니다. `researchProjects`는 연구 질문 중심의 사례, `projects`는 CV에 기재된 과제 목록입니다. 개별 역할은 확인된 경우에만 `personalRole`에 입력합니다.

### 특허

`patents`의 `status`, `jurisdiction`, `number`, `date`, `inventors`를 원문과 대조해 수정합니다. 현재 등록과 출원, 미국 번호와 중국·대만 관련 언급을 구분했습니다. 주제 연결은 특허 패밀리나 기술이전 실적을 의미하지 않습니다.

## 사진과 연구 그림 넣기

제공받은 인물 사진은 `assets/min-jong-lee-portrait.jpg`에 적용되어 있습니다. 연구 그림과 행사 사진은 실제 자료를 받기 전까지 화면에 표시하지 않습니다. 경로를 채우고 HTML을 다시 생성하면 해당 이미지가 나타납니다.

| 필요한 자료 | 데이터 위치 | 권장 형식 |
|---|---|---|
| 인물 사진 교체(선택) | `profile.portrait`, `profile.portraitAlt` | 현재 사진 적용 완료; 고해상도 원본이 있으면 교체 가능 |
| 대표 연구 그림 4장 | 해당 `publications[].image`, `imageAlt` | 약 1.9:1, 960px 이상, PNG/WebP/SVG |
| 학회·연구방문·연구실 사진 | `gallery[].image`, `alt`, `caption` | 가로 4:3, 900×675px 이상, WebP/JPEG |

파일은 `assets/`에 넣고 예를 들어 `"portrait": "assets/portrait.webp"`로 지정합니다. 대체텍스트는 사진의 인물·행사 또는 연구 그림의 과학적 내용을 설명해야 합니다. 이미지 경로만 있고 대체텍스트가 없으면 생성기가 오류를 내도록 했습니다. 현재 인물 사진은 원본의 3:4 비율로 표시하고, 연구 그림은 잘리지 않도록 전체가 보입니다. 다른 비율의 인물 사진으로 교체할 때는 `styles.css`의 `.portrait` 비율과 `scripts/components.mjs`의 이미지 너비·높이도 함께 수정하세요. 원본 파일명에 공백을 넣지 않는 편이 편리합니다.

사진은 가급적 300KB 내외로 최적화하세요. 이미지에 크기를 명시하고 연구·갤러리 이미지는 지연 로딩합니다. 행사 이름·날짜가 확인되면 `gallery`의 제목과 캡션도 함께 바꿉니다.

## 공개용 CV

상단 `CV ↓`는 `assets/min-jong-lee-cv.pdf`를 바로 내려받습니다. 원본 CV를 기반으로 만든 공개 버전으로, 전화번호와 상세 우편주소를 제외했습니다. 경력·논문·특허 상태의 기준은 **2026년 9월 2일 업데이트 CV**입니다. 한국어 과제·수상명은 원문과 설명용 영어 번역을 함께 보존했습니다.

데이터를 바꾼 뒤 PDF도 갱신하려면 Python + ReportLab을 사용합니다. 사이트 운영에는 이 도구가 필요하지 않습니다.

```powershell
python -m pip install reportlab
python scripts/build_cv.py
```

기본 글꼴은 Windows의 맑은 고딕입니다. 다른 환경에서는 한글을 지원하는 TrueType 글꼴을 지정합니다.

```text
python scripts/build_cv.py --font-regular /path/to/regular.ttf --font-bold /path/to/bold.ttf
```

또는 `cv.html`을 열어 **Print CV → PDF로 저장**하고 위 PDF 파일을 교체할 수 있습니다. 저장 후 제목이 페이지 아래에 홀로 남지 않는지, 한글과 논문 목록이 잘리지 않는지 확인하세요. 논문 페이지의 인쇄 버튼은 현재 필터와 관계없이 전체 논문 목록을 출력합니다.

## GitHub Pages에 반영

현재 저장소는 `minjonglee/minjonglee.github.io`, 브랜치는 `main`입니다. 수정한 내용을 배포하려면 변경 파일을 커밋하고 푸시합니다.

```powershell
node scripts/build.mjs
node scripts/check.mjs
git status
git add .
git commit -m "Redesign academic research portfolio"
git push origin main
```

GitHub 저장소 **Settings → Pages → Build and deployment → Source → Deploy from a branch**에서 `main`과 `/ (root)`를 지정합니다. 생성된 HTML을 저장소에 포함하므로 GitHub 서버에서 Node/Python 빌드를 실행할 필요가 없습니다. `.nojekyll`은 그대로 유지하세요. 배포 상태는 저장소 Actions에서 확인합니다. [GitHub 공식 배포 소스 안내](https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site)


## 아직 필요한 정보

- 대표 연구 그림 4장, 학술활동 사진과 행사명·날짜. 인물 사진은 적용했으며 고해상도 원본으로 교체할 수 있습니다.
- 본인의 정확한 ORCID·LinkedIn 주소.
- 학회 발표·초청 강연·연구방문 세부 기록, 현재 CV에 없는 추가 학력.
- 원고의 최신 심사 상태, 이후 추가된 실적, 특허 상태 변경.
- 나머지 DOI와 산업과제의 공개 가능한 개인 역할·성과가 있으면 추가 가능.

기존 CV의 실적·상태·기간은 근거 없이 변경하지 않았습니다. 연구소·대학·기업 지원 목표를 현재 소속이나 협업 실적으로 표시하지 않습니다.
