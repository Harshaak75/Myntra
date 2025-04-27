// src/components/ProductCard.jsx
import { Card } from "../ui/card";
import { Button } from "../ui/button";

export default function ProductCard({ product, onApprove, onDelete, onEdit }: any) {
  return (
    <Card className="p-4 space-y-2">
      <h3 className="text-lg font-semibold">{product.name}</h3>
      <p className="text-sm text-gray-600">{product.description}</p>
      <div className="flex gap-2 pt-2">
        <Button onClick={() => onApprove(product.id)}>Approve</Button>
        <Button variant="outline" onClick={() => onEdit(product.id)}>Edit</Button>
        <Button variant="destructive" onClick={() => onDelete(product.id)}>Delete</Button>
      </div>
    </Card>
  );
}
