import { formatARS } from "@/lib/format";
import { itemPrice } from "@/lib/cart";
import type { CartItem } from "@/lib/quoteTypes";

interface CartItemCardProps {
  item: CartItem;
  onRemove: (id: string) => void;
}

export function CartItemCard({ item, onRemove }: CartItemCardProps) {
  const { dimensions } = item;
  const price = itemPrice(item);

  return (
    <div className="flex items-start justify-between gap-4 py-4 border-b border-sand last:border-0">
      <div className="flex-1 min-w-0">
        <p className="font-medium text-walnut">Mesa a medida</p>
        <p className="text-sm text-walnut/60 mt-0.5">
          {dimensions.widthCm} × {dimensions.lengthCm} × {dimensions.heightCm} cm
        </p>
      </div>
      <div className="flex items-center gap-3 shrink-0">
        <span className="font-serif text-walnut">{formatARS(price)}</span>
        <button
          type="button"
          onClick={() => onRemove(item.id)}
          aria-label="Eliminar item"
          className="text-walnut/30 hover:text-bark transition text-lg leading-none"
        >
          ×
        </button>
      </div>
    </div>
  );
}
