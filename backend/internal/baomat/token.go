package baomat

import (
	"errors"
	"time"

	"github.com/golang-jwt/jwt/v5"
)

type ThongTinToken struct {
	NguoiDungID uint64 `json:"nguoidung_id"`
	Email       string `json:"email"`
	VaiTro      string `json:"vaitro"`
	jwt.RegisteredClaims
}

func TaoToken(nguoidungID uint64, email string, vaitro string, biMat string) (string, error) {
	thongTin := ThongTinToken{
		NguoiDungID: nguoidungID,
		Email:       email,
		VaiTro:      vaitro,
		RegisteredClaims: jwt.RegisteredClaims{
			ExpiresAt: jwt.NewNumericDate(time.Now().Add(24 * time.Hour)),
			IssuedAt:  jwt.NewNumericDate(time.Now()),
			Subject:   email,
		},
	}

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, thongTin)

	return token.SignedString([]byte(biMat))
}

func DocToken(chuoiToken string, biMat string) (*ThongTinToken, error) {
	token, loi := jwt.ParseWithClaims(chuoiToken, &ThongTinToken{}, func(token *jwt.Token) (interface{}, error) {
		return []byte(biMat), nil
	})

	if loi != nil {
		return nil, loi
	}

	thongTin, hopLe := token.Claims.(*ThongTinToken)

	if !hopLe || !token.Valid {
		return nil, errors.New("token không hợp lệ")
	}

	return thongTin, nil
}