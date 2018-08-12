let tree = []

let field = [
  [0, 2, 0,  0, 0, 0,  0, 0, 0],
  [0, 0, 0,  6, 0, 1,  0, 0, 4],
  [0, 8, 3,  0, 0, 0,  5, 0, 0],
  [0, 5, 0,  0, 3, 0,  0, 8, 0],
  [0, 0, 0,  4, 0, 6,  0, 0, 0],
  [0, 0, 0,  0, 0, 0,  0, 0, 0],
  [1, 0, 0,  0, 0, 0,  0, 0, 0],
  [0, 0, 0,  0, 8, 0,  0, 2, 0],
  [7, 0, 0,  0, 0, 0,  0, 0, 6]
]

// deep copy
let copyArray = (field) => {
  let array = [
    [0, 0, 0,  0, 0, 0,  0, 0, 0],
    [0, 0, 0,  0, 0, 0,  0, 0, 0],
    [0, 0, 0,  0, 0, 0,  0, 0, 0],
    [0, 0, 0,  0, 0, 0,  0, 0, 0],
    [0, 0, 0,  0, 0, 0,  0, 0, 0],
    [0, 0, 0,  0, 0, 0,  0, 0, 0],
    [0, 0, 0,  0, 0, 0,  0, 0, 0],
    [0, 0, 0,  0, 0, 0,  0, 0, 0],
    [0, 0, 0,  0, 0, 0,  0, 0, 0]
  ]
  for (let y = 0; y < 9; y++) {
    for (let x = 0; x < 9; x++) {
      array[y][x] = field[y][x]
    }
  }
  return array
}

// numを入れることができるところを探す
let check = (field, num) => {
  let array = [
    [0, 0, 0,  0, 0, 0,  0, 0, 0],
    [0, 0, 0,  0, 0, 0,  0, 0, 0],
    [0, 0, 0,  0, 0, 0,  0, 0, 0],
    [0, 0, 0,  0, 0, 0,  0, 0, 0],
    [0, 0, 0,  0, 0, 0,  0, 0, 0],
    [0, 0, 0,  0, 0, 0,  0, 0, 0],
    [0, 0, 0,  0, 0, 0,  0, 0, 0],
    [0, 0, 0,  0, 0, 0,  0, 0, 0],
    [0, 0, 0,  0, 0, 0,  0, 0, 0]
  ]

  for (let y = 0; y < 9; y++) {
    for (let x = 0; x < 9; x++) {
      if (field[y][x] != 0) array[y][x] = 1
      if (field[y][x] === num) {
        // 行と列を埋める
        for (let i = 0; i < 9; i++) array[i][x] = array[y][i] = 1

        // ブロック内を埋める
        let group = {
          x: Math.floor(x / 3),
          y: Math.floor(y / 3)
        }
        for (let i = group.y * 3; i < group.y * 3 + 3; i++) {
          for (let j = group.x * 3; j < group.x * 3 + 3; j++) {
            array[i][j] = 1
          }
        }
      }
    }
  }
  // console.log(array)
  // 代入可能な場所を0、代入できない場所を1として表現した9x9行列
  return array
}

// 代入可能な場所と比較して一意に定まる場所に実際に値を代入していく
let update = (field, array, num) => {
  // 各行に代入可能な場所が一箇所だった場合代入する
  for (let y = 0; y < 9; y++) {
    let a = {sum : 0, x : 0, y : 0}
    for (let x = 0; x < 9; x++) {
      if (array[y][x] === 0) {
        a.sum += 1
        a.x = x
        a.y = y
      }
    }
    if (a.sum === 1) field[a.y][a.x] = num
  }

  // 各列に代入可能な場所が一意に定まるときに代入する
  for (let x = 0; x < 9; x++) {
    let a = {sum : 0, x : 0, y : 0}
    for (let y = 0; y < 9; y++) {
      if (array[y][x] === 0) {
        a.sum += 1
        a.x = x
        a.y = y
      }
    }
    if (a.sum === 1) field[a.y][a.x] = num
  }

  // ブロック内で代入可能な場所が一意に定まるときに代入する
  for (let x = 0; x < 3; x++) {
    for (let y = 0; y < 3; y++) {
      let a = {sum : 0, x : 0, y : 0}
      for (let i = y * 3; i < y * 3 + 3; i++) {
        for (let j = x * 3; j < x * 3 + 3; j++) {
          if (array[i][j] === 0) {
            a.sum += 1
            a.x = j
            a.y = i
          }
        }
      }
      if (a.sum === 1) field[a.y][a.x] = num
    }
  }
  // console.log(field)
  return field  // 代入後の配列を返す
}

// 終了判定　
let judge = (field) => {
  let sum = 0
  let a = 0;
  for (let y = 0; y < 9; y++) {
    for (let x = 0; x < 9; x++) {
      if (field[y][x] === 0) a += 1
      sum += field[y][x]
    }
  }
  if (sum === 405) return -1  // 総和が405になっている時には正解として-1を返す
  return a                    // 残り埋まっていない枠の数を返す
}

// 一意に定まらない時は、幅探索でqueueにpushする
let branch = (field) => {
  let min = { num : 0, sum : 81, array : field }
  for (let i = 0 ; i < 9; i++) {
    let array = check(field, i)
    let sum = 81
    for (let y = 0; y < 9; y++) {
      for (let x = 0; x < 9; x++) {
        sum -= array[y][x]
      }
    }
    if (sum < min.sum && sum > 0) {
      min.sum = sum
      min.num = i
      min.array = array
    }
    //console.log (min)
  }
  if (min.num != 0) {
    for (let y = 0; y < 9; y++) {
      for (let x = 0; x < 9; x++) {
        if (min.array[y][x] == 0) {
          let b = copyArray(field)
          b[y][x] = min.num
          tree.push(b)
        }
      }
    }
  }
}


let array
console.log(copyArray(field)) // 初期値の提示

// 一意に定まる場所を探して代入する
let main = (field) => {
  //console.log(copyArray(field))
  let empty = 81
  let a = 81
  while (empty > 0) { // 空欄がある限りloop
    for(let num = 1; num <= 9 ; num++) update(field, check(field, num), num)
    a = judge(field)
    empty = (empty != a) ? a : -2
    switch (empty) {
      case -1:   // 正常終了
        console.log("Success!");
        console.log(field);
        if (tree.length > 0) main(tree.pop())
        break
      case 0 :  // 枠が埋まったのに総和がおかしいとき
        if (tree.length > 0) main(tree.pop())
        console.log("Wrong!");
        break
      case -2:  // 一意に定まらなかったとき
        //console.log("Not unique" + a);
        break;
      default: break
    }
  }

  if (empty == -2) { // 一意に定まらなかった時にbranchを切る
    branch(field)
    if (tree.length > 0) console.log(main(tree.pop()))  // queueから先頭を取り出して試行
  }
  //console.log(field)
  return a
}
main(field)
