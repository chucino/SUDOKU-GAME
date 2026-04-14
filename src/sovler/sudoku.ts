var sudoku: any = {};
sudoku.DIGITS = "123456789";
var ROWS = "ABCDEFGHI";
var COLS = sudoku.DIGITS;

// Các biến lưu trữ cấu trúc bàn cờ
var SQUARES: string[] = [];
var UNITS: string[][] = [];
var SQUARE_UNITS_MAP: { [key: string]: string[][] } | any = null;
var SQUARE_PEERS_MAP: { [key: string]: string[] } | any = null;

var MIN_GIVENS = 17;
var NR_SQUARES = 81;

// Cấu hình số ô còn lại dựa trên độ khó
var DIFFICULTY: { [key: string]: number } = {
  easy: 62,
  medium: 53,
  hard: 44,
};

sudoku.BLANK_CHAR = ".";
sudoku.BLANK_BOARD =
  ".................................................................................";

/* ======== KHỞI TẠO HỆ THỐNG =========== */

function initialize() {
  SQUARES = sudoku._cross(ROWS, COLS);
  UNITS = sudoku._get_all_units(ROWS, COLS);
  SQUARE_UNITS_MAP = sudoku._get_square_units_map(SQUARES, UNITS);
  SQUARE_PEERS_MAP = sudoku._get_square_peers_map(SQUARES, SQUARE_UNITS_MAP);
}

/* ====== CÁC HÀM API CHÍNH ====== */

/** TẠO BÀN CỜ MỚI */
sudoku.generate = function (
  difficulty: string | number,
  unique?: boolean,
): string {
  // Xác định số ô cần giữ lại
  if (typeof difficulty === "string" || typeof difficulty === "undefined") {
    difficulty = DIFFICULTY[difficulty as string] || DIFFICULTY.easy;
  }
  difficulty = sudoku._force_range(difficulty, NR_SQUARES + 1, MIN_GIVENS);
  unique = unique || true;

  // Tạo bản đồ ứng viên trống
  var candidates = sudoku._get_candidates_map(sudoku.BLANK_BOARD);
  var shuffled_squares = sudoku._shuffle(SQUARES);

  // Thử điền ngẫu nhiên các số vào bàn cờ
  for (var square of shuffled_squares) {
    var rand_candidate_idx = sudoku._rand_range(candidates[square].length);
    var rand_candidate = candidates[square][rand_candidate_idx];

    // Gán thử giá trị, nếu vi phạm ràng buộc thì dừng vòng lặp
    if (!sudoku._assign(candidates, square, rand_candidate)) break;

    // Lọc danh sách các ô đã xác định
    var single_candidates = [];
    for (var s of SQUARES) {
      if (candidates[s].length === 1) single_candidates.push(candidates[s]);
    }

    // Kiểm tra xem đã đủ số lượng ô theo độ khó chưa
    if (
      single_candidates.length >= (difficulty as number) &&
      sudoku._strip_dups(single_candidates).length >= 8
    ) {
      var board = "";
      var givens_idxs: number[] = [];
      for (var i_idx = 0; i_idx < SQUARES.length; i_idx++) {
        var sq_id = SQUARES[i_idx];
        if (candidates[sq_id].length === 1) {
          board += candidates[sq_id];
          givens_idxs.push(i_idx);
        } else {
          board += sudoku.BLANK_CHAR;
        }
      }

      // Nếu dư ô, xóa bớt ngẫu nhiên để đúng độ khó
      var nr_givens = givens_idxs.length;
      if (nr_givens > (difficulty as number)) {
        givens_idxs = sudoku._shuffle(givens_idxs);
        for (var j = 0; j < nr_givens - (difficulty as number); ++j) {
          var target = givens_idxs[j];
          board =
            board.substring(0, target) +
            sudoku.BLANK_CHAR +
            board.substring(target + 1);
        }
      }
      // Kiểm tra xem bàn cờ có giải được không, nếu được thì trả về
      if (sudoku.solve(board)) return board;
    }
  }
  return sudoku.generate(difficulty);
};

