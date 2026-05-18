import clsx from "clsx";

export default function NutBam({
  children,
  type = "button",
  dangXuLy = false,
  disabled = false,
  bienThe = "chinh",
  kichThuoc = "vua",
  icon: Icon,
  className,
  ...props
}) {
  return (
    <button
      type={type}
      disabled={disabled || dangXuLy}
      className={clsx(
        "nut-bam",
        `nut-${bienThe}`,
        `nut-${kichThuoc}`,
        className
      )}
      {...props}
    >
      {dangXuLy ? (
        <span className="spinner-border spinner-border-sm" />
      ) : (
        Icon && <Icon size={17} />
      )}

      <span>{dangXuLy ? "Đang xử lý..." : children}</span>
    </button>
  );
}