CREATE TABLE IF NOT EXISTS bienthesanpham (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    sanpham_id BIGINT UNSIGNED NOT NULL,
    sku VARCHAR(80) NULL,
    tenthuoctinh1 VARCHAR(100) NULL,
    giatrithuoctinh1 VARCHAR(100) NULL,
    tenthuoctinh2 VARCHAR(100) NULL,
    giatrithuoctinh2 VARCHAR(100) NULL,
    giaban BIGINT UNSIGNED NULL,
    soluongton INT UNSIGNED NOT NULL DEFAULT 0,
    hinhanh VARCHAR(255) NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_bienthesanpham_sanpham FOREIGN KEY (sanpham_id) REFERENCES sanpham(id) ON DELETE CASCADE,
    INDEX idx_bienthesanpham_sanpham (sanpham_id),
    INDEX idx_bienthesanpham_sku (sku)
);
