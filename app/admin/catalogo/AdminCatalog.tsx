"use client";

import Image from "next/image";
import Link from "next/link";
import {
  ArrowDown,
  ArrowUp,
  ExternalLink,
  Eye,
  EyeOff,
  GripVertical,
  ImagePlus,
  LogOut,
  Package,
  Plus,
  Save,
  Tags,
  Trash2,
  UploadCloud,
} from "lucide-react";
import { useMemo, useState } from "react";
import type {
  CatalogCategory,
  CatalogData,
  CatalogProduct,
} from "@/lib/catalog";

interface AdminCatalogProps {
  initialCatalog: CatalogData;
  cloudStorageConfigured: boolean;
}
type AdminTab = "products" | "categories";
type SaveState = "idle" | "saving" | "success" | "error";

export function AdminCatalog({
  initialCatalog,
  cloudStorageConfigured,
}: AdminCatalogProps) {
  const [catalog, setCatalog] = useState(initialCatalog);
  const [tab, setTab] = useState<AdminTab>("products");
  const [selectedProductId, setSelectedProductId] = useState(
    initialCatalog.products[0]?.id ?? "",
  );
  const [saveState, setSaveState] = useState<SaveState>("idle");
  const [message, setMessage] = useState("");

  const selectedProduct = catalog.products.find(
    (product) => product.id === selectedProductId,
  );

  function markChanged(nextCatalog: CatalogData) {
    setCatalog(nextCatalog);
    setSaveState("idle");
    setMessage("");
  }

  function updateProduct(id: string, updates: Partial<CatalogProduct>) {
    markChanged({
      ...catalog,
      products: catalog.products.map((product) =>
        product.id === id ? { ...product, ...updates } : product,
      ),
    });
  }

  function updateCategory(id: string, updates: Partial<CatalogCategory>) {
    markChanged({
      ...catalog,
      categories: catalog.categories.map((category) =>
        category.id === id ? { ...category, ...updates } : category,
      ),
    });
  }

  function addProduct() {
    const category = catalog.categories[0];
    if (!category) {
      setTab("categories");
      setMessage("Crea una categoria antes de agregar un producto.");
      return;
    }

    const id = `producto-${crypto.randomUUID().slice(0, 8)}`;
    const product: CatalogProduct = {
      id,
      categoryId: category.id,
      name: "Nuevo producto",
      description: "",
      detailTitle: "Nuevo producto",
      detailDescription: "",
      dimensions: "",
      listPrice: 0,
      cashPrice: 0,
      images: [],
      imageAlt: "Mueble artesanal de La Barraca De Juan",
      sortOrder: catalog.products.length,
      visible: false,
    };

    markChanged({ ...catalog, products: [...catalog.products, product] });
    setSelectedProductId(id);
    setTab("products");
  }

  function deleteProduct(product: CatalogProduct) {
    if (!window.confirm(`Eliminar ${product.name}?`)) return;
    const products = catalog.products.filter((item) => item.id !== product.id);
    markChanged({ ...catalog, products });
    setSelectedProductId(products[0]?.id ?? "");
  }

  function moveProduct(productId: string, direction: -1 | 1) {
    const ordered = [...catalog.products].sort((a, b) => a.sortOrder - b.sortOrder);
    const index = ordered.findIndex((product) => product.id === productId);
    const target = index + direction;
    if (index < 0 || target < 0 || target >= ordered.length) return;
    [ordered[index], ordered[target]] = [ordered[target], ordered[index]];
    markChanged({
      ...catalog,
      products: ordered.map((product, sortOrder) => ({ ...product, sortOrder })),
    });
  }

  function addCategory() {
    const id = `categoria-${crypto.randomUUID().slice(0, 8)}`;
    markChanged({
      ...catalog,
      categories: [
        ...catalog.categories,
        {
          id,
          name: "Nueva categoria",
          description: "",
          sortOrder: catalog.categories.length,
          visible: false,
        },
      ],
    });
  }

  function deleteCategory(category: CatalogCategory) {
    const productCount = catalog.products.filter(
      (product) => product.categoryId === category.id,
    ).length;
    if (productCount > 0) {
      setMessage(`Move los ${productCount} productos de esta categoria antes de eliminarla.`);
      return;
    }
    if (!window.confirm(`Eliminar la categoria ${category.name}?`)) return;
    markChanged({
      ...catalog,
      categories: catalog.categories.filter((item) => item.id !== category.id),
    });
  }

  function moveCategory(categoryId: string, direction: -1 | 1) {
    const ordered = [...catalog.categories].sort((a, b) => a.sortOrder - b.sortOrder);
    const index = ordered.findIndex((category) => category.id === categoryId);
    const target = index + direction;
    if (index < 0 || target < 0 || target >= ordered.length) return;
    [ordered[index], ordered[target]] = [ordered[target], ordered[index]];
    markChanged({
      ...catalog,
      categories: ordered.map((category, sortOrder) => ({ ...category, sortOrder })),
    });
  }

  async function saveCatalog() {
    setSaveState("saving");
    setMessage("");
    try {
      const response = await fetch("/api/admin/catalog", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(catalog),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error ?? "No se pudo guardar.");
      setCatalog(data);
      setSaveState("success");
      setMessage("Cambios publicados correctamente.");
    } catch (error) {
      setSaveState("error");
      setMessage(error instanceof Error ? error.message : "No se pudo guardar.");
    }
  }

  return (
    <div className="min-h-screen bg-[#f5f4f1] text-walnut">
      <header className="sticky top-0 z-20 border-b border-sand bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
          <div className="min-w-0">
            <h1 className="truncate font-serif text-xl">Catalogo</h1>
            <p className="text-xs text-walnut/55">La Barraca De Juan</p>
          </div>
          <div className="flex items-center gap-2">
            <Link
              href="/"
              target="_blank"
              className="inline-flex h-10 items-center gap-2 rounded-md border border-sand px-3 text-sm hover:bg-sand/40"
            >
              <ExternalLink size={16} aria-hidden="true" />
              <span className="hidden sm:inline">Ver tienda</span>
            </Link>
            <a
              href="/api/admin/logout"
              className="inline-flex h-10 items-center gap-2 rounded-md border border-sand px-3 text-sm hover:bg-sand/40"
            >
              <LogOut size={16} aria-hidden="true" />
              <span className="hidden sm:inline">Salir</span>
            </a>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-5 sm:px-6 sm:py-8">
        <div className="mb-5 flex flex-col gap-3 border-b border-sand pb-5 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h2 className="font-serif text-2xl">Administrar tienda</h2>
            <p className="mt-1 text-sm text-walnut/60">
              {cloudStorageConfigured
                ? "Los cambios se guardan en Vercel y se publican al instante."
                : "Modo local: conecta Vercel Blob antes de publicar en produccion."}
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={addProduct}
              className="inline-flex h-10 items-center gap-2 rounded-md border border-bark px-3 text-sm font-medium text-bark hover:bg-sand/50"
            >
              <Plus size={17} aria-hidden="true" /> Nuevo producto
            </button>
            <button
              type="button"
              onClick={saveCatalog}
              disabled={saveState === "saving"}
              className="inline-flex h-10 items-center gap-2 rounded-md bg-bark px-4 text-sm font-medium text-cream hover:bg-walnut disabled:opacity-50"
            >
              <Save size={17} aria-hidden="true" />
              {saveState === "saving" ? "Guardando..." : "Guardar y publicar"}
            </button>
          </div>
        </div>

        {(message || saveState === "success") && (
          <div
            className={`mb-5 rounded-md border px-4 py-3 text-sm ${
              saveState === "success"
                ? "border-emerald-200 bg-emerald-50 text-emerald-800"
                : "border-amber-200 bg-amber-50 text-amber-900"
            }`}
          >
            {message}
          </div>
        )}

        <div className="mb-5 flex gap-1 border-b border-sand" role="tablist">
          <TabButton
            active={tab === "products"}
            onClick={() => setTab("products")}
            icon={<Package size={17} />}
          >
            Productos ({catalog.products.length})
          </TabButton>
          <TabButton
            active={tab === "categories"}
            onClick={() => setTab("categories")}
            icon={<Tags size={17} />}
          >
            Categorias ({catalog.categories.length})
          </TabButton>
        </div>

        {tab === "products" && (
          <div className="grid gap-5 lg:grid-cols-[300px_minmax(0,1fr)]">
            <ProductList
              products={catalog.products}
              selectedId={selectedProductId}
              onSelect={setSelectedProductId}
              onMove={moveProduct}
            />
            {selectedProduct ? (
              <ProductEditor
                product={selectedProduct}
                categories={catalog.categories}
                onChange={(updates) => updateProduct(selectedProduct.id, updates)}
                onDelete={() => deleteProduct(selectedProduct)}
              />
            ) : (
              <EmptyProducts onAdd={addProduct} />
            )}
          </div>
        )}

        {tab === "categories" && (
          <CategoryEditor
            categories={catalog.categories}
            productCounts={catalog.products.reduce<Record<string, number>>(
              (counts, product) => ({
                ...counts,
                [product.categoryId]: (counts[product.categoryId] ?? 0) + 1,
              }),
              {},
            )}
            onAdd={addCategory}
            onChange={updateCategory}
            onDelete={deleteCategory}
            onMove={moveCategory}
          />
        )}
      </main>
    </div>
  );
}