/** GIẢI BÀN CỜ */
sudoku.solve = function (board: string, reverse?: boolean): string | boolean {
  var report = sudoku.validate_board(board);
  if (report !== true) throw report;

  // Sudoku phải có ít nhất 17 ô mới giải duy nhất được
  var nr_givens = 0;
  for (var char of board) {
    if (char !== sudoku.BLANK_CHAR && sudoku._in(char, sudoku.DIGITS))
      nr_givens++;
  }
  if (nr_givens < MIN_GIVENS)
    throw "Quá ít ô điền sẵn. Tối thiểu là " + MIN_GIVENS;

  reverse = reverse || false;
  var candidates = sudoku._get_candidates_map(board);
  var result = sudoku._search(candidates, reverse);

  if (result) {
    var solution = "";
    for (var sq of SQUARES) solution += result[sq];
    return solution;
  }
  return false;
};

/* ======= LOGIC THUẬT TOÁN NỘI BỘ ========== */

// Phân tích bàn cờ chuỗi thành Map các ứng viên khả thi cho từng ô
sudoku._get_candidates_map = function (board: string) {
  var candidate_map: { [key: string]: string } = {};
  var squares_values_map = sudoku._get_square_vals_map(board);

  for (var sq of SQUARES) candidate_map[sq] = sudoku.DIGITS;

  for (var square in squares_values_map) {
    var val = squares_values_map[square];
    if (sudoku._in(val, sudoku.DIGITS)) {
      if (!sudoku._assign(candidate_map, square, val)) return false;
    }
  }
  return candidate_map;
};

// Thử điền số, nếu sai thì quay lui (Backtracking)
sudoku._search = function (candidates: any, reverse: boolean) {
  if (!candidates) return false;

  var max_nr_candidates = 0;
  for (var sq of SQUARES) {
    var nr = candidates[sq].length;
    if (nr > max_nr_candidates) max_nr_candidates = nr;
  }
  if (max_nr_candidates === 1) return candidates;

  var min_nr = 10;
  var min_square = null;
  for (var sq of SQUARES) {
    var nr = candidates[sq].length;
    if (nr < min_nr && nr > 1) {
      min_nr = nr;
      min_square = sq;
    }
  }

  var min_candidates = candidates[min_square as string];
  if (!reverse) {
    for (var val of min_candidates) {
      var copy = JSON.parse(JSON.stringify(candidates));
      var res = sudoku._search(
        sudoku._assign(copy, min_square as string, val),
        reverse,
      );
      if (res) return res;
    }
  } else {
    for (var i = min_candidates.length - 1; i >= 0; --i) {
      var val_rev = min_candidates[i];
      var copy_rev = JSON.parse(JSON.stringify(candidates));
      var res_rev = sudoku._search(
        sudoku._assign(copy_rev, min_square as string, val_rev),
        reverse,
      );
      if (res_rev) return res_rev;
    }
  }
  return false;
};

// Gán giá trị và thực hiện Lan truyền ràng buộc
sudoku._assign = function (candidates: any, square: string, val: string) {
  var other_vals = candidates[square].replace(val, "");
  for (var char of other_vals) {
    if (!sudoku._eliminate(candidates, square, char)) return false;
  }
  return candidates;
};

sudoku._eliminate = function (candidates: any, square: string, val: string) {
  if (!sudoku._in(val, candidates[square])) return candidates;

  candidates[square] = candidates[square].replace(val, "");
  var nr = candidates[square].length;

  if (nr === 0) return false;
  if (nr === 1) {
    var last_val = candidates[square];
    for (var peer of SQUARE_PEERS_MAP[square]) {
      if (!sudoku._eliminate(candidates, peer, last_val)) return false;
    }
  }

  for (var unit of SQUARE_UNITS_MAP[square]) {
    var val_places = [];
    for (var s of unit) {
      if (sudoku._in(val, candidates[s])) val_places.push(s);
    }
    if (val_places.length === 0) return false;
    if (val_places.length === 1) {
      if (!sudoku._assign(candidates, val_places[0], val)) return false;
    }
  }
  return candidates;
};

