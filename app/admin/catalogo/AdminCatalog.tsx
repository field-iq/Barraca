"use client";

import Image from "next/image";
import {
  ArrowDown,
  ArrowUp,
  Eye,
  EyeOff,
  GripVertical,
  ImagePlus,
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
import { AdminShell } from "@/components/admin/AdminShell";
import { Button } from "@/components/ui/button";
import { IconButton } from "@/components/ui/icon-button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { FormField } from "@/components/ui/form-field";
import { Toggle } from "@/components/ui/toggle";
import { Badge } from "@/components/ui/badge";
import { Divider } from "@/components/ui/divider";
import { Alert } from "@/components/feedback/alert";
import { EmptyState } from "@/components/feedback/empty-state";
import { cn } from "@/lib/cn";

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
      setMessage("Creá una categoría antes de agregar un producto.");
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
          name: "Nueva categoría",
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
      setMessage(`Mové los ${productCount} productos de esta categoría antes de eliminarla.`);
      return;
    }
    if (!window.confirm(`¿Eliminar la categoría ${category.name}?`)) return;
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
    <AdminShell title="Catálogo" active="catalogo" externalHref="/" externalLabel="Ver tienda">
        <div className="mb-6 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h2 className="font-heading text-2xl text-nm-text">Administrar tienda</h2>
            <p className="mt-1 text-sm text-nm-muted">
              {cloudStorageConfigured
                ? "Los cambios se guardan en Vercel y se publican al instante."
                : "Modo local: conectá Vercel Blob antes de publicar en producción."}
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Button variant="raised" onClick={addProduct} leading={<Plus size={17} aria-hidden="true" />}>
              Nuevo producto
            </Button>
            <Button
              variant="accent"
              onClick={saveCatalog}
              loading={saveState === "saving"}
              leading={<Save size={17} aria-hidden="true" />}
            >
              {saveState === "saving" ? "Guardando..." : "Guardar y publicar"}
            </Button>
          </div>
        </div>

        {(message || saveState === "success") && (
          <Alert tone={saveState === "success" ? "success" : "warning"} title={message} className="mb-6" />
        )}

        <div className="mb-6 inline-flex gap-1 rounded-pill p-1.5 shadow-soft-inset" role="tablist">
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
            Categorías ({catalog.categories.length})
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
    </AdminShell>
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
      className={cn(
        "nm-transition inline-flex h-10 items-center gap-2 rounded-pill px-5 text-sm font-semibold",
        active ? "bg-nm-surface text-nm-accent shadow-soft-sm" : "text-nm-muted hover:text-nm-text",
      )}
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
    <aside className="overflow-hidden rounded-soft bg-nm-surface shadow-soft lg:sticky lg:top-24 lg:self-start">
      <div className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-nm-muted">
        Orden de aparicion
      </div>
      <div className="max-h-[70vh] space-y-1 overflow-y-auto p-2">
        {ordered.map((product, index) => (
          <div
            key={product.id}
            className={cn(
              "nm-transition flex items-center rounded-soft-sm",
              selectedId === product.id ? "shadow-soft-inset-sm" : "hover:shadow-soft-sm",
            )}
          >
            <button
              type="button"
              onClick={() => onSelect(product.id)}
              className="min-w-0 flex-1 px-3 py-2.5 text-left"
            >
              <span className="flex items-center gap-2">
                {product.visible ? (
                  <Eye size={14} className="shrink-0 text-nm-success" />
                ) : (
                  <EyeOff size={14} className="shrink-0 text-nm-muted/50" />
                )}
                <span className="truncate text-sm font-medium text-nm-text">{product.name}</span>
              </span>
              <span className="mt-1 block truncate pl-[22px] text-xs text-nm-muted">
                {product.dimensions || "Sin medidas"}
              </span>
            </button>
            <div className="mr-1 flex flex-col">
              <IconButton
                label="Subir producto"
                size="sm"
                disabled={index === 0}
                onClick={() => onMove(product.id, -1)}
              >
                <ArrowUp size={14} />
              </IconButton>
              <IconButton
                label="Bajar producto"
                size="sm"
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
    <section className="overflow-hidden rounded-soft bg-nm-surface shadow-soft">
      <div className="flex flex-wrap items-center justify-between gap-3 p-5 sm:px-6">
        <div className="min-w-0">
          <h3 className="truncate font-heading text-xl text-nm-text">{product.name}</h3>
          <p className="mt-0.5 text-xs text-nm-muted">ID: {product.id}</p>
        </div>
        <Toggle
          checked={product.visible}
          onChange={(visible) => onChange({ visible })}
          label="Visible en la tienda"
        />
      </div>

      <div className="space-y-8 p-5 sm:p-6">
        <EditorSection title="Información principal">
          <div className="grid gap-4 sm:grid-cols-2">
            <TextField
              label="Nombre"
              value={product.name}
              onChange={(name) => onChange({ name })}
            />
            <SelectField
              label="Categoría"
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
              label="Título de la ficha"
              value={product.detailTitle}
              onChange={(detailTitle) => onChange({ detailTitle })}
            />
          </div>
          <TextAreaField
            label="Descripción corta"
            value={product.description}
            onChange={(description) => onChange({ description })}
            rows={2}
          />
          <TextAreaField
            label="Descripción para vender el producto"
            value={product.detailDescription}
            onChange={(detailDescription) => onChange({ detailDescription })}
            rows={4}
          />
        </EditorSection>

        <Divider />

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
          <p className="text-sm text-nm-success">
            Ahorro mostrado en la tienda: ${Math.max(0, product.listPrice - product.cashPrice).toLocaleString("es-AR")}
          </p>
        </EditorSection>

        <Divider />

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

        <Divider />

        <div className="flex justify-end">
          <Button variant="danger" onClick={onDelete} leading={<Trash2 size={16} />}>
            Eliminar producto
          </Button>
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
        className="nm-transition flex min-h-32 cursor-pointer flex-col items-center justify-center rounded-soft px-4 text-center shadow-soft-inset hover:shadow-soft-inset-lg"
        onDragOver={(event) => event.preventDefault()}
        onDrop={(event) => {
          event.preventDefault();
          void uploadFiles(event.dataTransfer.files);
        }}
      >
        <UploadCloud size={28} className="text-nm-accent" aria-hidden="true" />
        <span className="mt-2 text-sm font-medium text-nm-text">
          {uploading ? "Subiendo fotos..." : "Arrastrá fotos o seleccioná archivos"}
        </span>
        <span className="mt-1 text-xs text-nm-muted">JPG, PNG o WebP, hasta 4 MB</span>
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

      {error && <p className="text-sm text-nm-danger">{error}</p>}

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
              className="overflow-hidden rounded-soft-sm bg-nm-surface shadow-soft"
            >
              <div className="relative aspect-[3/4] shadow-soft-inset-sm">
                <Image src={src} alt="" fill sizes="180px" className="object-contain" />
                {index === 0 && (
                  <Badge tone="accent" className="absolute left-2 top-2 bg-nm-accent text-nm-accent-fg">
                    Principal
                  </Badge>
                )}
              </div>
              <div className="flex items-center justify-between px-1 py-1">
                <GripVertical size={16} className="ml-1 shrink-0 text-nm-muted/60" />
                <div className="flex">
                  <IconButton
                    label="Mover foto a la izquierda"
                    size="sm"
                    disabled={index === 0}
                    onClick={() => moveImage(index, index - 1)}
                  >
                    <ArrowUp size={15} className="-rotate-90" />
                  </IconButton>
                  <IconButton
                    label="Mover foto a la derecha"
                    size="sm"
                    disabled={index === product.images.length - 1}
                    onClick={() => moveImage(index, index + 1)}
                  >
                    <ArrowDown size={15} className="-rotate-90" />
                  </IconButton>
                  <IconButton
                    label="Quitar foto"
                    size="sm"
                    className="text-nm-danger"
                    onClick={() => onChange(product.images.filter((_, itemIndex) => itemIndex !== index))}
                  >
                    <Trash2 size={15} />
                  </IconButton>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="flex items-center gap-2 text-sm text-nm-muted">
          <ImagePlus size={17} /> Este producto todavía no tiene fotos.
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
    <section className="overflow-hidden rounded-soft bg-nm-surface shadow-soft">
      <div className="flex items-center justify-between gap-4 p-5 sm:px-6">
        <div>
          <h3 className="font-heading text-xl text-nm-text">Categorías</h3>
          <p className="mt-1 text-sm text-nm-muted">Organizan los productos de la tienda.</p>
        </div>
        <Button variant="raised" onClick={onAdd} leading={<Plus size={17} />}>
          Nueva
        </Button>
      </div>

      <div className="space-y-3 p-3 sm:px-6 sm:pb-6">
        {ordered.map((category, index) => (
          <div
            key={category.id}
            className="nm-transition grid gap-4 rounded-soft-sm p-4 shadow-soft-sm hover:shadow-soft lg:grid-cols-[1fr_1.5fr_auto] lg:items-end"
          >
            <TextField
              label="Nombre"
              value={category.name}
              onChange={(name) => onChange(category.id, { name })}
            />
            <TextField
              label="Descripción"
              value={category.description}
              onChange={(description) => onChange(category.id, { description })}
            />
            <div className="flex h-12 items-center justify-between gap-3 lg:justify-end">
              <Toggle
                checked={category.visible}
                onChange={(visible) => onChange(category.id, { visible })}
                label="Visible"
              />
              <span className="text-xs text-nm-muted">{productCounts[category.id] ?? 0} prod.</span>
              <IconButton label="Subir categoría" size="sm" disabled={index === 0} onClick={() => onMove(category.id, -1)}>
                <ArrowUp size={16} />
              </IconButton>
              <IconButton label="Bajar categoría" size="sm" disabled={index === ordered.length - 1} onClick={() => onMove(category.id, 1)}>
                <ArrowDown size={16} />
              </IconButton>
              <IconButton label="Eliminar categoría" size="sm" className="text-nm-danger" onClick={() => onDelete(category)}>
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
    <fieldset className="space-y-4">
      <legend className="mb-1 font-heading text-lg text-nm-text">{title}</legend>
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
    <FormField label={label} className="min-w-0">
      <Input
        type="text"
        value={value}
        placeholder={placeholder}
        onChange={(event) => onChange(event.target.value)}
      />
    </FormField>
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
    <FormField label={label}>
      <Textarea value={value} rows={rows} onChange={(event) => onChange(event.target.value)} />
    </FormField>
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
    <FormField label={label}>
      <Select value={value} options={options} onChange={(event) => onChange(event.target.value)} />
    </FormField>
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
    <FormField label={label}>
      <Input
        type="number"
        min={min}
        max={max}
        value={value}
        onChange={(event) => onChange(Number(event.target.value))}
        leading={prefix ? <span className="text-sm text-nm-muted">{prefix}</span> : undefined}
        trailing={suffix ? <span className="text-sm text-nm-muted">{suffix}</span> : undefined}
      />
    </FormField>
  );
}

function EmptyProducts({ onAdd }: { onAdd: () => void }) {
  return (
    <EmptyState
      title="Todavía no hay productos"
      body=""
      action="Agregar producto"
      onAction={onAdd}
    />
  );
}
