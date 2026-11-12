export function ZyloxLogo({ withText = true }: { withText?: boolean }) {
  return (
    <div className="flex items-center gap-3">
      <img
        src="/images/ZyloxShopRemoveBG.png"
        alt="Zylox Shop"
        className="w-10 h-10 object-contain rounded-lg"
        onError={(e) => {
          e.currentTarget.style.display = "none";
        }}
      />
      {withText && (
        <div className="flex flex-col leading-none">
          <span className="text-xl font-black tracking-tight text-white">ZYLOX</span>
          <span className="text-[9px] font-medium tracking-[0.2em] text-gray-500 uppercase">Shop</span>
        </div>
      )}
    </div>
  );
}
