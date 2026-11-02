# Thiết kế kiến trúc – AI Search Visualizer

**Môn học:** Trí tuệ nhân tạo (INT1314)  
**Ứng dụng:** Mô phỏng và so sánh các thuật toán tìm kiếm trên mê cung 2D  
**Phiên bản tài liệu:** 1.1 – 02/11/2026

> Tài liệu này mô tả kiến trúc chung và các quy ước tích hợp. Các component hoặc chức năng chưa được triển khai được ghi là **dự kiến**; cần đối chiếu với source trước khi merge.

## 1. Tổng quan kiến trúc

Ứng dụng là Single-Page Application (SPA) sử dụng React, JavaScript và Vite. Thuật toán chạy tại trình duyệt; không có backend hoặc database.

```text
UI Components
  ControlPanel | MazeGrid | MazeEditor (dự kiến)
  Animation | Statistics | StatisticsComparison (dự kiến)
                         ↕ props / callbacks
App.jsx – Application Orchestration
  Trạng thái mê cung, thuật toán được chọn, kết quả, lỗi, thời gian chạy
                         ↓
Search Algorithms
  BFS | DFS | UCS | Greedy | A*
                         ↕
Shared Utilities & Data
  grid.js | searchContract.js | sampleMaze.js
```

Nguyên tắc: thuật toán không phụ thuộc React; component giao diện không tự tính đường đi; `App.jsx` điều phối thực thi và truyền dữ liệu bằng props.

## 2. Module và trách nhiệm

| Module | Trách nhiệm | Phụ trách |
|---|---|---|
| `src/algorithms/bfs.js` | BFS (Queue/FIFO) | TV1 |
| `src/algorithms/dfs.js` | DFS (Stack/LIFO) | TV2 |
| `src/algorithms/ucs.js` | UCS (ưu tiên `g(n)`) | TV3 |
| `src/algorithms/greedy.js` | Greedy Best-First Search (ưu tiên `h(n)`) | TV4 |
| `src/algorithms/astar.js` | A* (ưu tiên `f(n)=g(n)+h(n)`) | TV5 |
| `src/utils/grid.js` | Kiểm tra lưới, ô hợp lệ, hàng xóm, Manhattan Distance và tọa độ | Dùng chung; TV1 rà soát |
| `src/utils/searchContract.js` | Danh sách thuật toán, kiểm tra input/result | Dùng chung; không tự ý đổi |
| `src/data/sampleMaze.js` | Bộ mê cung mẫu và trường hợp kiểm thử | Dùng chung |
| `src/components/MazeGrid.jsx` | Hiển thị lưới, S/G, vật cản, các ô mở rộng và đường đi | Dùng chung |
| `src/components/ControlPanel.jsx` | Chọn thuật toán, Run và Reset | TV5 tích hợp |
| `src/components/MazeEditor.jsx` *(dự kiến)* | Bật/tắt chế độ chỉnh sửa vật cản | TV2 |
| `src/components/Animation.jsx` | Điều khiển mô phỏng theo `visitedOrder` | TV3 |
| `src/components/Statistics.jsx` | Thống kê một lượt chạy | TV4 |
| `src/components/StatisticsComparison.jsx` *(dự kiến)* | So sánh nhiều lượt chạy | TV4 |
| `src/App.jsx` | Quản lý state, gọi thuật toán, bắt lỗi và phối hợp UI | Đầu mối tích hợp TV5 |

Các file CSS đặt cạnh component hoặc trong `src/styles/` theo cấu trúc hiện có; không mặc định là CSS Modules nếu không dùng đuôi `.module.css`.

## 3. Search Contract và dữ liệu dùng chung

### 3.1. Đầu vào

```javascript
{
  grid: [[0, 0, 1], [0, 0, 0]],
  start: { row: 0, col: 0 },
  goal: { row: 1, col: 2 }
}
```

- `0`: ô trống; `1`: vật cản; tọa độ `row`, `col` bắt đầu từ 0.
- Chỉ di chuyển 4 hướng, thứ tự hàng xóm **Lên → Phải → Xuống → Trái**.
- Chi phí mỗi bước bằng 1; không sửa input.
- Các lần chạy với cùng input phải có kết quả xác định, bao gồm quy tắc xử lý trường hợp đồng mức ưu tiên.

### 3.2. Đầu ra

```javascript
{
  found: true,
  path: [{ row: 0, col: 0 }, { row: 1, col: 0 }],
  visitedOrder: [{ row: 0, col: 0 }, { row: 1, col: 0 }],
  pathCost: 1,
  expandedNodes: 2
}
```

Đây là ví dụ minh họa hợp đồng, không phải kết quả của mê cung đầu vào ở trên.