/* ====== QUẢN LÝ QUAN HỆ Ô VUÔNG ======== */

// Chuyển chuỗi 81 ký tự thành Object
sudoku._get_square_vals_map = function (board: string) {
  var map: { [key: string]: string } = {};
  for (var i = 0; i < SQUARES.length; i++) {
    map[SQUARES[i]] = board[i];
  }
  return map;
};

// Tìm các đơn vị chứa ô hiện tại
sudoku._get_square_units_map = function (squares: string[], units: string[][]) {
  var map: any = {};
  for (var cur of squares) {
    var cur_units = [];
    for (var unit of units) {
      if (unit.indexOf(cur) !== -1) cur_units.push(unit);
    }
    map[cur] = cur_units;
  }
  return map;
};

sudoku._get_square_peers_map = function (squares: string[], units_map: any) {
  var map: any = {};
  for (var cur of squares) {
    var units = units_map[cur];
    var peers: string[] = [];
    for (var unit of units) {
      for (var peer of unit) {
        if (peers.indexOf(peer) === -1 && peer !== cur) peers.push(peer);
      }
    }
    map[cur] = peers;
  }
  return map;
};

sudoku._get_all_units = function (rows: string, cols: string) {
  var units: string[][] = [];
  for (var r of rows) units.push(sudoku._cross(r, cols)); // Hàng
  for (var c of cols) units.push(sudoku._cross(rows, c)); // Cột
  var r_boxes = ["ABC", "DEF", "GHI"],
    c_boxes = ["123", "456", "789"];
  for (var rb of r_boxes) {
    for (var cb of c_boxes) units.push(sudoku._cross(rb, cb)); // Khối 3x3
  }
  return units;
};

/* ====== CÁC HÀM TIỆN ÍCH ======== */

// Kiểm tra tính hợp lệ của chuỗi đầu vào
sudoku.validate_board = function (board: string) {
  if (!board) return "Bảng trống";
  if (board.length !== NR_SQUARES) return "Độ dài bảng phải là 81";
  for (var char of board) {
    if (!sudoku._in(char, sudoku.DIGITS) && char !== sudoku.BLANK_CHAR)
      return "Ký tự lạ: " + char;
  }
  return true;
};

// Tích Descartes: _cross("ABC", "123") -> ["A1", "A2",..."C3"]
sudoku._cross = function (a: string | string[], b: string | string[]) {
  var res = [];
  for (var char_a of a) {
    for (var char_b of b) res.push(char_a + char_b);
  }
  return res;
};

sudoku._in = function (v: string, seq: string | string[]) {
  return seq.indexOf(v) !== -1;
};

// Xáo trộn mảng ngẫu nhiên
sudoku._shuffle = function (seq: any[]) {
  var res: any[] = [];
  for (var i = 0; i < seq.length; ++i) res.push(false);
  for (var item of seq) {
    var ti = sudoku._rand_range(seq.length);
    while (res[ti]) ti = ti + 1 > seq.length - 1 ? 0 : ti + 1;
    res[ti] = item;
  }
  return res;
};

sudoku._rand_range = function (max: number, min?: number) {
  min = min || 0;
  return Math.floor(Math.random() * (max - min)) + min;
};

// Loại bỏ các phần tử trùng lặp trong mảng
sudoku._strip_dups = function (seq: any[]) {
  var res = [],
    map: any = {};
  for (var item of seq) {
    if (!map[item]) {
      res.push(item);
      map[item] = true;
    }
  }
  return res;
};

// Đảm bảo số lượng nằm trong vùng cho phép
sudoku._force_range = function (nr: any, max: number, min: number) {
  nr = parseInt(nr);
  if (isNaN(nr)) return min;
  if (nr < min) return min;
  if (nr > max) return max;
  return nr;
};

// Gọi khởi tạo ngay khi load file
initialize();

// Xuất module cho TypeScript
export const getSudoku = () => sudoku;
