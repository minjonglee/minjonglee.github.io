# Min Jong Lee — 개인 연구 포트폴리오

이 폴더는 `https://minjonglee.github.io/`에 올릴 수 있는 **HTML·CSS·JavaScript 정적 홈페이지**입니다. 상단 메뉴는 About, Research, Publications, Patents, Recognition, Contact의 **각각 다른 페이지**로 이동합니다. 별도 빌드나 유료 서비스가 필요하지 않습니다.

## 먼저 미리보기

`index.html`을 더블클릭하면 브라우저에서 볼 수 있습니다. 모바일 모양은 브라우저 창의 너비를 줄여 확인할 수 있습니다.

## 파일 역할

| 파일 | 역할 |
|---|---|
| `index.html` | 메인 홈페이지 |
| `about.html`, `research.html`, `publications.html`, `patents.html`, `recognition.html`, `contact.html` | 상단 메뉴에서 이동하는 개별 페이지 |
| `styles.css` | 색상, 배치, 모바일 디자인 |
| `content.js` | 논문·특허·프로젝트·수상 목록 |
| `script.js` | 목록 표시, 필터, 모바일 메뉴 |
| `favicon.svg` | 브라우저 탭 아이콘 |
| `robots.txt`, `sitemap.xml` | 검색엔진 안내 |
| `.nojekyll` | GitHub Pages에서 이 정적 파일을 그대로 제공하도록 하는 표시 |

## 내용 수정

1. **소개/직함/연락처**: `index.html`과 해당 개별 페이지에서 문장을 찾아 수정합니다. 메인 화면과 개별 페이지에 같은 내용이 보이는 부분은 두 파일 모두 바꿔 주세요.
2. **논문·특허·프로젝트·수상**: `content.js`의 해당 배열에 같은 형식으로 항목을 추가합니다. 가장 최근 항목을 위에 넣으면 됩니다.
3. **색상**: `styles.css` 첫 줄의 `--navy`, `--red` 등을 수정합니다.
4. 수정 후 `index.html`을 새로고침해 확인합니다.

논문 오른쪽 화살표는 해당 제목을 **Google Scholar에서 검색**합니다. 정확한 DOI 링크가 준비되면 `content.js`에 URL 필드를 추가하고 `script.js`에서 그 URL을 사용하도록 바꿀 수 있습니다.

## GitHub Pages 공개하기

1. 이 폴더는 이미 **`minjonglee/minjonglee.github.io`** 저장소의 작업 폴더입니다. `index.html`을 비롯한 사이트 파일이 저장소 최상위에 있습니다.
2. 이번에는 이전 임시 커밋 기록을 새 초기 커밋 하나로 정리했으므로, 인증 가능한 Git 환경에서 **처음 한 번만** 아래 명령으로 원격 `main`을 교체합니다. 원격에 다른 사람이 새 커밋을 올렸다면 명령이 안전하게 실패하므로 확인 후 진행하세요.

   ```bash
   git push --force-with-lease origin main
   ```

3. 저장소의 **Settings → Pages → Build and deployment → Source**에서 **Deploy from a branch**를 선택합니다. Branch는 `main`, 폴더는 `/ (root)`로 지정하고 저장합니다.
4. 배포가 완료되면 `https://minjonglee.github.io/`를 열어 확인합니다. 이후 내용 수정은 보통 `git add`, `git commit`, `git push`로 올리면 됩니다.

공식 안내: [GitHub Pages 빠른 시작](https://docs.github.com/en/pages/quickstart), [배포 소스 설정](https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site).

## 공개 전 확인 사항

- 정보 출처는 사용자가 제공한 `MJL_CV_20260901.docx`입니다. 특히 논문 상태와 최신 실적을 최종 확인해 주세요.
- CV에는 전화번호와 상세 주소가 있지만 홈페이지에는 넣지 않았습니다. 공개 연락 방법은 대학 이메일만 사용했습니다.
- CV 원본 파일은 전화번호가 포함되어 있어 사이트에 첨부하지 않았습니다. 현재의 “CV 요청”은 이메일로 연결됩니다.
- 이번 버전은 정적 사이트입니다. 이전 대화에서 논의한 `/admin` 관리 화면은 로그인·GitHub 쓰기 권한 설정이 필요한 별도 단계라 포함하지 않았습니다. 현재는 `content.js`를 수정해 논문 등을 추가합니다.
- 연구 그림이나 사진을 사용하지 않았습니다. 상단 장치 그림과 논문 카드 이미지는 CSS로 그린 추상 그래픽입니다.

## 파일 구조

```text
minjonglee-portfolio/
├─ index.html
├─ about.html
├─ research.html
├─ publications.html
├─ patents.html
├─ recognition.html
├─ contact.html
├─ styles.css
├─ content.js
├─ script.js
├─ favicon.svg
├─ robots.txt
├─ sitemap.xml
├─ .nojekyll
└─ README.md
```
