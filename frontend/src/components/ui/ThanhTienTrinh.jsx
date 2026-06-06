import { useNavigation } from "react-router-dom";

export default function ThanhTienTrinh() {
  const navigation = useNavigation();
  const dangChuyen = navigation.state !== "idle";

  if (!dangChuyen) return null;

  return <div className="thanh-tien-trinh" />;
}