function TabButton({
  active,
  onClick,
  icon,
  children,
}: {
  active: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      role="tab"
      aria-selected={active}
      onClick={onClick}
      className={`inline-flex h-11 items-center gap-2 border-b-2 px-3 text-sm font-medium ${
        active
          ? "border-bark text-bark"
          : "border-transparent text-walnut/55 hover:text-walnut"
      }`}
    >
      {icon}
      {children}
    </button>
  );
}

function ProductList({
  products,
  selectedId,
  onSelect,
  onMove,
}: {
  products: CatalogProduct[];
  selectedId: string;
  onSelect: (id: string) => void;
  onMove: (id: string, direction: -1 | 1) => void;
}) {
  const ordered = useMemo(
    () => [...products].sort((a, b) => a.sortOrder - b.sortOrder),
    [products],
  );

  return (
    <aside className="overflow-hidden rounded-md border border-sand bg-white lg:sticky lg:top-24 lg:self-start">
      <div className="border-b border-sand px-4 py-3 text-xs font-semibold uppercase text-walnut/50">
        Orden de aparicion
      </div>
      <div className="max-h-[70vh] overflow-y-auto">
        {ordered.map((product, index) => (
          <div
            key={product.id}
            className={`flex items-center border-b border-sand/70 last:border-0 ${
              selectedId === product.id ? "bg-sand/55" : "hover:bg-sand/25"
            }`}
          >
            <button
              type="button"
              onClick={() => onSelect(product.id)}
              className="min-w-0 flex-1 px-4 py-3 text-left"
            >
              <span className="flex items-center gap-2">
                {product.visible ? (
                  <Eye size={14} className="shrink-0 text-emerald-700" />
                ) : (
                  <EyeOff size={14} className="shrink-0 text-walnut/35" />
                )}
                <span className="truncate text-sm font-medium">{product.name}</span>
              </span>
              <span className="mt-1 block truncate pl-[22px] text-xs text-walnut/50">
                {product.dimensions || "Sin medidas"}
              </span>
            </button>
            <div className="mr-2 flex flex-col">
              <IconButton
                label="Subir producto"
                disabled={index === 0}
                onClick={() => onMove(product.id, -1)}
              >
                <ArrowUp size={14} />
              </IconButton>
              <IconButton
                label="Bajar producto"
                disabled={index === ordered.length - 1}
                onClick={() => onMove(product.id, 1)}
              >
                <ArrowDown size={14} />
              </IconButton>
            </div>
          </div>
        ))}
      </div>
    </aside>
  );
}

