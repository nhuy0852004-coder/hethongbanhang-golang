ALTER TABLE sanpham
  ADD COLUMN km_bat_dau  DATETIME NULL DEFAULT NULL COMMENT 'Thời gian bắt đầu khuyến mãi',
  ADD COLUMN km_ket_thuc DATETIME NULL DEFAULT NULL COMMENT 'Thời gian kết thúc khuyến mãi';
