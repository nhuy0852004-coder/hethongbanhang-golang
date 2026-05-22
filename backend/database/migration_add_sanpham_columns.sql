-- Migration: add new product columns to sanpham without deleting existing data
-- Compatible with MySQL versions that do not support ADD COLUMN IF NOT EXISTS / CREATE INDEX IF NOT EXISTS.

SET @db_name := DATABASE();

-- Helper: add column only when it does not already exist.
SET @sql := (
    SELECT IF(
        COUNT(*) = 0,
        'ALTER TABLE sanpham ADD COLUMN sku VARCHAR(80) NULL AFTER madinhdanh',
        'SELECT 1'
    )
    FROM information_schema.COLUMNS
    WHERE TABLE_SCHEMA = @db_name
      AND TABLE_NAME = 'sanpham'
      AND COLUMN_NAME = 'sku'
);
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

SET @sql := (
    SELECT IF(
        COUNT(*) = 0,
        'ALTER TABLE sanpham ADD COLUMN barcode VARCHAR(100) NULL AFTER sku',
        'SELECT 1'
    )
    FROM information_schema.COLUMNS
    WHERE TABLE_SCHEMA = @db_name
      AND TABLE_NAME = 'sanpham'
      AND COLUMN_NAME = 'barcode'
);
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

SET @sql := (
    SELECT IF(
        COUNT(*) = 0,
        'ALTER TABLE sanpham ADD COLUMN motangan TEXT NULL AFTER mota',
        'SELECT 1'
    )
    FROM information_schema.COLUMNS
    WHERE TABLE_SCHEMA = @db_name
      AND TABLE_NAME = 'sanpham'
      AND COLUMN_NAME = 'motangan'
);
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

SET @sql := (
    SELECT IF(
        COUNT(*) = 0,
        'ALTER TABLE sanpham ADD COLUMN motachitiet LONGTEXT NULL AFTER motangan',
        'SELECT 1'
    )
    FROM information_schema.COLUMNS
    WHERE TABLE_SCHEMA = @db_name
      AND TABLE_NAME = 'sanpham'
      AND COLUMN_NAME = 'motachitiet'
);
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

SET @sql := (
    SELECT IF(
        COUNT(*) = 0,
        'ALTER TABLE sanpham ADD COLUMN thuonghieu VARCHAR(150) NULL AFTER motachitiet',
        'SELECT 1'
    )
    FROM information_schema.COLUMNS
    WHERE TABLE_SCHEMA = @db_name
      AND TABLE_NAME = 'sanpham'
      AND COLUMN_NAME = 'thuonghieu'
);
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

SET @sql := (
    SELECT IF(
        COUNT(*) = 0,
        "ALTER TABLE sanpham ADD COLUMN donvitinh VARCHAR(50) NOT NULL DEFAULT 'cái' AFTER thuonghieu",
        'SELECT 1'
    )
    FROM information_schema.COLUMNS
    WHERE TABLE_SCHEMA = @db_name
      AND TABLE_NAME = 'sanpham'
      AND COLUMN_NAME = 'donvitinh'
);
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

SET @sql := (
    SELECT IF(
        COUNT(*) = 0,
        'ALTER TABLE sanpham ADD COLUMN gianhap BIGINT UNSIGNED NOT NULL DEFAULT 0 AFTER donvitinh',
        'SELECT 1'
    )
    FROM information_schema.COLUMNS
    WHERE TABLE_SCHEMA = @db_name
      AND TABLE_NAME = 'sanpham'
      AND COLUMN_NAME = 'gianhap'
);
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

SET @sql := (
    SELECT IF(
        COUNT(*) = 0,
        'ALTER TABLE sanpham ADD COLUMN nguongcanhbao INT UNSIGNED NOT NULL DEFAULT 5 AFTER soluongton',
        'SELECT 1'
    )
    FROM information_schema.COLUMNS
    WHERE TABLE_SCHEMA = @db_name
      AND TABLE_NAME = 'sanpham'
      AND COLUMN_NAME = 'nguongcanhbao'
);
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

SET @sql := (
    SELECT IF(
        COUNT(*) = 0,
        'ALTER TABLE sanpham ADD COLUMN trongluong DECIMAL(10,2) NULL AFTER nguongcanhbao',
        'SELECT 1'
    )
    FROM information_schema.COLUMNS
    WHERE TABLE_SCHEMA = @db_name
      AND TABLE_NAME = 'sanpham'
      AND COLUMN_NAME = 'trongluong'
);
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

SET @sql := (
    SELECT IF(
        COUNT(*) = 0,
        'ALTER TABLE sanpham ADD COLUMN kichthuoc VARCHAR(120) NULL AFTER trongluong',
        'SELECT 1'
    )
    FROM information_schema.COLUMNS
    WHERE TABLE_SCHEMA = @db_name
      AND TABLE_NAME = 'sanpham'
      AND COLUMN_NAME = 'kichthuoc'
);
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

SET @sql := (
    SELECT IF(
        COUNT(*) = 0,
        'ALTER TABLE sanpham ADD COLUMN noibat TINYINT(1) NOT NULL DEFAULT 0 AFTER hinhanh',
        'SELECT 1'
    )
    FROM information_schema.COLUMNS
    WHERE TABLE_SCHEMA = @db_name
      AND TABLE_NAME = 'sanpham'
      AND COLUMN_NAME = 'noibat'
);
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

