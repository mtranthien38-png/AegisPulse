# Tool tạo biên bản nghiệm thu hàng loạt

Đây là tool Windows chạy bằng Python + Excel automation để đọc workbook mẫu `.xls/.xlsx`, lấy dữ liệu từ sheet `Data` và danh mục ở `DANH MUC NT TSX`, rồi sinh ra một workbook tổng hợp gồm:

- từng sheet biên bản đã được đổ dữ liệu
- sheet `Tổng hợp` để mở nhanh từng biên bản
- sheet `Danh mục` có link ngược về từng biên bản

## Cách chạy

```bash
python tools/bienban_nt_tool.py
```

## Cách dùng

1. Chọn file workbook nguồn, ví dụ `BIÊN BẢN NT TLS, TCNL.xls`.
2. Bấm `Nạp workbook` để tool đọc sheet và tự nhận sheet template.
3. Chọn sheet template nếu muốn đổi sang mẫu khác.
4. Chọn file đầu ra `.xlsx`.
5. Bấm `Sinh biên bản`.

## Ghi chú

- Tool giữ nguyên định dạng của sheet mẫu bằng cách dùng Excel COM để copy template.
- Nếu cột `SỐ BBNT` trống, tool tự sinh mã theo nhóm liên tiếp từ số gần nhất phía trên.
- Nếu dòng danh mục có ngày nghiệm thu, tool sẽ tự chèn ngày vào phần thời gian nghiệm thu.

