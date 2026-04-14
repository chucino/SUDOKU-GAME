import { getSudoku } from "./sudoku.js";

/** Khởi tạo một mảng rỗng (toàn ký tự '0') để đặt lại bảng dễ dàng. */
let nullArray = [
  "0",
  "0",
  "0",
  "0",
  "0",
  "0",
  "0",
  "0",
  "0",
  "0",
  "0",
  "0",
  "0",
  "0",
  "0",
  "0",
  "0",
  "0",
  "0",
  "0",
  "0",
  "0",
  "0",
  "0",
  "0",
  "0",
  "0",
  "0",
  "0",
  "0",
  "0",
  "0",
  "0",
  "0",
  "0",
  "0",
  "0",
  "0",
  "0",
  "0",
  "0",
  "0",
  "0",
  "0",
  "0",
  "0",
  "0",
  "0",
  "0",
  "0",
  "0",
  "0",
  "0",
  "0",
  "0",
  "0",
  "0",
  "0",
  "0",
  "0",
  "0",
  "0",
  "0",
  "0",
  "0",
  "0",
  "0",
  "0",
  "0",
  "0",
  "0",
  "0",
  "0",
  "0",
  "0",
  "0",
  "0",
  "0",
  "0",
  "0",
  "0",
];

/* ====== HÀM TÍNH TOÁN TỌA ĐỘ VÀ CHỈ SỐ ====== */

/** Lấy tọa độ [hàng, cột] của ô trung tâm trong một Box (0-8). */
function _getBoxCenter(box: number) {
  switch (box) {
    case 0:
      return [1, 1]; // Box 1
    case 1:
      return [1, 4]; // Box 2
    case 2:
      return [1, 7]; // Box 3
    case 3:
      return [4, 1]; // Box 4
    case 4:
      return [4, 4]; // Box 5
    case 5:
      return [4, 7]; // Box 6
    case 6:
      return [7, 1]; // Box 7
    case 7:
      return [7, 4]; // Box 8
    default:
      return [7, 7]; // Box 9
  }
}

/* Chuyển đổi từ số thứ tự Box (0-8) và số thứ tự Cell nội bộ (0-8) sang chỉ số index phẳng (0-80) của mảng. */
function _getIndexOfCell(box: number, cell: number) {
  let [row, column] = _getBoxCenter(box);
  switch (cell) {
    case 0: {
      row--;
      column--;
      break;
    }
    case 1: {
      row--;
      break;
    }
    case 2: {
      row--;
      column++;
      break;
    }
    case 3: {
      column--;
      break;
    }
    case 4: {
      break;
    }
    case 5: {
      column++;
      break;
    }
    case 6: {
      row++;
      column--;
      break;
    }
    case 7: {
      row++;
      break;
    }
    case 8: {
      row++;
      column++;
      break;
    }
  }
  return row * 9 + column;
}

/* Kiểm tra xem một ô trong Box cụ thể đã được điền hay chưa. */
function _cellAvailable(tempInitArray: string[], box: number, value: number) {
  return tempInitArray[_getIndexOfCell(box, value)] === "0" ? 0 : 1;
}

/* ====== LOGIC TẠO ĐỘ KHÓ VÀ CÂN BẰNG ====== */

/* Tạo một bảng Sudoku duy nhất từ một bảng đã giải xong. */
function _generateUniqueSudoku(
  solvedArray: string[],
  difficulty: string,
  e?: string,
) {
  let currentDifficulty = difficulty;
  let minimumCells, maximumCells, totalCells, box, cell;

  let tempInitArray = nullArray.slice();
  let boxCounts = [0, 0, 0, 0, 0, 0, 0, 0, 0];
  let boxesAvailable = [];
  let cellsAvailable = [];

  if (e) currentDifficulty = e;

  // Thiết lập cấu hình dựa trên độ khó
  if (currentDifficulty === "Easy") {
    minimumCells = 3; // Mỗi box ít nhất 3 ô
    maximumCells = 7; // Mỗi box tối đa 7 ô
    totalCells = 45; // Tổng cộng 45 ô được điền
  } else if (currentDifficulty === "Medium") {
    minimumCells = 2;
    maximumCells = 6;
    totalCells = 40;
  } else {
    minimumCells = 1;
    maximumCells = 5;
    totalCells = 30;
  }

  // Lặp cho đến khi điền đủ số lượng ô yêu cầu
  for (let i = 0; i < totalCells; i++) {
    boxesAvailable = [];

    // Ưu tiên các Box chưa đạt số lượng ô tối thiểu
    for (let j = 0; j < 9; j++) {
      if (boxCounts[j] < minimumCells) {
        boxesAvailable.push(j);
      }
    }

    //Nếu các Box đều đạt min, tìm các Box chưa đạt số lượng tối đa
    if (boxesAvailable.length === 0) {
      for (let j = 0; j < 9; j++) {
        if (boxCounts[j] < maximumCells) {
          boxesAvailable.push(j);
        }
      }
    }

    // Chọn ngẫu nhiên một Box hợp lệ
    box = boxesAvailable[(Math.random() * boxesAvailable.length) | 0];

    // Tìm các ô còn trống trong Box
    cellsAvailable = [];
    for (let j = 0; j < 9; j++) {
      if (tempInitArray[_getIndexOfCell(box, j)] === "0") {
        cellsAvailable.push(j);
      }
    }

    // Chọn ngẫu nhiên một ô và chép giá trị từ bảng đã giải sang
    cell = cellsAvailable[(Math.random() * cellsAvailable.length) | 0];
    let index = _getIndexOfCell(box, cell);
    tempInitArray[index] = solvedArray[index];
    boxCounts[box]++;
  }

  return tempInitArray;
}

/* ====== XUẤT DỮ LIỆU ====== */

/* Hàm chính để lấy một cặp bảng: [Bảng câu đố, Bảng lời giải] */
export const getUniqueSudoku = (difficulty: string, e?: string) => {
  let temporaryInitArray = nullArray.slice();
  let temporarySolvedArray = nullArray.slice();
  let sudoku = getSudoku();

  /* Tạo bảng thô từ sudoku.js */
  let str = sudoku.generate(60);

  [...str].forEach((value, index) => {
    temporaryInitArray[index] = value === "." ? "0" : value;
  });

  /* Giải bảng thô đó để lấy đáp án hoàn chỉnh */
  str = sudoku.solve(str);
  [...str].forEach((value, index) => {
    temporarySolvedArray[index] = value;
  });

  /* Áp dụng thuật toán lọc ô để tạo bảng câu đố có độ khó chuẩn */
  temporaryInitArray = _generateUniqueSudoku(
    temporarySolvedArray,
    difficulty,
    e,
  );

  return [temporaryInitArray, temporarySolvedArray];
};
