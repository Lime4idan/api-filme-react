import { Share2 } from "lucide-react";
import { Button } from "../styles/ui";
import { useToast } from "../hooks/useToast";

export default function ShareButton({ title, text, url = window.location.href }) {
  const toast = useToast();
  const share = async () => {
    try {
      if (navigator.share) await navigator.share({ title, text, url });
      else { await navigator.clipboard.writeText(url); toast.success("Link copiado para a área de transferência"); }
    } catch (error) {
      if (error.name !== "AbortError") toast.error("Não foi possível compartilhar agora");
    }
  };
  return <Button $variant="ghost" onClick={share}><Share2 size={17} /> Compartilhar</Button>;
}
