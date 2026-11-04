# AI Search Visualizer

**Ứng dụng mô phỏng và so sánh các thuật toán tìm kiếm trong không gian trạng thái**

**Môn học:** Trí tuệ nhân tạo (INT1314)  
**Loại đề tài:** Đồ án nhóm – 5 thành viên  
**Hạn hoàn thành:** 06/11/2026  
**Repository:** https://github.com/duyhdo/int1314-ai-search-visualizer

### Danh sách thành viên

1. K24DTCN486 - Đỗ Hoàng Duy - dohoangduy.vig@gmail.com - duyhdo
2. 
3. 
4. 
5. 

---

## 1. Giới thiệu

AI Search Visualizer là ứng dụng Web mô phỏng các thuật toán tìm kiếm trong không gian trạng thái thông qua bài toán tìm đường đi trong mê cung hai chiều.

Ứng dụng sử dụng 5 thuật toán:

| STT | Thuật toán | Phương pháp tìm kiếm |
|---|---|---|
| 1 | Breadth-First Search (BFS) | Tìm kiếm theo chiều rộng |
| 2 | Depth-First Search (DFS) | Tìm kiếm theo chiều sâu |
| 3 | Uniform Cost Search (UCS) | Tìm kiếm theo chi phí |
| 4 | Greedy Best-First Search | Tìm kiếm dựa trên heuristic |
| 5 | A* Search | Tìm kiếm kết hợp chi phí và heuristic |

Ứng dụng cho phép quan sát quá trình tìm kiếm, hiển thị đường đi từ điểm bắt đầu đến điểm đích và so sánh kết quả giữa các thuật toán.

## 2. Chức năng ứng dụng

- Hiển thị mê cung dạng lưới 2D.
- Thiết lập điểm bắt đầu (S), điểm đích (G) và vật cản.
- Lựa chọn thuật toán tìm kiếm.
- Mô phỏng quá trình mở rộng các trạng thái.
- Hiển thị đường đi tìm được.
- Thống kê số bước, chi phí đường đi, số trạng thái mở rộng và thời gian thực thi.
- So sánh kết quả giữa các thuật toán trên cùng một mê cung.
- Khôi phục trạng thái ban đầu của mê cung.
- Điều khiển nhanh bằng bàn phím.

### Phím tắt

| Phím | Chức năng |
|---|---|
| `Enter` / `Space` | Chạy thuật toán đang chọn |
| `R` | Reset kết quả |
| `1` – `5` | Chọn thuật toán (1 = BFS, 2 = DFS, 3 = UCS, 4 = Greedy, 5 = A*) |
| `Esc` | Đóng thông báo lỗi |

Phím tắt không hoạt động khi đang nhập liệu trong ô `input`/`select` (trừ `Esc`). Danh sách phím tắt cũng được hiển thị trong mục *Keyboard shortcuts* của bảng Search Control.

## 3. Công nghệ sử dụng

| Thành phần | Công nghệ |
|---|---|
| Frontend | React, JavaScript |
| Build Tool | Vite |
| Giao diện | HTML, CSS |
| Unit Test | Vitest |
| Code Quality | ESLint |
| Version Control | Git |
| Repository | GitHub |
| IDE | Visual Studio Code |

Ứng dụng chạy trên trình duyệt, không sử dụng Backend hoặc Database.

## 4. Cài đặt và chạy ứng dụng

### 4.1. Yêu cầu môi trường

- Node.js 20.19+ hoặc 22.12+ (khuyến nghị Node.js 24 LTS).
- npm tương thích với phiên bản Node.js.
- Git.

### 4.2. Tải mã nguồn

```bash
git clone https://github.com/duyhdo/int1314-ai-search-visualizer.git
cd int1314-ai-search-visualizer
```

Chuyển sang nhánh phát triển:

```bash
git switch develop
git pull origin develop
```

### 4.3. Cài đặt thư viện

```bash
npm install
```

### 4.4. Chạy ứng dụng

```bash
npm run dev
```

Truy cập địa chỉ được Vite hiển thị, mặc định:

http://localhost:5173/

### 4.5. Build và kiểm thử

```bash
npm run build
npm run lint
npm test
```

## 5. Cấu trúc mã nguồn

```text
int1314-ai-search-visualizer/
├── .github/
│   └── copilot-instructions.md
├── docs/
│   ├── ARCHITECTURE.md
│   └── TASKS.md
├── public/
├── src/
│   ├── algorithms/
│   │   ├── bfs.js
│   │   ├── dfs.js
│   │   ├── ucs.js
│   │   ├── greedy.js
│   │   └── astar.js
│   ├── components/
│   │   ├── MazeGrid.jsx
│   │   ├── ControlPanel.jsx
│   │   ├── Animation.jsx
│   │   └── Statistics.jsx
│   ├── data/
│   │   └── sampleMaze.js
│   ├── utils/
│   │   ├── grid.js
│   │   ├── keyboard.js
│   │   └── searchContract.js
│   ├── styles/
│   │   └── app.css
│   ├── tests/
│   │   ├── grid.test.js
│   │   └── searchContract.test.js
│   ├── App.jsx
│   └── main.jsx
├── CONTRIBUTING.md
├── README.md
├── package.json
├── vite.config.js
└── vitest.config.js
```

## 6. Quy ước dữ liệu

Các thuật toán sử dụng chung cấu trúc đầu vào và đầu ra.

### 6.1. Dữ liệu đầu vào

