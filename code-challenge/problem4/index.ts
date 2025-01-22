/* 
Provide 3 unique implementations of the following function in TypeScript.

- Comment on the complexity or efficiency of each function.

**Input**: `n` - any integer

*Assuming this input will always produce a result lesser than `Number.MAX_SAFE_INTEGER`*.

**Output**: `return` - summation to `n`, i.e. `sum_to_n(5) === 1 + 2 + 3 + 4 + 5 === 15`.
*/

function sum_to_n_a(n: number): number {
    // S = (số đầu + số cuối) x số số hạng : 2
    // Áp dụng vào ta có số đầu = 1, số cuối = n, số số hạng = n
    return (1 + n) * n / 2
}
// Độ phức tạp thời gian: O(1) Thực hiện duy nhất một phép toán.
// Độ phức tạp không gian: O(1) Không sử dụng thêm biến để lưu trữ kết quả.

function sum_to_n_b(n: number): number {
    let sum = 0;
    for (let i = 1; i <= n; i++) {
        sum += i;
    }
    return sum;
}
// Độ phức tạp thời gian: O(n) Hàm chạy qua tất cả các số từ 1 đến n.
// Độ phức tạp không gian: O(1) Chỉ sử dụng một biến sum để lưu kết quả.

function sum_to_n_c(n: number, sum: number = 0): number {
    if (n === 0) return sum;
    return sum_to_n_c(n - 1, sum + n);
}
// Độ phức tạp thời gian: O(n) Đệ quy n lần.
// Độ phức tạp không gian: O(1) Chỉ sử dụng một biến sum để lưu kết quả,.


console.log('Problem4 Test')
console.log('sum_to_n_a with a = 5', sum_to_n_a(5))
console.log('sum_to_n_b with b = 5', sum_to_n_b(5))
console.log('sum_to_n_c with c = 5', sum_to_n_c(5))