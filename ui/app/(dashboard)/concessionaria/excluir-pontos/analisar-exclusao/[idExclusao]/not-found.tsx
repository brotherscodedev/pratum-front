import NotFoundComponent from "@/components/ui/not-found";
import { ScrollArea } from "@/components/ui/scroll-area";

export default function NotFound() {
    return (
        <NotFoundComponent status={404} mensage="Ponto de exclusão indisponivel." />
    )
}