Quy tắc:
- Có đường đi: `path` gồm cả Start và Goal; các ô kề nhau theo 4 hướng và không là vật cản; `pathCost = path.length - 1` với lưới đồng chi phí.
- Không có đường đi: `found=false`, `path=[]`, `pathCost=null`.
- `visitedOrder` ghi thứ tự **mở rộng** các trạng thái, không trùng; `expandedNodes = visitedOrder.length`.
- Start trùng Goal: `path` chứa đúng một vị trí, `pathCost=0`.
- Tất cả kết quả tuân thủ `validateResult()` của `searchContract.js`. Các kiểm tra sâu về tính liên tục của đường đi cần được bổ sung trong unit test thuật toán nếu validator chưa kiểm tra.

### 3.3. Heuristic và giới hạn

Greedy dùng `h(n) = |row_n-row_G| + |col_n-col_G|`; UCS dùng `g(n)`; A* dùng `g(n)+h(n)`. BFS tìm đường ít bước nhất trên lưới đồng chi phí; Greedy và DFS không bảo đảm tối ưu. Không bổ sung ô có trọng số trong phạm vi hiện tại.

## 4. Luồng thực thi và trạng thái ứng dụng

```text
Chọn thuật toán / chỉnh sửa mê cung
             ↓
          App.jsx
   validateInput({grid,start,goal})
             ↓
   Gọi thuật toán được chọn
             ↓
      validateResult(result)
             ↓
 Lưu kết quả và executionTimeMs
             ↓
 MazeGrid / Animation / Statistics / Comparison
```

`App.jsx` chịu trách nhiệm quản lý tối thiểu: `maze`, `selectedAlgorithm`, `result`, `error` và dữ liệu các lượt chạy dùng cho so sánh. Đo thời gian thực thi tại tầng điều phối, không thêm `executionTimeMs` vào Search Contract.

Khi mê cung hoặc vị trí Start/Goal thay đổi, phải xóa hoặc vô hiệu hóa kết quả, thống kê và tiến trình animation trước đó. Nếu thuật toán chưa triển khai, hiển thị thông báo tương ứng; không dùng số liệu giả.

## 5. Hợp đồng tích hợp component

Các props dưới đây là **quy ước mục tiêu cần đối chiếu với component hiện có** trước khi triển khai; không mặc định đã được hỗ trợ.

| Component | Dữ liệu vào | Tín hiệu/đầu ra |
|---|---|---|
| `ControlPanel` | `selectedAlgorithm`, trạng thái chạy | `onAlgorithmChange`, `onRun`, `onReset` |
| `MazeGrid` | `grid`, `start`, `goal`, `visited`, `path` | Sự kiện chọn ô khi bật chế độ chỉnh sửa (nếu được tích hợp) |
| `MazeEditor` | `grid`, chế độ chỉnh sửa | `onGridChange`, `onEditToggle` |
| `Animation` | `result.visitedOrder`, `result.path` | Chỉ số bước hoặc tập nút đã hiển thị để App truyền sang MazeGrid |
| `Statistics` | `algorithmId`, `result`, `executionTimeMs?` | Hiển thị một kết quả |
| `StatisticsComparison` | Danh sách `{algorithmId, result, executionTimeMs?}` | Bảng so sánh, không tự chạy thuật toán |

**Animation:** Search Contract hiện đủ để mô phỏng thứ tự nút mở rộng và tô đường đi cuối. Không đủ để tái tạo Frontier tại từng bước; không hiển thị Frontier như dữ liệu thật nếu thuật toán chưa xuất thêm thông tin.

**Comparison:** Chỉ hiển thị kết quả thực sự đã chạy; thuật toán chưa có kết quả ghi “Chưa có dữ liệu”. Cùng thuật toán chạy lại trên cùng cấu hình thì thay kết quả cũ. Sau khi sửa mê cung, phải loại bỏ dữ liệu so sánh không còn hợp lệ. Thời gian chạy là metadata ngoài Search Contract.

## 6. Quy tắc tích hợp và kiểm thử

- Mỗi thành viên phát triển trên nhánh được giao và tạo Pull Request vào `develop`; không push trực tiếp `main` hoặc `develop`.
- TV5 là đầu mối điều phối các chỉnh sửa vào `App.jsx`. Thay đổi `grid.js`, `searchContract.js` hoặc component chung phải trao đổi trước khi merge.
- Không chỉnh sửa thuật toán của thành viên khác; không thêm thư viện pathfinding.
- Mỗi thuật toán cần test: tìm được đường, không có đường, Start=Goal, vật cản, đường đi liên tục, không sửa input, thứ tự mở rộng và Search Contract.
- Kiểm tra tối ưu theo từng thuật toán: BFS/UCS/A* trong điều kiện tương ứng; không áp điều kiện tối ưu cho DFS/Greedy.
- Kiểm thử tích hợp: chọn thuật toán → Run → mô phỏng → thống kê; Reset; thay đổi mê cung; trạng thái thuật toán chưa triển khai.

```bash
npm test
npm run lint
npm run build
```

Chỉ merge sau khi các lệnh trên đạt và được review. Tài liệu phân công chi tiết xem `docs/TASKS.md`; hướng dẫn thao tác Git xem `CONTRIBUTING.md`.
