CREATE TABLE IF NOT EXISTS lichsukho (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    sanpham_id BIGINT UNSIGNED NOT NULL,
    ly_do VARCHAR(50) NOT NULL COMMENT 'khoi_tao | sua_tay | ban_hang | huy_don | nhap_them',
    so_luong_truoc INT NOT NULL DEFAULT 0,
    so_luong_thay_doi INT NOT NULL DEFAULT 0,
    so_luong_sau INT NOT NULL DEFAULT 0,
    ghi_chu TEXT NULL,
    tham_chieu VARCHAR(100) NULL COMMENT 'ma don hang hoac tham chieu lien quan',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_lichsukho_sanpham FOREIGN KEY (sanpham_id) REFERENCES sanpham(id) ON DELETE CASCADE,
    INDEX idx_lichsukho_sanpham (sanpham_id),
    INDEX idx_lichsukho_created (created_at)
);