```javascript
{
  grid: Array<Array<number>>,
  start: { row: number, col: number },
  goal: { row: number, col: number }
}
```

Quy ước:

- `grid`: Ma trận hai chiều.
- `0`: Ô có thể di chuyển.
- `1`: Vật cản.
- `start`: Vị trí bắt đầu.
- `goal`: Vị trí đích.
- Di chuyển theo bốn hướng: Lên, Phải, Xuống, Trái.
- Chi phí mỗi bước di chuyển bằng 1.

### 6.2. Dữ liệu đầu ra

```javascript
{
  found: boolean,
  path: Array<{ row, col }>,
  visitedOrder: Array<{ row, col }>,
  pathCost: number | null,
  expandedNodes: number
}
```

| Thuộc tính | Ý nghĩa |
|---|---|
| `found` | Kết quả tìm kiếm |
| `path` | Đường đi từ S đến G |
| `visitedOrder` | Thứ tự các trạng thái được mở rộng |
| `pathCost` | Tổng chi phí đường đi |
| `expandedNodes` | Số trạng thái được mở rộng |

Các thuật toán phải tuân thủ cấu trúc dữ liệu chung, không thay đổi dữ liệu đầu vào và không ghi trùng trạng thái trong `visitedOrder`.

## 7. Phân công công việc

Mỗi thành viên phụ trách một thuật toán và một chức năng của ứng dụng.

| Thành viên | Thuật toán | Chức năng | Branch |
|---|---|---|---|
| Thành viên 1 | BFS | Grid Utilities | `feature/bfs-grid` |
| Thành viên 2 | DFS | Maze Editor | `feature/dfs-maze-ui` |
| Thành viên 3 | UCS | Animation | `feature/ucs-animation` |
| Thành viên 4 | Greedy | Statistics & Comparison | `feature/greedy-statistics` |
| Thành viên 5 | A* | Controls & Integration | `feature/astar-controls` |

Mỗi thành viên thực hiện lập trình, kiểm thử và commit mã nguồn trên branch được phân công.

Chi tiết công việc: [docs/TASKS.md](./docs/TASKS.md).

## 8. Quy trình Git

### 8.1. Cấu trúc Branch

```text
main
 └── develop
      ├── feature/bfs-grid
      ├── feature/dfs-maze-ui
      ├── feature/ucs-animation
      ├── feature/greedy-statistics
      └── feature/astar-controls
```

- `main`: Nhánh chính, lưu phiên bản ổn định.
- `develop`: Nhánh tích hợp các chức năng.
- `feature/*`: Nhánh lập trình của từng thành viên.

### 8.2. Làm việc trên Branch

Ví dụ thành viên 1:

```bash
git fetch origin
git switch feature/bfs-grid
git pull origin feature/bfs-grid
```

Sau khi hoàn thành:

```bash
git add .
git commit -m "feat(bfs): implement breadth-first search"
git push -u origin feature/bfs-grid
```

### 8.3. Pull Request

1. Hoàn thành code và Unit Test trên branch được phân công.
2. Chạy `npm run build`, `npm run lint` và `npm test`.
3. Push source code lên GitHub.
4. Tạo Pull Request vào `develop`.
5. Review, sửa lỗi và merge sau khi được chấp thuận.

Không push trực tiếp vào `main` hoặc `develop`.

## 9. Kiểm thử

### 9.1. Unit Test

Kiểm thử các thành phần:

- Grid Utilities.
- Search Contract.
- Thuật toán BFS, DFS, UCS, Greedy và A*.
- Các trường hợp có đường đi, không có đường đi và điểm bắt đầu trùng điểm đích.

### 9.2. Integration Test

- Thuật toán nhận đúng dữ liệu mê cung.
- Giao diện gọi đúng thuật toán được chọn.
- Animation hiển thị đúng thứ tự mở rộng trạng thái.
- Statistics hiển thị đúng kết quả.
- Reset khôi phục trạng thái ban đầu.

Lệnh kiểm thử:

```bash
npm run build
npm run lint
npm test
```

## 10. Triển khai ứng dụng

Ứng dụng có thể triển khai trên GitHub Pages, Vercel hoặc Netlify.

Build phiên bản Production:

```bash
npm run build
```

Thư mục `dist/` chứa các file dùng để triển khai ứng dụng.

## 11. Tài liệu dự án

- [CONTRIBUTING.md](./CONTRIBUTING.md) – Hướng dẫn làm việc nhóm.
- [docs/ARCHITECTURE.md](./docs/ARCHITECTURE.md) – Thiết kế và cấu trúc hệ thống.
- [docs/TASKS.md](./docs/TASKS.md) – Phân công công việc.
- [.github/copilot-instructions.md](./.github/copilot-instructions.md) – Hướng dẫn phát triển với GitHub Copilot.

## 12. Xử lý lỗi thường gặp

**Cổng localhost đang được sử dụng:**

```bash
npm run dev -- --port 3000
```

**Lỗi cài đặt thư viện:**

```bash
npm install
```

**Lỗi Build:**

```bash
npm run build
```

**Lỗi Unit Test:**

```bash
npm test -- --reporter=verbose
```

**Kiểm tra Branch:**

```bash
git fetch origin
git branch -a
```

## 13. Phạm vi sử dụng

Dự án được thực hiện phục vụ học tập và báo cáo đồ án môn Trí tuệ nhân tạo (INT1314).

Mã nguồn được quản lý trên GitHub và phát triển theo phân công của nhóm.

**Hạn hoàn thành: 06/11/2026.**