function ProductEditor({
  product,
  categories,
  onChange,
  onDelete,
}: {
  product: CatalogProduct;
  categories: CatalogCategory[];
  onChange: (updates: Partial<CatalogProduct>) => void;
  onDelete: () => void;
}) {
  const discount = product.listPrice > 0
    ? Math.max(0, Math.round((1 - product.cashPrice / product.listPrice) * 100))
    : 0;

  return (
    <section className="overflow-hidden rounded-md border border-sand bg-white">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-sand px-4 py-4 sm:px-6">
        <div className="min-w-0">
          <h3 className="truncate font-serif text-xl">{product.name}</h3>
          <p className="mt-0.5 text-xs text-walnut/45">ID: {product.id}</p>
        </div>
        <label className="inline-flex cursor-pointer items-center gap-2 text-sm font-medium">
          <input
            type="checkbox"
            checked={product.visible}
            onChange={(event) => onChange({ visible: event.target.checked })}
            className="h-4 w-4 accent-emerald-700"
          />
          Visible en la tienda
        </label>
      </div>

      <div className="space-y-8 p-4 sm:p-6">
        <EditorSection title="Informacion principal">
          <div className="grid gap-4 sm:grid-cols-2">
            <TextField
              label="Nombre"
              value={product.name}
              onChange={(name) => onChange({ name })}
            />
            <SelectField
              label="Categoria"
              value={product.categoryId}
              options={categories.map((category) => ({
                value: category.id,
                label: category.name,
              }))}
              onChange={(categoryId) => onChange({ categoryId })}
            />
            <TextField
              label="Medidas"
              value={product.dimensions}
              onChange={(dimensions) => onChange({ dimensions })}
              placeholder="Ej: 2.00 x 1.00 mts"
            />
            <TextField
              label="Titulo de la ficha"
              value={product.detailTitle}
              onChange={(detailTitle) => onChange({ detailTitle })}
            />
          </div>
          <TextAreaField
            label="Descripcion corta"
            value={product.description}
            onChange={(description) => onChange({ description })}
            rows={2}
          />
          <TextAreaField
            label="Descripcion para vender el producto"
            value={product.detailDescription}
            onChange={(detailDescription) => onChange({ detailDescription })}
            rows={4}
          />
        </EditorSection>

        <EditorSection title="Precios y descuento">
          <div className="grid gap-4 sm:grid-cols-3">
            <NumberField
              label="Precio de lista"
              value={product.listPrice}
              prefix="$"
              onChange={(listPrice) => onChange({ listPrice })}
            />
            <NumberField
              label="Precio en efectivo"
              value={product.cashPrice}
              prefix="$"
              onChange={(cashPrice) => onChange({ cashPrice })}
            />
            <NumberField
              label="Descuento"
              value={discount}
              suffix="%"
              min={0}
              max={100}
              onChange={(percentage) =>
                onChange({
                  cashPrice: Math.round(product.listPrice * (1 - percentage / 100)),
                })
              }
            />
          </div>
          <p className="text-sm text-emerald-800">
            Ahorro mostrado en la tienda: ${Math.max(0, product.listPrice - product.cashPrice).toLocaleString("es-AR")}
          </p>
        </EditorSection>

        <EditorSection title="Fotos">
          <ImageManager
            product={product}
            onChange={(images) => onChange({ images })}
          />
          <TextField
            label="Texto alternativo de las fotos"
            value={product.imageAlt}
            onChange={(imageAlt) => onChange({ imageAlt })}
          />
        </EditorSection>

        <div className="flex justify-end border-t border-sand pt-5">
          <button
            type="button"
            onClick={onDelete}
            className="inline-flex h-10 items-center gap-2 rounded-md border border-red-200 px-3 text-sm font-medium text-red-700 hover:bg-red-50"
          >
            <Trash2 size={16} /> Eliminar producto
          </button>
        </div>
      </div>
    </section>
  );
}