SET @sql := (
    SELECT IF(
        COUNT(*) = 0,
        'ALTER TABLE sanpham ADD COLUMN banchay TINYINT(1) NOT NULL DEFAULT 0 AFTER noibat',
        'SELECT 1'
    )
    FROM information_schema.COLUMNS
    WHERE TABLE_SCHEMA = @db_name
      AND TABLE_NAME = 'sanpham'
      AND COLUMN_NAME = 'banchay'
);
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

SET @sql := (
    SELECT IF(
        COUNT(*) = 0,
        'ALTER TABLE sanpham ADD COLUMN sanphammoi TINYINT(1) NOT NULL DEFAULT 0 AFTER banchay',
        'SELECT 1'
    )
    FROM information_schema.COLUMNS
    WHERE TABLE_SCHEMA = @db_name
      AND TABLE_NAME = 'sanpham'
      AND COLUMN_NAME = 'sanphammoi'
);
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

SET @sql := (
    SELECT IF(
        COUNT(*) = 0,
        'ALTER TABLE sanpham ADD COLUMN chodattruoc TINYINT(1) NOT NULL DEFAULT 0 AFTER sanphammoi',
        'SELECT 1'
    )
    FROM information_schema.COLUMNS
    WHERE TABLE_SCHEMA = @db_name
      AND TABLE_NAME = 'sanpham'
      AND COLUMN_NAME = 'chodattruoc'
);
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

SET @sql := (
    SELECT IF(
        COUNT(*) = 0,
        'ALTER TABLE sanpham ADD COLUMN thuoctinh TEXT NULL AFTER chodattruoc',
        'ALTER TABLE sanpham MODIFY COLUMN thuoctinh TEXT NULL'
    )
    FROM information_schema.COLUMNS
    WHERE TABLE_SCHEMA = @db_name
      AND TABLE_NAME = 'sanpham'
      AND COLUMN_NAME = 'thuoctinh'
);
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

SET @sql := (
    SELECT IF(
        COUNT(*) = 0,
        'ALTER TABLE sanpham ADD COLUMN bienthe TEXT NULL AFTER thuoctinh',
        'ALTER TABLE sanpham MODIFY COLUMN bienthe TEXT NULL'
    )
    FROM information_schema.COLUMNS
    WHERE TABLE_SCHEMA = @db_name
      AND TABLE_NAME = 'sanpham'
      AND COLUMN_NAME = 'bienthe'
);
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- Helper: create index only when it does not already exist.
SET @sql := (
    SELECT IF(
        COUNT(*) = 0,
        'CREATE INDEX idx_sanpham_sku ON sanpham(sku)',
        'SELECT 1'
    )
    FROM information_schema.STATISTICS
    WHERE TABLE_SCHEMA = @db_name
      AND TABLE_NAME = 'sanpham'
      AND INDEX_NAME = 'idx_sanpham_sku'
);
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

SET @sql := (
    SELECT IF(
        COUNT(*) = 0,
        'CREATE INDEX idx_sanpham_barcode ON sanpham(barcode)',
        'SELECT 1'
    )
    FROM information_schema.STATISTICS
    WHERE TABLE_SCHEMA = @db_name
      AND TABLE_NAME = 'sanpham'
      AND INDEX_NAME = 'idx_sanpham_barcode'
);
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

SET @sql := (
    SELECT IF(
        COUNT(*) = 0,
        'CREATE INDEX idx_sanpham_noibat ON sanpham(noibat)',
        'SELECT 1'
    )
    FROM information_schema.STATISTICS
    WHERE TABLE_SCHEMA = @db_name
      AND TABLE_NAME = 'sanpham'
      AND INDEX_NAME = 'idx_sanpham_noibat'
);
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

SET @sql := (
    SELECT IF(
        COUNT(*) = 0,
        'CREATE INDEX idx_sanpham_banchay ON sanpham(banchay)',
        'SELECT 1'
    )
    FROM information_schema.STATISTICS
    WHERE TABLE_SCHEMA = @db_name
      AND TABLE_NAME = 'sanpham'
      AND INDEX_NAME = 'idx_sanpham_banchay'
);
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

SET @sql := (
    SELECT IF(
        COUNT(*) = 0,
        'CREATE INDEX idx_sanpham_sanphammoi ON sanpham(sanphammoi)',
        'SELECT 1'
    )
    FROM information_schema.STATISTICS
    WHERE TABLE_SCHEMA = @db_name
      AND TABLE_NAME = 'sanpham'
      AND INDEX_NAME = 'idx_sanpham_sanphammoi'
);
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

SET @sql := (
    SELECT IF(
        COUNT(*) = 0,
        'CREATE INDEX idx_sanpham_gianhap ON sanpham(gianhap)',
        'SELECT 1'
    )
    FROM information_schema.STATISTICS
    WHERE TABLE_SCHEMA = @db_name
      AND TABLE_NAME = 'sanpham'
      AND INDEX_NAME = 'idx_sanpham_gianhap'
);
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

SET @sql := (
    SELECT IF(
        COUNT(*) = 0,
        'CREATE INDEX idx_sanpham_nguongcanhbao ON sanpham(nguongcanhbao)',
        'SELECT 1'
    )
    FROM information_schema.STATISTICS
    WHERE TABLE_SCHEMA = @db_name
      AND TABLE_NAME = 'sanpham'
      AND INDEX_NAME = 'idx_sanpham_nguongcanhbao'
);
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;
