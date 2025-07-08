import { Button } from '@/components/button';

export default function AvisCommande() {
  return (
    <div className="bg-white border rounded-lg p-6 mb-6 shadow-sm">
      <p className="font-semibold text-lg mb-2">Tu as aimé ta commande ?</p>
      <p className="text-sm text-gray-700 mb-4">
        N’hésite pas à laisser ton avis, cela aide notre communauté 💬
      </p>
      <Button onClick={() => alert('Modal ou lien vers avis à intégrer plus tard')}>
        Laisser un avis
      </Button>
    </div>
  );
}