function ImageManager({
  product,
  onChange,
}: {
  product: CatalogProduct;
  onChange: (images: string[]) => void;
}) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);

  async function uploadFiles(files: FileList | File[]) {
    const selected = Array.from(files).filter((file) => file.type.startsWith("image/"));
    if (selected.length === 0) return;
    setUploading(true);
    setError("");

    try {
      const uploaded: string[] = [];
      for (const file of selected) {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("productId", product.id);
        const response = await fetch("/api/admin/catalog/images", {
          method: "POST",
          body: formData,
        });
        const data = await response.json();
        if (!response.ok) throw new Error(data.error ?? "No se pudo subir la imagen.");
        uploaded.push(data.url);
      }
      onChange([...product.images, ...uploaded]);
    } catch (uploadError) {
      setError(uploadError instanceof Error ? uploadError.message : "No se pudo subir la imagen.");
    } finally {
      setUploading(false);
    }
  }

  function moveImage(from: number, to: number) {
    if (to < 0 || to >= product.images.length || from === to) return;
    const images = [...product.images];
    const [image] = images.splice(from, 1);
    images.splice(to, 0, image);
    onChange(images);
  }

  return (
    <div className="space-y-4">
      <label
        className="flex min-h-32 cursor-pointer flex-col items-center justify-center rounded-md border-2 border-dashed border-sand bg-[#faf9f7] px-4 text-center hover:border-accent"
        onDragOver={(event) => event.preventDefault()}
        onDrop={(event) => {
          event.preventDefault();
          void uploadFiles(event.dataTransfer.files);
        }}
      >
        <UploadCloud size={28} className="text-bark" aria-hidden="true" />
        <span className="mt-2 text-sm font-medium">
          {uploading ? "Subiendo fotos..." : "Arrastra fotos o selecciona archivos"}
        </span>
        <span className="mt-1 text-xs text-walnut/50">JPG, PNG o WebP, hasta 4 MB</span>
        <input
          type="file"
          accept="image/jpeg,image/png,image/webp"
          multiple
          disabled={uploading}
          className="sr-only"
          onChange={(event) => {
            if (event.target.files) void uploadFiles(event.target.files);
            event.target.value = "";
          }}
        />
      </label>

      {error && <p className="text-sm text-red-700">{error}</p>}

      {product.images.length > 0 ? (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 xl:grid-cols-4">
          {product.images.map((src, index) => (
            <div
              key={`${src}-${index}`}
              draggable
              onDragStart={() => setDraggedIndex(index)}
              onDragOver={(event) => event.preventDefault()}
              onDrop={() => {
                if (draggedIndex !== null) moveImage(draggedIndex, index);
                setDraggedIndex(null);
              }}
              className="overflow-hidden rounded-md border border-sand bg-white"
            >
              <div className="relative aspect-[3/4] bg-sand/50">
                <Image src={src} alt="" fill sizes="180px" className="object-contain" />
                {index === 0 && (
                  <span className="absolute left-2 top-2 rounded-md bg-walnut px-2 py-1 text-xs font-medium text-cream">
                    Principal
                  </span>
                )}
              </div>
              <div className="flex h-10 items-center justify-between px-1">
                <GripVertical size={16} className="ml-1 text-walnut/35" />
                <div className="flex">
                  <IconButton
                    label="Mover foto a la izquierda"
                    disabled={index === 0}
                    onClick={() => moveImage(index, index - 1)}
                  >
                    <ArrowUp size={15} className="-rotate-90" />
                  </IconButton>
                  <IconButton
                    label="Mover foto a la derecha"
                    disabled={index === product.images.length - 1}
                    onClick={() => moveImage(index, index + 1)}
                  >
                    <ArrowDown size={15} className="-rotate-90" />
                  </IconButton>
                  <IconButton
                    label="Quitar foto"
                    onClick={() => onChange(product.images.filter((_, itemIndex) => itemIndex !== index))}
                    danger
                  >
                    <Trash2 size={15} />
                  </IconButton>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="flex items-center gap-2 text-sm text-walnut/50">
          <ImagePlus size={17} /> Este producto todavia no tiene fotos.
        </div>
      )}
    </div>
  );
}

function CategoryEditor({
  categories,
  productCounts,
  onAdd,
  onChange,
  onDelete,
  onMove,
}: {
  categories: CatalogCategory[];
  productCounts: Record<string, number>;
  onAdd: () => void;
  onChange: (id: string, updates: Partial<CatalogCategory>) => void;
  onDelete: (category: CatalogCategory) => void;
  onMove: (id: string, direction: -1 | 1) => void;
}) {
  const ordered = [...categories].sort((a, b) => a.sortOrder - b.sortOrder);

  return (
    <section className="overflow-hidden rounded-md border border-sand bg-white">
      <div className="flex items-center justify-between gap-4 border-b border-sand px-4 py-4 sm:px-6">
        <div>
          <h3 className="font-serif text-xl">Categorias</h3>
          <p className="mt-1 text-sm text-walnut/55">Organizan los productos de la tienda.</p>
        </div>
        <button
          type="button"
          onClick={onAdd}
          className="inline-flex h-10 items-center gap-2 rounded-md border border-bark px-3 text-sm font-medium text-bark"
        >
          <Plus size={17} /> Nueva
        </button>
      </div>

      <div className="divide-y divide-sand">
        {ordered.map((category, index) => (
          <div key={category.id} className="grid gap-4 px-4 py-5 sm:px-6 lg:grid-cols-[1fr_1.5fr_auto] lg:items-end">
            <TextField
              label="Nombre"
              value={category.name}
              onChange={(name) => onChange(category.id, { name })}
            />
            <TextField
              label="Descripcion"
              value={category.description}
              onChange={(description) => onChange(category.id, { description })}
            />
            <div className="flex h-10 items-center justify-between gap-2 lg:justify-end">
              <label className="mr-2 inline-flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={category.visible}
                  onChange={(event) => onChange(category.id, { visible: event.target.checked })}
                  className="h-4 w-4 accent-emerald-700"
                />
                Visible
              </label>
              <span className="text-xs text-walnut/45">{productCounts[category.id] ?? 0} prod.</span>
              <IconButton label="Subir categoria" disabled={index === 0} onClick={() => onMove(category.id, -1)}>
                <ArrowUp size={16} />
              </IconButton>
              <IconButton label="Bajar categoria" disabled={index === ordered.length - 1} onClick={() => onMove(category.id, 1)}>
                <ArrowDown size={16} />
              </IconButton>
              <IconButton label="Eliminar categoria" danger onClick={() => onDelete(category)}>
                <Trash2 size={16} />
              </IconButton>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

function EditorSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <fieldset className="space-y-4 border-t border-sand pt-5 first:border-0 first:pt-0">
      <legend className="mb-4 font-serif text-lg">{title}</legend>
      {children}
    </fieldset>
  );
}

function TextField({
  label,
  value,
  onChange,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}) {
  return (
    <label className="block min-w-0 text-sm font-medium">
      {label}
      <input
        type="text"
        value={value}
        placeholder={placeholder}
        onChange={(event) => onChange(event.target.value)}
        className="mt-1.5 h-10 w-full rounded-md border border-sand bg-white px-3 font-normal outline-none focus:border-accent focus:ring-2 focus:ring-accent/20"
      />
    </label>
  );
}

function TextAreaField({
  label,
  value,
  onChange,
  rows,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  rows: number;
}) {
  return (
    <label className="block text-sm font-medium">
      {label}
      <textarea
        value={value}
        rows={rows}
        onChange={(event) => onChange(event.target.value)}
        className="mt-1.5 w-full resize-y rounded-md border border-sand bg-white px-3 py-2 font-normal outline-none focus:border-accent focus:ring-2 focus:ring-accent/20"
      />
    </label>
  );
}

function SelectField({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: string;
  options: Array<{ value: string; label: string }>;
  onChange: (value: string) => void;
}) {
  return (
    <label className="block text-sm font-medium">
      {label}
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="mt-1.5 h-10 w-full rounded-md border border-sand bg-white px-3 font-normal outline-none focus:border-accent focus:ring-2 focus:ring-accent/20"
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>{option.label}</option>
        ))}
      </select>
    </label>
  );
}

function NumberField({
  label,
  value,
  onChange,
  prefix,
  suffix,
  min = 0,
  max,
}: {
  label: string;
  value: number;
  onChange: (value: number) => void;
  prefix?: string;
  suffix?: string;
  min?: number;
  max?: number;
}) {
  return (
    <label className="block text-sm font-medium">
      {label}
      <span className="relative mt-1.5 block">
        {prefix && <span className="absolute left-3 top-1/2 -translate-y-1/2 text-walnut/45">{prefix}</span>}
        <input
          type="number"
          min={min}
          max={max}
          value={value}
          onChange={(event) => onChange(Number(event.target.value))}
          className={`h-10 w-full rounded-md border border-sand bg-white px-3 font-normal outline-none focus:border-accent focus:ring-2 focus:ring-accent/20 ${prefix ? "pl-7" : ""} ${suffix ? "pr-9" : ""}`}
        />
        {suffix && <span className="absolute right-3 top-1/2 -translate-y-1/2 text-walnut/45">{suffix}</span>}
      </span>
    </label>
  );
}

function IconButton({
  label,
  onClick,
  disabled,
  danger,
  children,
}: {
  label: string;
  onClick: () => void;
  disabled?: boolean;
  danger?: boolean;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      title={label}
      aria-label={label}
      disabled={disabled}
      onClick={onClick}
      className={`inline-flex h-8 w-8 items-center justify-center rounded-md disabled:opacity-25 ${
        danger ? "text-red-600 hover:bg-red-50" : "text-walnut/55 hover:bg-sand/60"
      }`}
    >
      {children}
    </button>
  );
}

function EmptyProducts({ onAdd }: { onAdd: () => void }) {
  return (
    <div className="flex min-h-80 flex-col items-center justify-center rounded-md border border-dashed border-sand bg-white p-8 text-center">
      <Package size={32} className="text-walnut/30" />
      <p className="mt-3 font-medium">Todavia no hay productos</p>
      <button type="button" onClick={onAdd} className="mt-4 inline-flex h-10 items-center gap-2 rounded-md bg-bark px-4 text-sm font-medium text-cream">
        <Plus size={17} /> Agregar producto
      </button>
    </div>
  );
}
