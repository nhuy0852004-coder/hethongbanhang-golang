CREATE DATABASE IF NOT EXISTS hethongbanhang
CHARACTER SET utf8mb4
COLLATE utf8mb4_unicode_ci;

USE hethongbanhang;

SET FOREIGN_KEY_CHECKS = 0;

DROP TABLE IF EXISTS chitietphieunhap;
DROP TABLE IF EXISTS phieunhap;
DROP TABLE IF EXISTS nhacungcap;
DROP TABLE IF EXISTS thongbao;
DROP TABLE IF EXISTS chitietgiohang;
DROP TABLE IF EXISTS giohang;
DROP TABLE IF EXISTS chitietdonhang;
DROP TABLE IF EXISTS donhang;
DROP TABLE IF EXISTS khachhang;
DROP TABLE IF EXISTS anhsanpham;
DROP TABLE IF EXISTS sanpham;
DROP TABLE IF EXISTS danhmuc;
DROP TABLE IF EXISTS caidatcuahang;
DROP TABLE IF EXISTS nguoidung;
DROP TABLE IF EXISTS vaitro;

SET FOREIGN_KEY_CHECKS = 1;

CREATE TABLE vaitro (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    tenvaitro VARCHAR(50) NOT NULL UNIQUE,
    mota VARCHAR(255) NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE nguoidung (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    hoten VARCHAR(120) NOT NULL,
    email VARCHAR(150) NOT NULL UNIQUE,
    matkhau VARCHAR(255) NOT NULL,
    sodienthoai VARCHAR(20) NULL,
    vaitro_id BIGINT UNSIGNED NOT NULL,
    trangthai ENUM('hoat_dong', 'tam_khoa') DEFAULT 'hoat_dong',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_nguoidung_email (email),
    INDEX idx_nguoidung_sodienthoai (sodienthoai),
    CONSTRAINT fk_nguoidung_vaitro FOREIGN KEY (vaitro_id) REFERENCES vaitro(id)
);

CREATE TABLE danhmuc (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    tendanhmuc VARCHAR(150) NOT NULL,
    duongdan VARCHAR(180) NOT NULL UNIQUE,
    mota TEXT NULL,
    hinhanh VARCHAR(255) NULL,
    danhmuccha_id BIGINT UNSIGNED NULL,
    thutu INT DEFAULT 0,
    trangthai ENUM('hien_thi', 'an') DEFAULT 'hien_thi',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP NULL,
    INDEX idx_danhmuc_tendanhmuc (tendanhmuc),
    INDEX idx_danhmuc_trangthai (trangthai),
    CONSTRAINT fk_danhmuc_cha FOREIGN KEY (danhmuccha_id) REFERENCES danhmuc(id) ON DELETE SET NULL
);

CREATE TABLE sanpham (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    madinhdanh VARCHAR(80) NOT NULL UNIQUE,
    sku VARCHAR(80) NULL,
    barcode VARCHAR(100) NULL,
    tensanpham VARCHAR(180) NOT NULL,
    mota TEXT NULL,
    motangan TEXT NULL,
    motachitiet LONGTEXT NULL,
    thuonghieu VARCHAR(150) NULL,
    donvitinh VARCHAR(50) NOT NULL DEFAULT 'cái',
    gianhap BIGINT UNSIGNED NOT NULL DEFAULT 0,
    giaban BIGINT UNSIGNED NOT NULL DEFAULT 0,
    giakhuyenmai BIGINT UNSIGNED NULL,
    soluongton INT UNSIGNED NOT NULL DEFAULT 0,
    nguongcanhbao INT UNSIGNED NOT NULL DEFAULT 5,
    trongluong DECIMAL(10,2) NULL,
    kichthuoc VARCHAR(120) NULL,
    hinhanh VARCHAR(255) NULL,
    noibat TINYINT(1) NOT NULL DEFAULT 0,
    banchay TINYINT(1) NOT NULL DEFAULT 0,
    sanphammoi TINYINT(1) NOT NULL DEFAULT 0,
    chodattruoc TINYINT(1) NOT NULL DEFAULT 0,
    thuoctinh TEXT NULL,
    bienthe TEXT NULL,
    trangthai ENUM('hien_thi', 'an', 'het_hang') DEFAULT 'hien_thi',
    danhmuc_id BIGINT UNSIGNED NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP NULL,
    INDEX idx_sanpham_tensanpham (tensanpham),
    INDEX idx_sanpham_madinhdanh (madinhdanh),
    INDEX idx_sanpham_sku (sku),
    INDEX idx_sanpham_barcode (barcode),
    INDEX idx_sanpham_trangthai (trangthai),
    INDEX idx_sanpham_danhmuc (danhmuc_id),
    INDEX idx_sanpham_noibat (noibat),
    INDEX idx_sanpham_banchay (banchay),
    INDEX idx_sanpham_sanphammoi (sanphammoi),
    INDEX idx_sanpham_gianhap (gianhap),
    INDEX idx_sanpham_nguongcanhbao (nguongcanhbao),
    CONSTRAINT fk_sanpham_danhmuc FOREIGN KEY (danhmuc_id) REFERENCES danhmuc(id) ON DELETE SET NULL
);

CREATE TABLE anhsanpham (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    sanpham_id BIGINT UNSIGNED NOT NULL,
    duongdan VARCHAR(255) NOT NULL,
    anhchinh TINYINT(1) DEFAULT 0,
    thutu INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_anhsanpham_sanpham FOREIGN KEY (sanpham_id) REFERENCES sanpham(id) ON DELETE CASCADE
);

CREATE TABLE khachhang (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    hoten VARCHAR(120) NOT NULL,
    sodienthoai VARCHAR(20) NOT NULL,
    email VARCHAR(150) NULL,
    diachi TEXT NULL,
    trangthai ENUM('hoat_dong', 'tam_khoa') DEFAULT 'hoat_dong',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_khachhang_hoten (hoten),
    INDEX idx_khachhang_sodienthoai (sodienthoai),
    INDEX idx_khachhang_email (email)
);

CREATE TABLE donhang (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    madonhang VARCHAR(80) NOT NULL UNIQUE,
    khachhang_id BIGINT UNSIGNED NULL,
    hoten VARCHAR(120) NOT NULL,
    sodienthoai VARCHAR(20) NOT NULL,
    email VARCHAR(150) NULL,
    diachi TEXT NOT NULL,
    tongtien BIGINT UNSIGNED NOT NULL DEFAULT 0,
    trangthai ENUM('cho_xac_nhan', 'da_xac_nhan', 'dang_giao_hang', 'hoan_thanh', 'da_huy') DEFAULT 'cho_xac_nhan',
    ghichu TEXT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP NULL,
    INDEX idx_donhang_madonhang (madonhang),
    INDEX idx_donhang_sodienthoai (sodienthoai),
    INDEX idx_donhang_trangthai (trangthai),
    INDEX idx_donhang_created_at (created_at),
    CONSTRAINT fk_donhang_khachhang FOREIGN KEY (khachhang_id) REFERENCES khachhang(id) ON DELETE SET NULL
);

CREATE TABLE chitietdonhang (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    donhang_id BIGINT UNSIGNED NOT NULL,
    sanpham_id BIGINT UNSIGNED NULL,
    tensanpham VARCHAR(180) NOT NULL,
    hinhanh VARCHAR(255) NULL,
    soluong INT UNSIGNED NOT NULL,
    dongia BIGINT UNSIGNED NOT NULL,
    thanhtien BIGINT UNSIGNED NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_chitietdonhang_donhang FOREIGN KEY (donhang_id) REFERENCES donhang(id) ON DELETE CASCADE,
    CONSTRAINT fk_chitietdonhang_sanpham FOREIGN KEY (sanpham_id) REFERENCES sanpham(id) ON DELETE SET NULL
);

CREATE TABLE giohang (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    khachhang_id BIGINT UNSIGNED NULL,
    makhach VARCHAR(120) NULL,
    tongtien BIGINT UNSIGNED DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_giohang_khachhang FOREIGN KEY (khachhang_id) REFERENCES khachhang(id) ON DELETE CASCADE
);

CREATE TABLE chitietgiohang (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    giohang_id BIGINT UNSIGNED NOT NULL,
    sanpham_id BIGINT UNSIGNED NOT NULL,
    soluong INT UNSIGNED NOT NULL DEFAULT 1,
    dongia BIGINT UNSIGNED NOT NULL DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_chitietgiohang_giohang FOREIGN KEY (giohang_id) REFERENCES giohang(id) ON DELETE CASCADE,
    CONSTRAINT fk_chitietgiohang_sanpham FOREIGN KEY (sanpham_id) REFERENCES sanpham(id) ON DELETE CASCADE
);

CREATE TABLE thongbao (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    tieude VARCHAR(180) NOT NULL,
    noidung TEXT NOT NULL,
    loai VARCHAR(80) NOT NULL,
    dadoc TINYINT(1) DEFAULT 0,
    dulieu JSON NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_thongbao_dadoc (dadoc),
    INDEX idx_thongbao_loai (loai)
);

CREATE TABLE caidatcuahang (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    tencuahang VARCHAR(180) NOT NULL,
    logo VARCHAR(255) NULL,
    sodienthoai VARCHAR(20) NULL,
    email VARCHAR(150) NULL,
    diachi TEXT NULL,
    chinhsachvanchuyen TEXT NULL,
    chinhsachdoitra TEXT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE nhacungcap (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    tennhacungcap VARCHAR(180) NOT NULL,
    sodienthoai VARCHAR(20) NULL,
    email VARCHAR(150) NULL,
    diachi TEXT NULL,
    trangthai ENUM('hoat_dong', 'tam_khoa') DEFAULT 'hoat_dong',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_nhacungcap_ten (tennhacungcap),
    INDEX idx_nhacungcap_sodienthoai (sodienthoai)
);

CREATE TABLE phieunhap (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    maphieunhap VARCHAR(80) NOT NULL UNIQUE,
    nhacungcap_id BIGINT UNSIGNED NULL,
    tongtien BIGINT UNSIGNED NOT NULL DEFAULT 0,
    ghichu TEXT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_phieunhap_nhacungcap FOREIGN KEY (nhacungcap_id) REFERENCES nhacungcap(id) ON DELETE SET NULL
);

CREATE TABLE chitietphieunhap (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    phieunhap_id BIGINT UNSIGNED NOT NULL,
    sanpham_id BIGINT UNSIGNED NOT NULL,
    soluong INT UNSIGNED NOT NULL,
    dongia BIGINT UNSIGNED NOT NULL,
    thanhtien BIGINT UNSIGNED NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_chitietphieunhap_phieunhap FOREIGN KEY (phieunhap_id) REFERENCES phieunhap(id) ON DELETE CASCADE,
    CONSTRAINT fk_chitietphieunhap_sanpham FOREIGN KEY (sanpham_id) REFERENCES sanpham(id) ON DELETE CASCADE
);

INSERT INTO vaitro (tenvaitro, mota)
VALUES 
('quantri', 'Quản trị hệ thống'),
('nhanvien', 'Nhân viên bán hàng');

INSERT INTO caidatcuahang (tencuahang, sodienthoai, email, diachi, chinhsachvanchuyen, chinhsachdoitra)
VALUES (
    'Cửa hàng của tôi',
    '0901234567',
    'cuahang@example.com',
    'Việt Nam',
    'Giao hàng toàn quốc.',
    'Đổi trả trong 7 ngày nếu sản phẩm lỗi.'
);
